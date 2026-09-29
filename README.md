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
┌────────────────────── CLIENT ──────────────────────┐
│                                                   │
│ React + TypeScript                                │
│                                                   │
│ Voice UI → Speech Recognition → Transcript        │
│                         │                         │
│                         ▼                         │
│                    ML API Client                  │
│                         │                         │
│                         ▼                         │
│                 Response / Action UI               │
│                         │                         │
│                         ▼                         │
│                  Speech Synthesis                 │
│                                                   │
└─────────────────────────┬─────────────────────────┘
                          │ HTTPS
                          ▼
┌────────────────────── ML SERVICE ─────────────────┐
│                                                   │
│ FastAPI                                           │
│  ↓                                                │
│ Keras Preprocessor                                │
│  ↓                                                │
│ BiLSTM Deep Learning Model                        │
│  ↓                                                │
│ Intent + Confidence                               │
│  ↓                                                │
│ Entity Extraction                                 │
│                                                   │
└───────────────────────────────────────────────────┘
```

## Local development

### 1. Start the ML Service
```bash
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r ml/requirements.txt
python ml/src/app.py
```

### 2. Start the Frontend
```bash
npm install
npm run dev
```

## API

- `GET /health` : Returns API health and model loading status.
- `POST /predict-intent` : Expects `{"text": "..."}`. Returns Intent, Confidence, and Entities.

## Deployment

The project is prepared for deployment. 
- **Frontend**: Can be deployed to Vercel/Netlify.
- **Backend API**: Can be deployed to Heroku/Render as a Python FastAPI service.
- **Current Live URL**: NOT VERIFIED (Deployment credentials were not provided to the autonomous agent)

## Project structure

```text
├── ml/
│   ├── artifacts/       # Saved Keras model and tokenizers
│   ├── data/            # Dataset and splits
│   ├── results/         # Training curves and confusion matrix
│   ├── src/             # Training, evaluation and API code
│   └── requirements.txt
├── src/                 # React frontend
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types/
```

## Limitations

- Browser speech recognition heavily depends on the browser's implementation and native OS support. It can struggle with thick accents or noisy environments.
- Finite intent vocabulary restricts the application to 14 classes.
- Deep learning model confidence depends heavily on data distribution. It may misclassify out-of-distribution utterances with high confidence without better calibration.

## Academic context

This project was developed as part of an SLP laboratory assessment on online voice-enabled chatbots using speech recognition and deep learning.
