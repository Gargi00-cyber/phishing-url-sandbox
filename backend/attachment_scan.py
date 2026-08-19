import os
import hashlib
import httpx
from dotenv import load_dotenv

load_dotenv()

VT_API_KEY = os.getenv("VIRUSTOTAL_API_KEY")
HA_API_KEY = os.getenv("HYBRID_ANALYSIS_API_KEY")

VT_BASE = "https://www.virustotal.com/api/v3"
HA_BASE = "https://hybrid-analysis.com/api/v2"

MAX_FILE_SIZE = 32 * 1024 * 1024  # 32MB, VirusTotal's simple-upload limit


class AttachmentScanError(Exception):
    pass


def compute_sha256(file_bytes: bytes) -> str:
    return hashlib.sha256(file_bytes).hexdigest()


def check_virustotal_hash(sha256: str) -> dict | None:
    try:
        response = httpx.get(
            f"{VT_BASE}/files/{sha256}",
            headers={"x-apikey": VT_API_KEY},
            timeout=15,
        )
        if response.status_code == 404:
            return None
        response.raise_for_status()
        return response.json()
    except httpx.HTTPStatusError:
        return None
    except httpx.RequestError as e:
        raise AttachmentScanError(f"Could not reach VirusTotal: {str(e)}")


def upload_to_virustotal(file_bytes: bytes, filename: str) -> str:
    try:
        response = httpx.post(
            f"{VT_BASE}/files",
            headers={"x-apikey": VT_API_KEY},
            files={"file": (filename, file_bytes)},
            timeout=60,
        )
        response.raise_for_status()
        return response.json()["data"]["id"]
    except httpx.RequestError as e:
        raise AttachmentScanError(f"Could not upload to VirusTotal: {str(e)}")


def get_virustotal_analysis(analysis_id: str) -> dict:
    try:
        response = httpx.get(
            f"{VT_BASE}/analyses/{analysis_id}",
            headers={"x-apikey": VT_API_KEY},
            timeout=15,
        )
        response.raise_for_status()
        return response.json()
    except httpx.RequestError as e:
        raise AttachmentScanError(f"Could not check VirusTotal analysis: {str(e)}")


def submit_to_hybrid_analysis(file_bytes: bytes, filename: str) -> str:
    try:
        response = httpx.post(
            f"{HA_BASE}/submit/file",
            headers={
                "api-key": HA_API_KEY,
                "user-agent": "Falcon Sandbox",
            },
            data={"environment_id": "120"},
            files={"file": (filename, file_bytes)},
            timeout=60,
        )
        response.raise_for_status()
        return response.json()["job_id"]
    except httpx.RequestError as e:
        raise AttachmentScanError(f"Could not submit to Hybrid Analysis: {str(e)}")


def get_hybrid_analysis_report(job_id: str) -> dict:
    try:
        response = httpx.get(
            f"{HA_BASE}/report/{job_id}/summary",
            headers={
                "api-key": HA_API_KEY,
                "user-agent": "Falcon Sandbox",
            },
            timeout=15,
        )
        response.raise_for_status()
        return response.json()
    except httpx.RequestError as e:
        raise AttachmentScanError(f"Could not check Hybrid Analysis report: {str(e)}")