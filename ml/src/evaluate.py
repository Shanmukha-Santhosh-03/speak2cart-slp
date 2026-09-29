import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.text import tokenizer_from_json
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

def load_data(filepath):
    with open(filepath, 'r') as f:
        data = json.load(f)
    texts = [item['text'] for item in data]
    labels = [item['intent'] for item in data]
    return texts, labels

# Load test data
test_texts, test_labels = load_data('ml/data/splits/test.json')

# Load Tokenizer
with open('ml/artifacts/tokenizer.json', 'r') as f:
    tokenizer_data = f.read()
tokenizer = tokenizer_from_json(tokenizer_data)

max_length = 20

# Prepare test data
test_seq = tokenizer.texts_to_sequences(test_texts)
test_padded = pad_sequences(test_seq, maxlen=max_length, padding='post')

# Load Label Encoder
with open('ml/artifacts/label_encoder.json', 'r') as f:
    le_data = json.load(f)
classes = le_data['classes']

class_to_idx = {cls: idx for idx, cls in enumerate(classes)}
idx_to_class = {idx: cls for idx, cls in enumerate(classes)}

test_labels_encoded = [class_to_idx[label] for label in test_labels]

# Load Model
model = tf.keras.models.load_model('ml/artifacts/model.keras')

# Predict
predictions = model.predict(test_padded)
predicted_classes = np.argmax(predictions, axis=1)

# Metrics
accuracy = accuracy_score(test_labels_encoded, predicted_classes)
precision = precision_score(test_labels_encoded, predicted_classes, average='macro', zero_division=0)
recall = recall_score(test_labels_encoded, predicted_classes, average='macro', zero_division=0)
f1 = f1_score(test_labels_encoded, predicted_classes, average='macro', zero_division=0)

results = {
    'accuracy': accuracy,
    'macro_precision': precision,
    'macro_recall': recall,
    'macro_f1': f1
}

with open('ml/results/metrics.json', 'w') as f:
    json.dump(results, f, indent=2)

print(f"Accuracy: {accuracy:.4f}")
print(f"Macro Precision: {precision:.4f}")
print(f"Macro Recall: {recall:.4f}")
print(f"Macro F1: {f1:.4f}")

# Confusion Matrix
cm = confusion_matrix(test_labels_encoded, predicted_classes)
plt.figure(figsize=(10, 8))
sns.heatmap(cm, annot=True, fmt='d', xticklabels=classes, yticklabels=classes, cmap='Blues')
plt.xlabel('Predicted')
plt.ylabel('True')
plt.title('Confusion Matrix')
plt.tight_layout()
plt.savefig('ml/results/confusion_matrix.png')

print("Evaluation complete. Metrics and confusion matrix saved.")
