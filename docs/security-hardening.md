# Security Hardening (12.2)

## Overview

To support roadmap item 12.2 (secure headers, CORS, rate limiting), a hardened static server script has been added for local testing and can be used as reference for production infrastructure/CDN headers.

## Secure Static Server

Command:

```bash
npm run security:serve
```

Environment variables:

| Variable            | Default            | Description                                                                   |
| ------------------- | ------------------ | ----------------------------------------------------------------------------- |
| `PORT`              | `5080`             | Listening port.                                                               |
| `STATIC_DIR`        | `storybook-static` | Directory served as static output.                                            |
| `ALLOWED_ORIGINS`   | `*`                | Comma-separated list of origins for CORS. Empty means reflect request origin. |
| `RATE_LIMIT_WINDOW` | `60000`            | Window in ms for rate limiter.                                                |
| `RATE_LIMIT_MAX`    | `60`               | Requests per window per IP.                                                   |

Middleware stack:

1. **CORS** – restricts origins (configurable via env).
2. **Helmet** – sets CSP, XSS, referrer, permissions policies.
3. **express-rate-limit** – defaults to 60 req/min/IP.
4. **Custom headers** – `Referrer-Policy: no-referrer`, `Permissions-Policy: interest-cohort=()`, `Cross-Origin-Resource-Policy: same-site`.
5. **Static serving** – caches non-HTML assets for 1 hour, HTML is `no-cache`.
6. **404/500 JSON responses** for API hygiene.

## Deploying on GitHub Pages / CDN

Even though production hosting is static (GitHub Pages or CDN), set equivalent headers:

| Header                      | Value                                                                                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Content-Security-Policy`   | `default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data: https://fonts.gstatic.com` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload`                                                                                                          |
| `Referrer-Policy`           | `no-referrer`                                                                                                                                           |
| `Permissions-Policy`        | `interest-cohort=()`                                                                                                                                    |
| `X-Content-Type-Options`    | `nosniff`                                                                                                                                               |
| `X-Frame-Options`           | `DENY`                                                                                                                                                  |

CDN providers (Cloudflare, Fastly, Akamai) can set these via dashboard or worker script.

## Rate Limiting Guidelines

- **Storybook / Marketing**: 60 req/min baseline (per IP) is sufficient.
- **Future API Gateway**: start with `100 req/min` burst per token/IP, revisit once auth is in place.
- For GitHub Pages-based hosting, rate limiting must be implemented via reverse proxy (e.g., Cloudflare Rules).

## Next Steps

- Backport these headers into infrastructure-as-code or CDN configuration.
- When the backend/API layer arrives, reuse the same helmet + rate limiter defaults there.
- Add automated test (e.g., `npm run security:serve` + `npx lumos` or custom script) that asserts headers in CI once infrastructure is deployed.
