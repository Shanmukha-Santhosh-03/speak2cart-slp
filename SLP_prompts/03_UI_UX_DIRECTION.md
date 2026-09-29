# UI/UX Direction — Fresh, Cohesive, Non-Template

## 1. Design objective

The interface should feel like a deliberate product, not a generic student dashboard.

Avoid:

- default Bootstrap-looking cards,
- excessive gradients,
- random glassmorphism,
- oversized hero sections,
- generic "AI chatbot" neon styling,
- excessive rounded rectangles,
- decorative elements without function.

## 2. Visual concept

### Product language

**Quiet intelligence + tactile voice interaction**

The visual identity should communicate:

- voice,
- clarity,
- trust,
- shopping utility,
- intelligent assistance.

## 3. Layout

Use a compact application shell:

```text
┌───────────────────────────────────────────────────────────┐
│ Brand / status                         Profile / settings │
├───────────────┬───────────────────────────────────────────┤
│               │                                           │
│ Navigation    │             Conversation                  │
│               │                                           │
│ Assistant     │  User transcript                          │
│ Shopping      │  Assistant response                       │
│ Insights      │                                           │
│ History       │  ─────────────────────────────────────    │
│               │                                           │
│               │             Voice control                 │
│               │                                           │
└───────────────┴───────────────────────────────────────────┘
```

## 4. Voice interaction

The microphone control should be the visual focal point without dominating the entire screen.

States:

```text
IDLE
LISTENING
PROCESSING
RESPONDING
ERROR
```

Each state must have a clear visual difference.

## 5. Conversation view

Every interaction should show:

### User

```text
You said
"Add three bottles of water"
```

### Assistant

```text
Added 3 bottles of water.
```

Optional technical detail:

```text
Intent        ADD_ITEM
Confidence    97%
Entities      water · 3 · bottles
```

Technical information should be visually secondary and optionally collapsible.

## 6. Visual hierarchy

Prioritize:

1. current voice interaction,
2. recognized speech,
3. assistant response,
4. shopping result,
5. technical inference details.

## 7. Motion

Use restrained motion:

- microphone pulse while listening,
- subtle processing indicator,
- response entrance,
- list-item confirmation.

No constant animations.

## 8. Accessibility

Ensure:

- keyboard accessibility,
- visible focus,
- readable contrast,
- clear microphone state,
- error text,
- non-voice fallback input.

## 9. Responsive behavior

The core conversation and microphone flow must work on desktop and mobile-sized layouts.

## 10. Existing components

Prefer evolving existing components rather than replacing the entire UI.

Before modifying a component, understand its current responsibility and preserve working behavior.
