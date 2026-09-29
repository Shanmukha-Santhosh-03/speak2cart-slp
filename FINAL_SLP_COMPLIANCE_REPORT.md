# SLP Compliance Report

1. **Speech Recognition**: Implemented via Web Speech API in the browser.
2. **Recognized Speech Displayed**: Visible in the VoiceOrb UI component.
3. **Genuine Deep Learning Model**: A Custom Keras BiLSTM model is converted and run locally via TensorFlow.js.
4. **Appropriate Chatbot Response**: UI Actions (e.g. adding items to list) and TTS feedback provided. Open-ended queries answered by Kitchen Buddy (Gemini via Cloudflare Worker).
5. **Public Online Deployment**: Frontend hosted on GitHub Pages, API hosted on Cloudflare Workers. Cost is \.
6. **Source Code**: Provided in this repository.
7. **Dataset**: Custom dataset located in ml/data/.
8. **Model Architecture**: Documented in MODEL_CARD.md and FINAL_IMPLEMENTATION_REPORT.md.
9. **Methodology**: Documented in FINAL_IMPLEMENTATION_REPORT.md.
10. **Results**: Evaluation metrics (F1 0.82) are in FINAL_IMPLEMENTATION_REPORT.md.
