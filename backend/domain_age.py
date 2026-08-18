import os
from datetime import datetime, timezone
from urllib.parse import urlparse

import httpx
from dotenv import load_dotenv

load_dotenv()

WHOIS_API_KEY = os.getenv("WHOIS_API_KEY")
WHOIS_ENDPOINT = "https://www.whoisxmlapi.com/whoisserver/WhoisService"


class DomainAgeError(Exception):
    pass


def get_domain_age_days(url: str) -> int | None:
    """
    Looks up how many days old a domain is, based on its WHOIS
    registration date. Returns None if the lookup fails or the
    registration date isn't available (some domains hide it via
    privacy protection) — the caller should treat None as "unknown",
    not as "brand new".
    """
    hostname = urlparse(url).hostname
    if not hostname:
        return None

    # Strip "www." since WHOIS records are per-domain, not per-subdomain
    domain = hostname[4:] if hostname.startswith("www.") else hostname

    try:
        response = httpx.get(
            WHOIS_ENDPOINT,
            params={
                "apiKey": WHOIS_API_KEY,
                "domainName": domain,
                "outputFormat": "JSON",
            },
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()
    except (httpx.RequestError, httpx.HTTPStatusError, ValueError):
        # Any failure here (timeout, bad response, rate limit) should
        # NOT block the whole scan — domain age is one signal among several.
        return None

    created_date_str = data.get("WhoisRecord", {}).get("createdDate")
    if not created_date_str:
        return None

    try:
        created_date = datetime.fromisoformat(created_date_str)
        if created_date.tzinfo is None:
            created_date = created_date.replace(tzinfo=timezone.utc)
        now = datetime.now(timezone.utc)
        age_days = (now - created_date).days
        return max(age_days, 0)
    except ValueError:
        return None