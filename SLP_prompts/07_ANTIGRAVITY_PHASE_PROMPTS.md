# Antigravity Phase Prompts

Use these prompts one at a time. Do not give Antigravity all implementation phases simultaneously.

---

# Phase 0 — Repository Audit

```text
Read all project-control markdown files first.

Do not modify implementation files.

Audit the current repository and report:

- application architecture
- voice recognition flow
- transcript state flow
- intent parser behavior
- shopping action flow
- TTS flow
- data/storage flow
- current build configuration
- current deployment assumptions
- dependencies
- files likely to require changes

Explicitly prove whether the current intent parser is rule-based or learned.

Produce a migration plan.

WAIT FOR APPROVAL.
```

---

# Phase 1 — Dataset

```text
Implement only the ML dataset layer.

Do not modify the React UI or production action flow.

Create the validated intent taxonomy based on actual application capabilities.

Create diverse training examples.

Requirements:

- balanced classes
- no duplicate utterances
- no train/test leakage
- reproducible split
- documented labels
- UNKNOWN handling

Before writing the final dataset, inspect it for ambiguity.

Run a dataset validation script.

Report:

- number of classes
- examples per class
- total examples
- split sizes
- duplicate count
- class imbalance
- sample examples

Do not fabricate any statistics.

Wait for approval before Phase 2.
```

---

# Phase 2 — Deep Learning Model

```text
Implement the deep-learning intent classifier.

Use the approved dataset.

Recommended architecture:

Tokenizer
→ Embedding
→ Bidirectional LSTM
→ Dropout
→ Dense
→ Dropout
→ Softmax

Requirements:

- reproducible seed
- train/validation/test split
- model checkpoint
- early stopping where appropriate
- saved tokenizer
- saved label mapping
- saved model
- training history
- evaluation script

Produce actual:

- accuracy
- macro precision
- macro recall
- macro F1
- confusion matrix

Do not invent results.

Also provide a model summary suitable for the SLP report.

Do not integrate with React yet.

Wait for approval.
```

---

# Phase 3 — ML API

```text
Implement the ML inference service only.

Required endpoints:

GET /health
POST /predict-intent

Load the trained model once at startup.

Validate input.

Return:

- intent
- confidence
- entities

Implement safe handling for:

- empty input
- malformed requests
- low confidence
- model loading failure

Document how the service is run locally.

Test it independently before React integration.

Wait for approval.
```

---

# Phase 4 — React Integration

```text
Integrate the ML API into the existing React application.

Do not replace working shopping functionality.

The primary flow must become:

Speech
→ transcript
→ ML API
→ intent
→ confidence
→ entity extraction
→ existing action handler
→ response

Preserve the current rule parser as a fallback only if needed.

Make it explicit in code that the trained neural classifier is the primary intent source.

Test every existing shopping command after integration.

Wait for approval.
```

---

# Phase 5 — Chatbot UX

```text
Implement the conversation experience.

The user must clearly see:

1. recognized speech
2. assistant response

Add optional technical details:

- predicted intent
- confidence
- extracted entities

Technical details should be secondary and collapsible.

Add clear states:

IDLE
LISTENING
PROCESSING
RESPONDING
ERROR

Preserve the existing visual language where useful, but apply the approved fresh UI direction.

Do not introduce generic AI-dashboard styling.

Wait for approval.
```

---

# Phase 6 — Testing

```text
Perform end-to-end testing.

Test:

- normal voice commands
- paraphrases
- unknown queries
- low-confidence cases
- microphone denial
- empty transcript
- API unavailable
- API timeout
- invalid API response
- TTS unavailable
- mobile-sized viewport

Create a test report.

Do not mark a test as passed unless it was actually executed.

Fix only verified issues.

Wait for approval.
```

---

# Phase 7 — Deployment

```text
Prepare production deployment.

Before deployment verify:

- production API URL
- HTTPS
- CORS
- model artifact availability
- frontend build
- backend startup
- health endpoint
- public microphone behavior
- error handling

Deploy only after local end-to-end testing passes.

Test the public URL from a clean browser/session.

Record the final deployment architecture and URL.

Wait for approval.
```

---

# Phase 8 — Documentation

```text
Prepare final project documentation.

Update:

README.md
REPORT.md
MODEL_CARD.md
DEPLOYMENT.md

Documentation must contain only verified facts.

Include:

- project objective
- architecture
- dataset
- preprocessing
- model architecture
- training method
- evaluation metrics
- limitations
- deployment
- usage
- screenshots/placeholders
- reproducibility steps

Do not invent results or claims.
```
