# SLP Report Specification

## Required sections

### 1. Title

Design and Deployment of a Voice-Enabled Chatbot using Speech Recognition and Deep Learning-Based Intent Classification

### 2. Abstract

Briefly describe:

- problem,
- approach,
- technology,
- result.

### 3. Problem statement

Explain why voice commands need speech recognition and intent understanding.

### 4. Objectives

Map directly to the assessment requirements.

### 5. Existing system

Explain the original rule-based voice assistant.

### 6. Proposed system

Explain the deep-learning upgrade.

### 7. Dataset

Include:

- source,
- class taxonomy,
- sample count,
- train/validation/test split,
- preprocessing,
- balancing,
- examples.

### 8. Model architecture

Include a diagram and layer table.

### 9. Methodology

```text
Voice
→ STT
→ preprocessing
→ model
→ intent
→ entities
→ action
→ response
```

### 10. Implementation

Explain:

- frontend,
- ML service,
- API,
- action layer,
- TTS.

### 11. Results

Include only actual measured results:

- accuracy,
- precision,
- recall,
- F1,
- confusion matrix,
- example predictions.

### 12. Deployment

Include:

- architecture,
- provider,
- frontend URL,
- backend arrangement,
- deployment limitations.

### 13. Limitations

Be honest about:

- browser speech recognition,
- accent/noise sensitivity,
- finite intent vocabulary,
- confidence threshold,
- dataset size.

### 14. Future scope

Possible future work:

- larger dataset,
- transformer classifier,
- multilingual training,
- domain adaptation,
- better entity extraction,
- offline ASR.

### 15. Conclusion

Tie the implementation back to the assessment requirements.

## Viva evidence checklist

Be able to explain:

- speech recognition vs NLP,
- intent classification,
- embeddings,
- LSTM,
- softmax,
- cross-entropy,
- dropout,
- overfitting,
- train/validation/test split,
- confidence,
- fallback,
- entity extraction,
- API architecture,
- deployment constraints.
