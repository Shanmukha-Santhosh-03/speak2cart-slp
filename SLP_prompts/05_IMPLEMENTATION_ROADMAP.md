# Implementation Roadmap

## Phase 0 — Baseline freeze

**Goal:** Preserve the working application.

Tasks:

- inspect current source,
- run current app,
- record working features,
- create a clean branch/commit,
- avoid destructive rewrites.

Exit condition:

> Existing voice shopping workflow still works.

---

## Phase 1 — ML dataset

Tasks:

- finalize intent taxonomy,
- create dataset,
- validate labels,
- remove duplicates,
- create train/validation/test split.

Deliverables:

```text
intents.json
train.json
validation.json
test.json
dataset_notes.md
```

Exit condition:

> Dataset is balanced, traceable and explainable.

---

## Phase 2 — Model

Tasks:

- preprocessing,
- tokenizer,
- model implementation,
- training,
- checkpointing,
- evaluation.

Deliverables:

```text
model.keras
tokenizer.json
label_encoder.json
training_history.json
evaluation.json
confusion_matrix.png
```

Exit condition:

> Model predicts intents on unseen test data and metrics are reproducible.

---

## Phase 3 — ML API

Tasks:

- implement `/predict-intent`,
- implement `/health`,
- load model once,
- validate requests,
- return stable JSON,
- configure CORS.

Exit condition:

> API works independently using test requests.

---

## Phase 4 — React integration

Tasks:

- send transcript to ML API,
- display prediction,
- map intent to existing actions,
- preserve existing shopping behavior,
- add confidence handling.

Exit condition:

> Voice transcript reaches the neural model and drives the existing application.

---

## Phase 5 — Chatbot UX

Tasks:

- conversation timeline,
- recognized speech,
- assistant response,
- optional technical inference panel,
- loading/error states.

Exit condition:

> Evaluator can immediately see speech → intent → response.

---

## Phase 6 — TTS and multilingual validation

Tasks:

- preserve TTS,
- test supported locales,
- test unsupported browser cases,
- provide text fallback.

Exit condition:

> Voice interaction remains usable even if TTS is unavailable.

---

## Phase 7 — UI refinement

Tasks:

- apply `03_UI_UX_DIRECTION.md`,
- unify typography,
- spacing,
- color system,
- motion,
- responsive layout,
- accessibility.

Exit condition:

> UI feels like one coherent product.

---

## Phase 8 — Testing

Test categories:

- normal commands,
- paraphrases,
- ambiguous commands,
- unknown commands,
- low-confidence predictions,
- microphone denial,
- API failure,
- mobile viewport.

Exit condition:

> No critical failure in the primary evaluation flow.

---

## Phase 9 — Deployment

Tasks:

- deploy frontend,
- deploy ML API,
- configure production API URL,
- enable HTTPS,
- verify CORS,
- test public URL from a clean browser.

Exit condition:

> Evaluator can open the link and complete a voice interaction without local setup.

---

## Phase 10 — Report and viva

Deliver:

- live URL,
- source repository,
- report,
- architecture diagram,
- dataset description,
- model architecture,
- methodology,
- evaluation,
- deployment evidence,
- screenshots.

Exit condition:

> Every claim in the report can be demonstrated from the project.
