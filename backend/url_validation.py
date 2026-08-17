import ipaddress
import socket
from urllib.parse import urlparse


class UrlValidationError(Exception):
    """Raised when a submitted URL fails safety validation."""
    pass


def validate_url(raw_url: str) -> str:
    """
    Validates a submitted URL before it's allowed anywhere near the
    detonation sandbox. Blocks:
      - Missing/invalid scheme (must be http or https)
      - URLs pointing at private/internal/loopback IP ranges (SSRF protection)
      - Obviously malformed input

    Returns the cleaned URL string if valid, otherwise raises UrlValidationError.
    """
    raw_url = raw_url.strip()

    if not raw_url:
        raise UrlValidationError("URL cannot be empty.")

    parsed = urlparse(raw_url)

    if parsed.scheme not in ("http", "https"):
        raise UrlValidationError("URL must start with http:// or https://")

    if not parsed.hostname:
        raise UrlValidationError("URL is missing a valid hostname.")

    hostname = parsed.hostname

    # Try to resolve the hostname to an IP and check it's not internal.
    # This blocks both direct IP submissions (http://127.0.0.1) AND
    # domain names that resolve to internal addresses (DNS rebinding attempts).
    try:
        resolved_ip = socket.gethostbyname(hostname)
    except socket.gaierror:
        raise UrlValidationError("Could not resolve this domain. Check the URL is correct.")

    ip_obj = ipaddress.ip_address(resolved_ip)

    if (
        ip_obj.is_private
        or ip_obj.is_loopback
        or ip_obj.is_link_local
        or ip_obj.is_reserved
        or ip_obj.is_multicast
    ):
        raise UrlValidationError(
            "This URL points to a private or internal address and cannot be scanned."
        )

    return raw_url