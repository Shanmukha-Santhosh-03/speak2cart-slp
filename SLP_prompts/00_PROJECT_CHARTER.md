# VOXEL — Voice Intelligence Shopping Assistant
### SLP 20-Mark Assessment · Project Charter

> **Working principle:** Preserve the existing application. Upgrade its intelligence layer. Do not rebuild functionality that already works.

## 1. Assessment objective

Develop, implement, and deploy an online voice-enabled chatbot that:

1. accepts voice input,
2. converts speech to text,
3. classifies the user's intent using a genuine deep-learning model,
4. produces an appropriate chatbot response/action,
5. displays the recognized speech and response,
6. is publicly deployable,
7. is supported by source code and a technical report.

## 2. Existing project baseline

The current project is a React + TypeScript + Vite voice-enabled shopping assistant.

Existing capabilities include:

- browser speech recognition,
- transcript display,
- text-to-speech,
- shopping-list operations,
- product search,
- recommendations,
- substitutes,
- inventory/history views,
- responsive UI,
- local persistence,
- modular React components.

### Critical gap

The current `intentParser.ts` is rule/keyword based. It is **not** a deep-learning intent classifier.

The SLP upgrade therefore adds a learned NLP layer rather than replacing the application.

## 3. Target system

```text
Voice
  ↓
Browser Speech Recognition
  ↓
Recognized Transcript
  ↓
NLP Preprocessing
  ↓
Deep-Learning Intent Classifier
  ↓
Intent + Confidence
  ↓
Entity Extraction
  ↓
Existing Shopping Action Layer
  ↓
Response Composer
  ↓
Text Response + Optional TTS
```

## 4. Primary ML requirement

The project must contain a trainable, reproducible intent-classification model.

Recommended baseline:

```text
Tokenization
→ Embedding
→ Bidirectional LSTM
→ Dropout
→ Dense
→ Softmax
```

The exact architecture may be adjusted after validation, but it must remain a genuine deep-learning model and must be explainable during viva.

## 5. Product principle

The ML model should solve a real problem in the existing application:

> Translate natural voice language into a structured shopping intent.

The model should not exist merely as a decorative academic component.

## 6. Success criteria

The final system must allow a user to say something such as:

> "Please add three bottles of water to my list."

and produce an observable chain:

```text
Recognized speech
→ ADD_ITEM
→ confidence
→ item=water
→ quantity=3
→ unit=bottles
→ shopping-list update
→ natural response
```

## 7. Non-goals

Do not add complexity solely for appearance.

Avoid unnecessary:

- LLM APIs,
- vector databases,
- RAG,
- agent frameworks,
- Kubernetes,
- microservices beyond what deployment requires,
- unrelated AI features.

## 8. Academic integrity

All metrics must come from actual experiments.

Do not fabricate:

- accuracy,
- F1,
- confusion matrices,
- dataset size,
- latency,
- model claims,
- deployment claims.

The final report must distinguish clearly between existing functionality and newly implemented SLP work.
