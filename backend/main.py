import base64

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from url_validation import validate_url, UrlValidationError
from fastapi import UploadFile, File
from attachment_scan import (
    compute_sha256, check_virustotal_hash, upload_to_virustotal,
    get_virustotal_analysis, submit_to_hybrid_analysis,
    get_hybrid_analysis_report, AttachmentScanError, MAX_FILE_SIZE,
)
from rate_limit import check_rate_limit, RateLimitExceeded
from detonate import detonate, DetonationError
from domain_age import get_domain_age_days
from risk_scoring import calculate_risk_score


app = FastAPI(title="Phishing URL Sandbox API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ScanRequest(BaseModel):
    url: str


@app.get("/")
def health_check():
    return {"status": "ok", "message": "Phishing URL Sandbox API is running"}


@app.post("/scan")
def submit_scan(request: ScanRequest, http_request: Request):
    client_ip = http_request.client.host

    try:
        check_rate_limit(client_ip)
    except RateLimitExceeded as e:
        raise HTTPException(
            status_code=429,
            detail=f"Too many scan requests. Try again in {e.retry_after} seconds.",
        )

    try:
        clean_url = validate_url(request.url)
    except UrlValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))

    try:
        result = detonate(clean_url)
    except DetonationError as e:
        raise HTTPException(status_code=502, detail=str(e))

    domain_age_days = get_domain_age_days(result["final_url"])

    risk = calculate_risk_score(
        hops=result["hops"],
        final_url=result["final_url"],
        domain_age_days=domain_age_days,
    )

    screenshot_b64 = base64.b64encode(result["screenshot_bytes"]).decode("utf-8")

    return {
        "status": "completed",
        "submitted_url": clean_url,
        "final_url": result["final_url"],
        "hops": result["hops"],
        "screenshot_base64": screenshot_b64,
        "risk_score": risk["score"],
        "risk_level": risk["risk_level"],
        "risk_breakdown": risk["breakdown"],
        "domain_age_days": domain_age_days,
    }

@app.post("/scan-attachment")
async def scan_attachment(file: UploadFile = File(...), http_request: Request = None):
    client_ip = http_request.client.host
    try:
        check_rate_limit(client_ip)
    except RateLimitExceeded as e:
        raise HTTPException(status_code=429, detail=f"Too many requests. Try again in {e.retry_after} seconds.")

    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 32MB).")
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="File is empty.")

    sha256 = compute_sha256(file_bytes)

    try:
        vt_cached = check_virustotal_hash(sha256)
        vt_analysis_id = None
        if vt_cached is None:
            vt_analysis_id = upload_to_virustotal(file_bytes, file.filename)

        ha_job_id = submit_to_hybrid_analysis(file_bytes, file.filename)
    except AttachmentScanError as e:
        raise HTTPException(status_code=502, detail=str(e))

    return {
        "sha256": sha256,
        "filename": file.filename,
        "vt_cached_result": vt_cached,
        "vt_analysis_id": vt_analysis_id,
        "ha_job_id": ha_job_id,
    }


@app.get("/attachment-status/virustotal/{analysis_id}")
def virustotal_status(analysis_id: str):
    try:
        return get_virustotal_analysis(analysis_id)
    except AttachmentScanError as e:
        raise HTTPException(status_code=502, detail=str(e))


@app.get("/attachment-status/hybrid-analysis/{job_id}")
def hybrid_analysis_status(job_id: str):
    try:
        return get_hybrid_analysis_report(job_id)
    except AttachmentScanError as e:
        raise HTTPException(status_code=502, detail=str(e))