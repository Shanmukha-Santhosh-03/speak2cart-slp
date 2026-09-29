# Antigravity Guardrails

## Before changing code

Always:

1. inspect the existing implementation,
2. identify dependencies,
3. identify affected files,
4. explain the intended change,
5. preserve working behavior.

## Never

- rewrite the repository blindly,
- replace React with another frontend framework,
- remove working voice recognition without justification,
- call a keyword parser a neural network,
- fabricate evaluation results,
- hard-code fake confidence values,
- hard-code fake model metrics,
- commit secrets,
- commit `node_modules`,
- add dependencies without checking whether they are necessary,
- change multiple architectural layers when one layer is sufficient.

## Model integrity

The classifier must use saved learned parameters at inference time.

A valid inference path must be demonstrable:

```text
input text
→ tokenizer
→ neural model
→ softmax
→ predicted class
```

## Confidence integrity

Confidence must come from the model output.

Do not write:

```text
confidence = 0.97
```

unless `0.97` is actually computed from model inference.

## Fallback integrity

Fallback logic must not obscure the ML path.

Log or expose enough information during development to distinguish:

```text
NEURAL
FALLBACK
UNKNOWN
```

## UI integrity

The UI should explain the product through hierarchy, not decoration.

Avoid:

- excessive glow,
- random gradients,
- giant headings,
- repetitive cards,
- fake AI terminology,
- meaningless animations.

## Completion rule

A phase is not complete until:

- implementation exists,
- tests were executed,
- build succeeds where applicable,
- changes are summarized,
- known limitations are recorded.
