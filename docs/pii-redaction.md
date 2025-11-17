# PII Redaction & Validation (12.3)

## Utilities

`src/lib/pii.ts` exposes three helpers:

- `redactPii(text)` – replaces detected email, phone, and URL patterns with `[REDACTED_*]`.
- `scanPii(text)` – returns `{ hasEmail, hasPhone, hasUrl }`.
- `sanitizeLogMessage(value)` – normalizes any value to string and redacts PII before logging.

Usage example:

```ts
import { sanitizeLogMessage } from "../lib/pii";

console.log(sanitizeLogMessage(userInput));
```

## Guidance

- **Forms / Textareas:** run `scanPii` before sending analytics or moderation events. If `true`, prompt users to remove personal details or auto-redact before persisting.
- **Logs / Metrics:** never log raw user messages. Use `sanitizeLogMessage` for debugging output and monitoring.
- **Reports / Moderation screens:** store the raw text server-side with encryption, but redact it in client/browser storage and UI previews.

## Future Work

- Extend the regex set with national ID formats (e.g., TR TCKN) if needed.
- Hook `scanPii` into validation schemas (Zod/Yup) once backend/API layer is added.
- Add unit tests that guard regression on regex coverage.
