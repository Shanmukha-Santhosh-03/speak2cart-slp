# Antigravity Master Prompt

Copy the following prompt into Antigravity at the start of the upgrade.

---

You are the lead engineer responsible for upgrading an existing React + TypeScript + Vite application into a submission-ready SLP project.

PROJECT:
"VOXEL — Voice Intelligence Shopping Assistant"

ACADEMIC REQUIREMENT:
Develop, implement and deploy an online Voice-Enabled Chatbot using Speech Recognition and Deep Learning.

The evaluator must be able to verify:

1. Voice input works.
2. Speech is converted to text.
3. The recognized speech is visibly displayed.
4. A genuine deep-learning model performs intent classification.
5. The predicted intent leads to an appropriate response/action.
6. The chatbot response is visibly displayed.
7. The application is publicly deployable.
8. Source code, dataset, model architecture, methodology and results are documented.

IMPORTANT ENGINEERING RULES:

- This is an EXISTING application. Do not rebuild it from scratch.
- Inspect the repository before changing anything.
- Preserve working voice recognition, shopping logic, TTS, history, recommendations, substitutes and UI functionality unless a change is necessary.
- Do not silently replace the application architecture.
- Do not fabricate metrics.
- Do not claim a rule-based parser is deep learning.
- Do not add an LLM merely to make the project sound more advanced.
- Do not generate large amounts of code before validating the architecture.
- Work phase-by-phase.
- After each phase, run tests/builds and report what changed.
- Never overwrite working files destructively without first understanding their role.
- Keep the project runnable after every phase.

CURRENT IMPORTANT FACT:

The existing `src/services/intentParser.ts` is rule/keyword based. It is not a deep-learning classifier.

TARGET ARCHITECTURE:

Voice
→ Browser Speech Recognition
→ Recognized Transcript
→ NLP Preprocessing
→ Deep Learning Intent Classifier
→ Intent + Confidence
→ Entity Extraction
→ Existing Shopping Action Layer
→ Response Composer
→ Conversation UI
→ Optional TTS

RECOMMENDED MODEL:

Tokenizer
→ Embedding
→ Bidirectional LSTM
→ Dropout
→ Dense(ReLU)
→ Dropout
→ Dense(Softmax)

The exact hyperparameters may be tuned experimentally.

TARGET INTENTS:

ADD_ITEM
REMOVE_ITEM
UPDATE_QUANTITY
COMPLETE_ITEM
UNCOMPLETE_ITEM
SEARCH_PRODUCT
GET_RECOMMENDATIONS
FIND_SUBSTITUTE
CLEAR_COMPLETED
GREETING
HELP
THANKS
GOODBYE
UNKNOWN

Validate these against the actual application before finalizing.

DATASET:

Create a version-controlled custom intent dataset with diverse natural-language examples.

Target approximately 30–50 examples per intent.

Use reproducible train/validation/test splits.

Do not leak duplicate or near-duplicate utterances between splits.

API:

POST /predict-intent

Request:
{
  "text": "add three bottles of water"
}

Response:
{
  "intent": "ADD_ITEM",
  "confidence": 0.97,
  "entities": {
    "item": "water",
    "quantity": 3,
    "unit": "bottles"
  }
}

GET /health

The ML service may use FastAPI or another lightweight Python API if justified.

UI REQUIREMENT:

The final UI must have a fresh, coherent product design.

Do not use generic student-dashboard styling.

The interface should visually communicate:

- voice interaction,
- shopping utility,
- calm intelligence,
- clarity.

The evaluator should immediately see:

"You said..."
"Assistant..."
and optionally:
"Intent / Confidence / Entities"

DOCUMENTS TO FOLLOW:

Read these project-control documents before implementation:

00_PROJECT_CHARTER.md
01_CURRENT_TO_TARGET.md
02_ML_SPECIFICATION.md
03_UI_UX_DIRECTION.md
04_ARCHITECTURE.md
05_IMPLEMENTATION_ROADMAP.md

FIRST ACTION:

DO NOT IMPLEMENT YET.

First inspect the repository and produce:

1. Current architecture summary
2. Existing voice flow
3. Existing intent flow
4. Existing shopping action flow
5. Existing TTS flow
6. Existing build/deployment setup
7. Files that must change
8. Files that should remain untouched
9. Proposed ML service structure
10. Risks
11. Migration strategy

Then WAIT FOR APPROVAL.

Do not create or modify implementation files until approval is explicitly given.
