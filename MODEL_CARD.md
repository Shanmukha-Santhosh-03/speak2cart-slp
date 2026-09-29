# Model Card

## Model Details
- **Architecture**: Bidirectional Long Short-Term Memory (BiLSTM) with Word Embeddings.
- **Framework**: TensorFlow / Keras
- **Task**: Intent Classification
- **Input**: Natural language text (English)
- **Output**: Intent probability distribution (Softmax over 14 classes)

## Intended Use
This model is intended to classify shopping-related natural language commands into structured intent actions for a Voice-Enabled Chatbot. It maps varying speech transcripts to a fixed set of commands like `ADD_ITEM`, `SEARCH_PRODUCT`, or `GET_RECOMMENDATIONS`.

## Dataset
- **Size**: 577 utterances.
- **Classes**: 14
- **Splits**: 70% Train, 15% Validation, 15% Test
- **Domain**: Grocery shopping, conversational interactions.

## Architecture Breakdown
1. **Tokenizer**: Maps up to ~430 unique tokens; Out-Of-Vocabulary (OOV) token handled.
2. **Padding**: Fixed sequence length of 20 tokens (post-padding).
3. **Embedding Layer**: Transforms token indices to dense 128-dimensional vectors.
4. **BiLSTM Layer**: 64 units capturing context from both past and future words.
5. **Dropout Layer**: 30% dropout rate to mitigate overfitting.
6. **Dense Layer 1**: 64 units with ReLU activation.
7. **Dense Layer 2**: 14 units with Softmax activation (Predicts the probability of each class).

## Evaluation Metrics (Test Set)
- **Accuracy**: 0.8409
- **Macro Precision**: 0.8548
- **Macro Recall**: 0.8583
- **Macro F1 Score**: 0.8202

## Limitations & Failure Cases
- **Out of Distribution**: Strongly fails on commands unrelated to grocery shopping if phrasing mimics shopping (e.g., "add 2 tires to my cart"). A 60% confidence threshold attempts to map these to `UNKNOWN`.
- **Vocabulary Size**: The model is trained on a very constrained vocabulary. Slang, misspellings, or extreme transcript errors from the speech recognition API will trigger the `<OOV>` token and reduce confidence.
- **Entity Extraction**: The deep learning model only classifies intent. Entities (quantities, item names) are extracted deterministically in post-processing.
