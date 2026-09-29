# VIVA Preparation Guide

**Q: What is speech recognition?**
A: Speech recognition (or Speech-to-Text) is the technology that captures acoustic audio signals from a microphone and converts them into a text transcript.

**Q: What is the difference between speech recognition and NLP?**
A: Speech recognition merely converts voice into a raw string of text. NLP (Natural Language Processing) takes that text and understands its meaning, classifying the intent or extracting entities.

**Q: Why did you choose this model?**
A: A Bidirectional LSTM (BiLSTM) is excellent for sequential data like text. It reads the sentence forwards and backwards, meaning the context of words at the end of a command can influence the understanding of words at the beginning.

**Q: What is an embedding?**
A: An embedding is a dense numerical vector representation of a word. Instead of treating words as arbitrary IDs, embeddings map words into a mathematical space where words with similar meanings are located closer together.

**Q: Why use BiLSTM?**
A: Standard LSTMs only read sequences in one direction (past to future). BiLSTMs process the text in both directions, giving the network stronger contextual understanding for parsing ambiguous sentences.

**Q: Why use softmax?**
A: Softmax is used in the final layer of a multi-class classification network. It squashes the raw output scores of the network into a probability distribution that sums to 1.0, allowing us to interpret the output as confidence percentages for each intent.

**Q: What loss function did you use?**
A: Sparse Categorical Crossentropy. This is the standard loss function for multi-class classification when the labels are provided as integers rather than one-hot encoded vectors.

**Q: What is dropout?**
A: Dropout is a regularization technique where randomly selected neurons are ignored during training. This prevents the network from relying too heavily on specific pathways and forces it to generalize better, preventing overfitting.

**Q: What is overfitting?**
A: Overfitting happens when a model learns the training data too well, memorizing the noise and exact phrasing instead of the underlying patterns, leading to poor performance on unseen test data.

**Q: How did you split your dataset?**
A: We used a 70% Train, 15% Validation, and 15% Test split with a fixed random seed.

**Q: How did you prevent leakage?**
A: We removed exact duplicates from the dataset before splitting to ensure the test set evaluates genuine generalization on unseen examples rather than memorized duplicates.

**Q: What does accuracy mean?**
A: Accuracy is the ratio of correctly predicted intents over the total number of predictions in the test set.

**Q: Why use macro F1?**
A: Macro F1 averages the F1 scores (the harmonic mean of precision and recall) for each class independently. It treats all classes equally, making it a better metric than accuracy for datasets that might have class imbalances.

**Q: What does confidence represent?**
A: Confidence represents the softmax probability of the winning class. It indicates how certain the model is that the chosen intent is correct based on the patterns it learned.

**Q: What happens for unknown input?**
A: The system implements a confidence policy. If the top intent prediction falls below a 60% confidence threshold, the backend forces the intent to `UNKNOWN`, prompting the chatbot to ask for clarification.

**Q: What is entity extraction?**
A: Entity extraction is the process of identifying specific parameters within the text (e.g., extracting "3" for quantity, "bottles" for unit, and "water" for item) to execute the action.

**Q: Why is the existing rule parser not deep learning?**
A: The original parser relies on rigid, manually programmed regular expressions (like `if text matches "add"`). Deep learning relies on weights learned algorithmically from data without explicit manual rules.

**Q: Where is your trained model?**
A: The final trained weights are stored in `ml/artifacts/model.keras` and loaded dynamically by the FastAPI backend during runtime.

**Q: How does the frontend communicate with the model?**
A: The React frontend makes a `POST` HTTP request containing the transcript to the FastAPI backend (`/predict-intent`), which runs inference and returns a JSON response containing the intent and confidence.

**Q: Why did you use an API?**
A: Modern deep learning models require heavy runtimes (like TensorFlow/Python) that do not natively execute in the browser. Decoupling the UI (React) from the Model (Python/FastAPI) allows each to operate efficiently in its optimal environment.

**Q: What happens if the ML service is unavailable?**
A: The React frontend catches the network error and gracefully falls back to the original rule-based parser so the user experience is not completely broken.

**Q: What are the limitations of browser speech recognition?**
A: It relies entirely on the browser's implementation (e.g., Chrome's Web Speech API). It cannot function offline (often requiring Google's cloud servers), struggles with background noise, and requires HTTPS.

**Q: How is the application deployed?**
A: The application architecture separates the frontend (compiled to static HTML/JS/CSS) which can be hosted on a CDN (like Vercel), and the Python ML API which must be deployed on a server or container platform capable of running TensorFlow (like Heroku or AWS).
