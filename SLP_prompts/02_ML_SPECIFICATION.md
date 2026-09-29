# Machine Learning Specification

## 1. Objective

Train a deep-learning text classifier that maps natural-language shopping commands to application intents.

## 2. Initial intent taxonomy

The implementation team should validate these classes against the existing application before training:

```text
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
```

Do not add intents that the application cannot actually execute.

## 3. Dataset

Target:

- 12–14 operational/conversational intents plus `UNKNOWN`,
- approximately 30–50 diverse utterances per intent,
- balanced class distribution,
- natural variations,
- short and long commands,
- paraphrases,
- conversational wording,
- realistic speech-recognition imperfections.

The dataset must be version controlled.

Recommended structure:

```text
ml/
├── data/
│   ├── intents.json
│   └── splits/
│       ├── train.json
│       ├── validation.json
│       └── test.json
├── src/
│   ├── preprocessing.py
│   ├── model.py
│   ├── train.py
│   ├── evaluate.py
│   └── predict.py
└── artifacts/
    ├── model.keras
    ├── tokenizer.json
    └── label_encoder.json
```

## 4. Data split

Use a reproducible split, for example:

```text
70% train
15% validation
15% test
```

Use a fixed random seed.

Do not allow duplicate or near-duplicate utterances to leak across splits.

## 5. Recommended model

Baseline:

```text
Input text
→ Tokenizer
→ Padding
→ Embedding
→ Bidirectional LSTM
→ Dropout
→ Dense(ReLU)
→ Dropout
→ Dense(Softmax)
```

Suggested starting point:

```text
Embedding: 128 dimensions
BiLSTM: 64 units
Dropout: 0.30
Dense: 64 units
Output: number of intents
```

These values are starting points, not guaranteed optimal values.

## 6. Training

Track:

- training loss,
- validation loss,
- training accuracy,
- validation accuracy,
- epoch count,
- early stopping behavior.

Recommended controls:

- early stopping,
- model checkpointing,
- fixed random seed,
- class-balance inspection.

## 7. Evaluation

Report:

- accuracy,
- macro precision,
- macro recall,
- macro F1,
- per-class performance,
- confusion matrix.

Do not rely on accuracy alone.

## 8. Confidence policy

The system must not blindly trust every prediction.

Example policy:

```text
confidence >= threshold
    → execute predicted intent

confidence < threshold
    → clarification / UNKNOWN response
```

The threshold must be chosen using validation behavior, not invented.

## 9. Robustness tests

Evaluate examples that differ from training wording.

Examples:

```text
"Can you put milk on my list?"
"Please add some milk."
"I forgot to add milk."
"Could you get milk for me?"
```

All should map appropriately if they express the same intent.

Also test unrelated commands to verify rejection/UNKNOWN behavior.

## 10. Academic evidence

Keep:

- dataset version,
- training configuration,
- model summary,
- evaluation output,
- confusion matrix,
- experiment notes.

These become evidence for the report and viva.
