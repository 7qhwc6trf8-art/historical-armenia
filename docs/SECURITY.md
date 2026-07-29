# Security model

## Implemented in v0.1

1. Telegram HMAC validation using the raw `initData` string and bot token.
2. Authorization timestamp expiry.
3. Fixed-size, short-lived JWT in an HTTP-only cookie.
4. SameSite strict cookies and HTTPS-only cookies in production.
5. Double-submit CSRF token for write requests.
6. Exact origin allowlist and credentialed CORS.
7. Helmet headers, request body limit, parameter pollution protection, and rate limits.
8. No bot token or session secret in frontend code.
9. Production startup fails when the local authentication bypass is enabled.
10. Generic production errors and graceful process shutdown.

## Required before a public launch

- Put frontend and API behind HTTPS on one trusted domain.
- Add Redis-backed distributed rate limiting and session revocation.
- Add PostgreSQL with least-privilege credentials and encrypted backups.
- Add admin role separation, MFA/passkey protection, and a full audit log.
- Add image upload malware checks, MIME sniffing protection, and object storage signed URLs.
- Add dependency scanning, secret scanning, SAST, container scanning, and automated backups.
- Add structured logs without personal Telegram payloads.
- Add monitoring, alerting, CSP for the deployed frontend, and a reverse proxy request-size limit.
