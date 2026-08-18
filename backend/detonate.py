import os
import httpx
from dotenv import load_dotenv

load_dotenv()

BROWSERLESS_API_KEY = os.getenv("BROWSERLESS_API_KEY")
BROWSERLESS_SCREENSHOT_URL = f"https://production-sfo.browserless.io/screenshot?token={BROWSERLESS_API_KEY}"

MAX_REDIRECTS = 10
REQUEST_TIMEOUT = 15  # seconds, per hop


class DetonationError(Exception):
    pass


def follow_redirect_chain(start_url: str) -> list[dict]:
    """
    Follows the redirect chain starting from start_url, hop by hop,
    with a hard limit and timeout so a malicious/broken URL can't hang
    the whole request. Returns a list of hops:
      [{"url": ..., "status_code": ...}, ...]
    The last entry is the final destination.
    """
    hops = []

    try:
        with httpx.Client(
            follow_redirects=True,
            max_redirects=MAX_REDIRECTS,
            timeout=REQUEST_TIMEOUT,
        ) as client:
            response = client.get(start_url)

            # response.history holds every intermediate redirect response
            for hop in response.history:
                hops.append({"url": str(hop.url), "status_code": hop.status_code})

            # the final landed page
            hops.append({"url": str(response.url), "status_code": response.status_code})

    except httpx.TooManyRedirects:
        raise DetonationError(f"Too many redirects (limit is {MAX_REDIRECTS}).")
    except httpx.TimeoutException:
        raise DetonationError("The URL took too long to respond (possible stall/hang).")
    except httpx.RequestError as e:
        raise DetonationError(f"Could not reach the URL: {str(e)}")

    return hops


def capture_screenshot(final_url: str) -> bytes:
    """
    Calls Browserless's /screenshot REST endpoint on the final URL and
    returns the raw PNG image bytes.
    """
    payload = {
        "url": final_url,
        "options": {"fullPage": True, "type": "png"},
        "gotoOptions": {"waitUntil": "networkidle2", "timeout": 15000},
    }

    try:
        response = httpx.post(
            BROWSERLESS_SCREENSHOT_URL,
            json=payload,
            timeout=30,
        )
        response.raise_for_status()
    except httpx.HTTPStatusError as e:
        raise DetonationError(f"Screenshot service error: {e.response.status_code}")
    except httpx.RequestError as e:
        raise DetonationError(f"Could not reach screenshot service: {str(e)}")

    return response.content


def detonate(start_url: str) -> dict:
    """
    Full detonation: follows redirects, then screenshots the final page.
    Returns {"hops": [...], "screenshot_bytes": ...}
    """
    hops = follow_redirect_chain(start_url)
    final_url = hops[-1]["url"]
    screenshot_bytes = capture_screenshot(final_url)

    return {
        "hops": hops,
        "final_url": final_url,
        "screenshot_bytes": screenshot_bytes,
    }