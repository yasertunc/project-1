# PRD — Fellowus v1

## Goals

- Anonymous, intent-based matching; 1:1 to small-group chats; report & safety flows.

## Non-Goals

- Long-lived social graphs, DMs outside matches, media storage.

## Jobs-to-be-Done

- "Help me quickly talk to someone nearby about X without exposing identity."

## User Stories

- As a user, I pick an intent and get matched within ~45s.
- As a user, I can report harmful behavior with 2 taps.

## Requirements

- **Matching:** enqueue/cancel/tick per OpenAPI (see `openapi/matching.yaml`).
- **Acceptance:** offer sent → dual acceptance → channel open.
- **A11Y/i18n:** EN/TR/AR, RTL, visible focus, AA contrast.
- **Telemetry:** events + metrics (see Acceptance Flow Events & Metrics).
- **UI:** tokens-driven components in Storybook.

## Constraints

- Mobile-first, low-latency. Server-side queue/TTL.

## Open Questions

- Group size limits?
- Rate limits/cooldowns parameters?
- Abuse heuristics?

## Milestones (proposed)

- M1: Design System + Storybook foundation ✅
- M2: Matching API contract + client ✅
- M3: Report flows + telemetry dashboard ✅
- M4: App shell & channel integration (pending)
