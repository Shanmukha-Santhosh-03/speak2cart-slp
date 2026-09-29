# Final Evaluation Checklist — Professor View

## Demonstration sequence

Use this order during evaluation.

### 1. Open application

Show the live URL.

### 2. Voice command

Say:

> "Add three bottles of water to my shopping list."

Show:

```text
Recognized:
Add three bottles of water...

Intent:
ADD_ITEM

Confidence:
actual model confidence

Entities:
water / 3 / bottles
```

### 3. Action

Show the item appearing in the shopping list.

### 4. Response

Show:

> "Added 3 bottles of water to your list."

Optionally let TTS speak the response.

### 5. Paraphrase

Use a different wording:

> "Could you put some milk on my list?"

Show that the learned model maps the paraphrase to the same intent.

### 6. Unknown input

Say something unrelated.

Show:

```text
Low confidence / UNKNOWN
```

and a clarification response.

### 7. Technical evidence

Open the model/evaluation documentation.

Show:

- dataset,
- architecture,
- training curves,
- confusion matrix,
- metrics.

### 8. Explain one prediction

Walk through:

```text
speech
→ transcript
→ preprocessing
→ model
→ intent
→ entities
→ action
→ response
```

## Professor's likely questions

### Why deep learning?

Explain learned intent patterns versus hand-written keyword rules.

### Why BiLSTM?

Explain sequence context.

### Why embedding?

Explain dense numerical representation of tokens.

### Why softmax?

Multi-class probability distribution.

### How did you evaluate?

Explain test set and macro metrics.

### What happens with unseen commands?

Confidence threshold + UNKNOWN/clarification.

### Is speech recognition itself your deep-learning model?

No. Speech recognition and intent classification are separate stages.

### Where is your trained model?

Show the actual model artifact and inference code.

### Can you reproduce the result?

Show training configuration, dataset split and evaluation script.

## Final principle

The best demonstration is not:

> "Look how many features we built."

It is:

> "Here is the complete pipeline, here is the learned model, here is the evidence that it works, and here is how every component connects."
