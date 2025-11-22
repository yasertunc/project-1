# ADR 0002 — Design Tokens Source

- **Context:** Keep UI consistent across themes/locales.
- **Decision:** `tokens_fellowus_v1.json` → generated `src/styles/tokens.css`.
- **Status:** Accepted.
- **Consequences:** No manual CSS var edits; prebuild hooks enforce freshness.
