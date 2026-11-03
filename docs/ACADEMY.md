# VEIXON Academy + Decision Advisor

- **/academy** — the entrepreneurship course (13 modules, 39 lessons, quizzes, decision rules, India notes). Progress is kept per browser.
- **/academy/[lessonId]** — a lesson, with "Apply it" links into the Decision Advisor.
- **/academy/advisor** — the Decision Advisor (signed-in users). It calls VEIXON AI OS's Venture Decision Engine, which applies the course's rules to the founder's numbers, cites the lessons behind each reason, asks for missing facts (answer and re-run), and learns from reported outcomes.

## Setup

1. Run VEIXON AI OS (see its README). The course is ingested into its knowledge base at startup.
2. In VEIXON AI OS create an API key with the scopes **chat** and **decisions**.
3. Set in `.env.local`:

       VEIXON_AIOS_URL=https://your-aios-host
       VEIXON_AIOS_API_KEY=vx_live_...
       VEIXON_MODEL=auto

With both set, VEIXON AI OS also becomes the primary LLM provider for every AI route (`src/lib/ai/gateway.ts`). NVIDIA, OpenAI and the other providers stay as fallbacks, and `AI_PRIMARY_PROVIDER` overrides this. AI OS serves plain HTTP; put HTTPS in front of it for production.

## Course content

`src/lib/academy/curriculum.json` is generated from VEIXON AI OS (`app/venture/course_data.py`). To change the course, edit it there, bump `COURSE_VERSION`, and run:

    python scripts/export_academy.py --out <path-to>/veixon-cofounders/src/lib/academy/curriculum.json

`/api/venture/status` reports when the app and AI OS course versions differ.

## Privacy

Founders are identified to AI OS only by an opaque hash (`src/app/api/venture/_subject.ts`). No email or name leaves the app. Each founder's history and outcome calibration are separate, and the routes check that a decision belongs to the founder asking for it.

## How the platform inherits VEIXON AI OS

Once `VEIXON_AIOS_URL` and `VEIXON_AIOS_API_KEY` are set, AI OS is used everywhere:

| Feature | What happens |
|---|---|
| All 22 `/api/ai/*` routes and VZN chat | The AI Gateway calls VEIXON AI OS first (OpenAI-compatible `/v1`, model `auto` → `veixon-1` once trained and promoted). It falls back to NVIDIA, OpenAI and the other hosted providers if AI OS is down or returns invalid JSON. |
| Builder agents (`src/lib/agents`) | `src/lib/llm.js` now goes through the same gateway. The old direct NVIDIA/Emergent client remains only as a last resort. |
| Every prompt | Cited passages from the VEIXON Academy course (AI OS knowledge base) are added to the system prompt (`src/lib/academy/brain.ts`, cached 10 min, 3.5 s timeout). Turn this off with `VEIXON_ACADEMY_GROUNDING=0` or per call with `{ academy: false }`. |
| Decisions simulator | Runs the Venture Decision Engine first. The LLM's best, worst and most-likely scenarios must agree with the engine's verdict, which is shown with links to the lessons it is based on. |
| /academy/advisor | The full decision workflow, with gap questions and outcome learning. |

Training Veixon-1 happens in VEIXON AI OS (`finetune/colab_train_academy.ipynb`). The platform needs no change when the trained model is promoted, because `VEIXON_MODEL=auto` picks it up.
