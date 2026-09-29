# VOXEL
### Voice Intelligence Shopping Assistant

A voice-first shopping assistant that converts natural speech into structured shopping actions using speech recognition and a deep-learning intent classifier.

## Why this project?

The system combines:

```text
Speech Recognition
+
Deep Learning NLP
+
Entity Extraction
+
Shopping Actions
+
Voice Response
```

## System flow

```text
Voice
→ Speech-to-Text
→ Intent Classification
→ Entity Extraction
→ Action
→ Response
```

## Key features

- real-time voice input,
- transcript display,
- deep-learning intent classification,
- confidence-aware predictions,
- shopping-list operations,
- product search,
- recommendations,
- substitutes,
- optional text-to-speech,
- responsive interface.

## ML model

The final trained deep learning model is a Bidirectional LSTM on top of word embeddings, configured to predict 14 shopping intents.

| Component | Configuration |
|---|---|
| Tokenizer | 430 words (approx), max sequence length: 20 |
| Embedding | 128 dimensions |
| BiLSTM | 64 units |
| Dropout | 0.3 |
| Dense | 64 units (ReLU) |
| Output | 14 classes (Softmax) |

## Dataset

- **Classes**: 14 (ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, COMPLETE_ITEM, UNCOMPLETE_ITEM, SEARCH_PRODUCT, GET_RECOMMENDATIONS, FIND_SUBSTITUTE, CLEAR_COMPLETED, GREETING, HELP, THANKS, GOODBYE, UNKNOWN)
- **Total Utterances**: 577
- **Train Split**: 403 (70%)
- **Validation Split**: 86 (15%)
- **Test Split**: 88 (15%)

## Evaluation

Model evaluated on the hold-out test set:

| Metric | Result |
|---|---:|
| Accuracy | 0.8409 |
| Macro Precision | 0.8548 |
| Macro Recall | 0.8583 |
| Macro F1 | 0.8202 |

## Architecture

```text
┌────────────────────── CLIENT (Browser) ────────────┐
│                                                   │
│ React + TypeScript                                │
│                                                   │
│ Voice UI → Speech Recognition → Transcript        │
│                         │                         │
│                         ▼                         │
│                 Local TFJS Inference              │
│                 (BiLSTM DL Model)                 │
│                         │                         │
│                         ▼                         │
│                 Intent + Confidence               │
│                         │                         │
│                         ▼                         │
│                 Entity Extraction                 │
│                         │                         │
│                         ▼                         │
│                 Response / Action UI              │
│                         │                         │
│                         ▼                         │
│                  Speech Synthesis                 │
│                                                   │
└─────────────────────────┬─────────────────────────┘
                          │ HTTPS
                          ▼
┌────────────────────── KITCHEN BUDDY ──────────────┐
│                                                   │
│ Cloudflare Worker Proxy                           │
│  ↓                                                │
│ Gemini API                                        │
│                                                   │
└───────────────────────────────────────────────────┘
```

## Local development

### Local Run
`ash
npm install
npm run dev
`

## Deployment

The project is deployed entirely at  hosting costs.
- **Frontend**: Hosted on GitHub Pages. Inference happens locally in the browser using TensorFlow.js.
- **Backend API**: A minimal Cloudflare Worker safely proxies requests to the Gemini API for the Kitchen Buddy feature.
- **Deployment**: Configured automatically via GitHub Actions (.github/workflows/deploy.yml).
