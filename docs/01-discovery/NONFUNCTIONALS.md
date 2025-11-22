# Non-Functional Requirements

- **Performance:** match offer p95 < 45s; channel open < 2s.
- **Reliability:** push failure < 1%; channel error < 0.5%.
- **Security/Privacy:** minimal PII; report trail; cooldowns.
- **A11Y:** WCAG AA contrast, keyboard navigation, screen-reader names.
- **i18n:** EN/TR/AR, RTL for AR, locale persistence.
- **Observability:** events (queue/match/acceptance/channel) → metrics dashboards.
