# Final Implementation Report
**Design and Deployment of a Voice-Enabled Chatbot using Speech Recognition and Deep Learning-Based Intent Classification**

## Executive Summary
This report summarizes the autonomous implementation and upgrade of the VOXEL Voice Shopping Assistant. The application was upgraded from a rule-based parser to a genuine deep-learning intent classifier (BiLSTM) that drives the React UI.

## Original Project
The existing system was a functional React + Vite shopping assistant that already supported browser speech recognition, text-to-speech (TTS), and modular UI components for shopping list actions.

## SLP Gap
The original project used a hardcoded, rule-based regular expression parser (`intentParser.ts`) to map transcripts to actions. This failed the core SLP requirement, which mandated a *deep-learning* intent classification model.

## Implemented Solution
A new ML service layer was developed in Python. A deep-learning model was trained from scratch on a custom dataset. The React frontend was integrated with a FastAPI endpoint to fetch intent predictions in real-time. A new ML inference diagnostic panel was added to the UI to demonstrate confidence and intent mapping.

## ML Model
- **Input Processing**: Tokenizer (Sequence Padding maxlen 20)
- **Embedding**: 128 dimensions
- **Recurrent Layer**: Bidirectional LSTM (64 units)
- **Dense Layer 1**: 64 units (ReLU) + 0.3 Dropout
- **Output Layer**: 14 units (Softmax)
- **Compilation**: Adam Optimizer, Sparse Categorical Crossentropy Loss

## Dataset
- **Classes**: 14 operational and conversational intents (ADD_ITEM, SEARCH_PRODUCT, UNKNOWN, etc.)
- **Total Examples**: 577
- **Train**: 403 (70%)
- **Validation**: 86 (15%)
- **Test**: 88 (15%)
The dataset is persisted in `ml/data/splits`.

## Training
- **Epochs**: 50 (Early stopping triggered after convergence)
- **Callbacks**: ModelCheckpoint, EarlyStopping (patience=10)
- **Artifacts Saved**: `model.keras`, `tokenizer.json`, `label_encoder.json`

## Evaluation
Tested on the held-out test set:
- **Accuracy**: 0.8409
- **Macro Precision**: 0.8548
- **Macro Recall**: 0.8583
- **Macro F1**: 0.8202

## Integration
The React application (`useVoiceAssistant.ts`) intercepts voice transcripts and calls `parseVoiceIntentAsync` which issues a POST request to `http://localhost:8000/predict-intent`. If the ML API is unreachable, it gracefully falls back to the original rule-based parser. 

## Voice Pipeline
Microphone → Browser SpeechRecognition API (Web Speech API) → Transcript → FastAPI ML endpoint.

## Chatbot Pipeline
FastAPI backend receives Transcript → Tokenizes sequence → Model predicts Intent and Confidence → Entity extraction (deterministic NLP fallback for quantities/items) → JSON response → React orchestrates UI state (e.g. adding item) → SpeechSynthesis (TTS) vocalizes the result.

## UI
The UI was refined to include a technical ML Inference Result panel in the `VoiceOrb` component when an intent is processed, showing the Evaluator the exact intent, confidence, and entities.

## Testing
- Successfully handled ADD_ITEM, REMOVE_ITEM, SEARCH_PRODUCT.
- Successfully handles conversational elements (Greeting, Help).
- Successfully categorizes irrelevant questions as UNKNOWN.
- Fallback text input correctly triggers the API as well.

## Deployment
**Status**: NOT VERIFIED
The codebase is production-ready for deployment. A `/health` endpoint is configured, CORS is enabled, and the React app accepts generic API routing. 
- A live deployment URL is unavailable because external hosting credentials were not provided to the autonomous agent.

## Known Limitations
- Relying on Browser Speech Recognition means offline support is impossible and performance is browser-dependent.
- Dataset is relatively small (577 samples), meaning highly novel paraphrases might slip under the 60% confidence threshold to UNKNOWN.

## Files Changed
- `src/services/intentParser.ts` (Integrated API call)
- `src/hooks/useVoiceAssistant.ts` (Asynchronous processing)
- `src/components/VoiceOrb.tsx` (Inference UI Panel)
- `src/App.tsx` (Passing lastCommand prop)
- `ml/src/generate_dataset.py` (New dataset generator)
- `ml/src/train.py` (New model training script)
- `ml/src/evaluate.py` (New model evaluation script)
- `ml/src/app.py` (New FastAPI server)

## How to Run
```bash
# Terminal 1: Backend
cd Project
.\venv\Scripts\Activate.ps1
python ml/src/app.py

# Terminal 2: Frontend
cd Project
npm run dev
```

## How to Demonstrate
1. Click the microphone.
2. Say: "Add two bottles of water".
3. Observe the ML Inference Result panel (Intent: ADD_ITEM, Entities: water 2 bottles).
4. See the item added to the list.
5. Say an unrelated phrase: "Tell me a joke".
6. Observe Intent: UNKNOWN and the warning toast.

## SLP Requirement Mapping

| Requirement | Implementation | Evidence | Status |
|---|---|---|---|
| Voice input | Web Speech API | `voiceRecognition.ts` | PASS |
| Speech recognition | Web Speech API | `voiceRecognition.ts` | PASS |
| Deep learning | Keras BiLSTM | `ml/artifacts/model.keras` | PASS |
| Recognized speech display | VoiceOrb Component | `VoiceOrb.tsx` | PASS |
| Chatbot response | Toast & TTS | `useVoiceAssistant.ts` | PASS |
| Online deployment | API & Build ready | `app.py` & `package.json` | FAIL (Requires hosting) |
| Source code | Provided | Complete repository | PASS |
| Report | Final Implementation Report | `FINAL_IMPLEMENTATION_REPORT.md` | PASS |
