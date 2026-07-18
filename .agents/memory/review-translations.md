---
name: Review auto-translation pipeline
description: How EN/AR/FR/ES review translations are generated, cached, and retried; pitfalls to keep in mind.
---

- Rule: translation must never block review publishing or server startup. The OpenAI client module throws at import if AI env vars are missing — always import it lazily inside the request path, not at module top level.
- **Why:** the AI Integrations client validates env vars at import time; a top-level import crashed-boot risk was flagged in code review.
- **How to apply:** any new AI-powered feature in the api-server should `await import("@workspace/integrations-openai-ai-server")` inside the function, catch, and degrade gracefully (mark status failed, retry via the 5-min queue).
- batchProcess (template lib) returns Promise.all of results — a thrown processor error rejects the whole batch. Processors that must tolerate per-item failure should return success flags instead of throwing.
- Translations are cached in review_translations with FK ON DELETE CASCADE; retry state lives in reviews.translation_status (pending/failed/done). Prod gets data via idempotent startup seeding + republish.
