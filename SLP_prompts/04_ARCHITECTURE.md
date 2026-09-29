# System Architecture

## 1. Logical architecture

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
│ API                                               │
│  ↓                                                │
│ Preprocessor                                      │
│  ↓                                                │
│ Tokenizer                                         │
│  ↓                                                │
│ Deep Learning Model                               │
│  ↓                                                │
│ Intent + Confidence                               │
│  ↓                                                │
│ Entity Extraction                                 │
│                                                   │
└───────────────────────────────────────────────────┘
```

## 2. Deployment topology

Preferred:

```text
Browser
  │
  ├── HTTPS → Frontend hosting
  │
  └── HTTPS → ML API hosting
```

The deployment provider is selected only after confirming:

- Python runtime availability,
- model file support,
- cold-start behavior,
- CORS,
- HTTPS,
- environment variables,
- public accessibility.

## 3. Security boundaries

Do not expose model files or secrets unnecessarily.

If an API key is introduced later, it must be stored in environment variables and never committed.

## 4. Failure modes

The application must handle:

- microphone permission denied,
- speech recognition unavailable,
- empty transcript,
- ML API timeout,
- ML API unavailable,
- low confidence,
- invalid API response,
- unsupported command.

Each should produce a user-friendly response.

## 5. Performance target

Do not invent latency numbers.

Measure:

```text
speech recognition duration
API inference duration
total interaction latency
```

only after implementation.
