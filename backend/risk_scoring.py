import re
from urllib.parse import urlparse

# Keywords commonly used in phishing pages impersonating login/verification flows
SUSPICIOUS_KEYWORDS = [
    "login", "signin", "verify", "secure", "account", "update",
    "confirm", "banking", "password", "wallet", "suspended", "unlock",
]

MAX_SCORE = 100


def _score_domain_age(age_days):
    """
    Tiered scoring for domain age. Newer domains are riskier.
    Unknown age gets a moderate penalty (uncertainty itself is a
    mild signal — legitimate sites are almost always easy to look up).
    """
    if age_days is None:
        return 12, "Domain age could not be determined."
    if age_days < 7:
        return 30, f"Domain registered only {age_days} day(s) ago — extremely new."
    if age_days < 30:
        return 25, f"Domain is {age_days} days old — very new."
    if age_days < 90:
        return 15, f"Domain is {age_days} days old — relatively new."
    if age_days < 365:
        return 8, f"Domain is under a year old ({age_days} days)."
    return 0, f"Domain is well established ({age_days} days old)."


def _score_redirects(hop_count):
    """
    Tiered scoring for redirect chain length. More hops = more
    evasion/obfuscation attempts.
    """
    if hop_count <= 1:
        return 0, "No meaningful redirection — direct page load."
    if hop_count <= 3:
        return 10, f"{hop_count} redirects — a normal amount of hops."
    if hop_count <= 6:
        return 20, f"{hop_count} redirects — more than typical, worth noting."
    return 30, f"{hop_count} redirects — excessive, a strong evasion signal."


def _score_keywords(url):
    """
    Checks for phishing-associated keywords anywhere in the URL.
    Capped so one URL packed with keywords doesn't dominate the score.
    """
    url_lower = url.lower()
    matches = [kw for kw in SUSPICIOUS_KEYWORDS if kw in url_lower]
    if not matches:
        return 0, "No suspicious keywords found in the URL."
    points = min(len(matches) * 7, 20)
    return points, f"Found suspicious keyword(s): {', '.join(matches)}."


def _score_https(final_url):
    """Plain HTTP (no encryption) on the final landing page is a red flag."""
    if urlparse(final_url).scheme == "https":
        return 0, "Final page uses HTTPS."
    return 10, "Final page does not use HTTPS — connection is not encrypted."


def _score_url_structure(url):
    """
    Flags structural tricks commonly used to disguise malicious URLs:
    an IP address instead of a domain name, an '@' symbol (which
    browsers historically let attackers abuse to hide the real
    destination), or an excessive number of hyphens/subdomains.
    """
    parsed = urlparse(url)
    hostname = parsed.hostname or ""
    reasons = []
    points = 0

    if re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", hostname):
        points += 15
        reasons.append("hostname is a raw IP address")

    if "@" in url:
        points += 15
        reasons.append("URL contains an '@' symbol")

    if hostname.count("-") >= 4:
        points += 10
        reasons.append("hostname has an unusually high number of hyphens")

    if hostname.count(".") >= 4:
        points += 10
        reasons.append("hostname has an unusually high number of subdomains")

    if not reasons:
        return 0, "No suspicious URL structure detected."
    return min(points, 25), "Suspicious structure: " + ", ".join(reasons) + "."


def calculate_risk_score(hops, final_url, domain_age_days):
    """
    Combines all signals into a single 0-100 risk score, plus a
    breakdown suitable for the frontend's pie/bar charts.
    """
    original_url = hops[0]["url"] if hops else final_url

    age_points, age_reason = _score_domain_age(domain_age_days)
    redirect_points, redirect_reason = _score_redirects(len(hops))
    keyword_points, keyword_reason = _score_keywords(final_url)
    https_points, https_reason = _score_https(final_url)
    structure_points, structure_reason = _score_url_structure(original_url)

    raw_total = (
        age_points + redirect_points + keyword_points
        + https_points + structure_points
    )
    score = min(raw_total, MAX_SCORE)

    if score >= 70:
        risk_level = "High Risk"
    elif score >= 40:
        risk_level = "Medium Risk"
    else:
        risk_level = "Low Risk"

    breakdown = [
        {"name": "Domain Age", "points": age_points, "explanation": age_reason},
        {"name": "Redirect Count", "points": redirect_points, "explanation": redirect_reason},
        {"name": "Suspicious Keywords", "points": keyword_points, "explanation": keyword_reason},
        {"name": "HTTPS Usage", "points": https_points, "explanation": https_reason},
        {"name": "URL Structure", "points": structure_points, "explanation": structure_reason},
    ]

    return {
        "score": score,
        "risk_level": risk_level,
        "breakdown": breakdown,
    }