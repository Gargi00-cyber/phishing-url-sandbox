from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from url_validation import validate_url, UrlValidationError
from rate_limit import check_rate_limit, RateLimitExceeded

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

    return {"status": "accepted", "url": clean_url}