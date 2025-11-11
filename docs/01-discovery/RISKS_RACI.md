# Risks

- Push delivery failures → acceptance drops
- Abuse & moderation load
- Queue starvation in sparse regions
- TTL drift causing stale offers

## Mitigations

- Retry + fallback channels; cooldown policies
- Category-based report flow; fast triage
- Queue expansion rules; escalate-to-global
- TTL matrix + server monotonic clock source

## RACI (example)

- Matching orchestrator: R=Backend, A=Tech Lead, C=Client, I=QA
- Report flow UX: R=Design, A=PM, C=Client, I=Legal
