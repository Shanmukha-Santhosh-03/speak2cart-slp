# Current → Target Specification

## 1. Current system

```text
Microphone
   ↓
Browser Speech Recognition
   ↓
Transcript
   ↓
Rule-based intent parser
   ↓
Shopping action
   ↓
Toast / UI / TTS
```

## 2. Target SLP system

```text
Microphone
   ↓
Browser Speech Recognition
   ↓
Transcript
   ↓
NLP preprocessing
   ↓
Deep-learning intent classifier
   ↓
Intent + confidence
   ↓
Entity extraction
   ↓
Action router
   ↓
Response composer
   ↓
Conversation UI
   ↓
Optional TTS
```

## 3. Replacement policy

Do not delete the existing parser immediately.

During migration:

```text
Deep-learning classifier
        │
        ├── confidence ≥ threshold → primary route
        │
        └── low confidence → safe fallback / clarification
```

The rule parser may remain as a compatibility or recovery mechanism, but the project documentation must identify the neural classifier as the primary SLP intent-classification mechanism.

## 4. Responsibility boundaries

### React application

Responsible for:

- microphone interaction,
- transcript presentation,
- conversation history,
- UI state,
- API calls,
- shopping actions,
- response rendering,
- TTS.

### ML service

Responsible for:

- text preprocessing,
- tokenization,
- model inference,
- intent probability,
- confidence,
- model metadata.

### Entity extraction

Responsible for:

- item,
- quantity,
- unit,
- optional price constraint,
- optional search phrase.

## 5. API contract

### Request

`POST /predict-intent`

```json
{
  "text": "add three bottles of water"
}
```

### Response

```json
{
  "intent": "ADD_ITEM",
  "confidence": 0.97,
  "entities": {
    "item": "water",
    "quantity": 3,
    "unit": "bottles"
  }
}
```

### Health endpoint

`GET /health`

Expected response:

```json
{
  "status": "ok"
}
```

The exact API technology may be FastAPI or another lightweight Python service, but the interface must remain simple and documented.
