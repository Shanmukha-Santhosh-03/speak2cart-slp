import json
import numpy as np
import os
import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, Bidirectional, LSTM, Dropout, Dense
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from sklearn.preprocessing import LabelEncoder
import matplotlib.pyplot as plt

# Set random seed for reproducibility
np.random.seed(42)
tf.random.set_seed(42)

def load_data(filepath):
    with open(filepath, 'r') as f:
        data = json.load(f)
    texts = [item['text'] for item in data]
    labels = [item['intent'] for item in data]
    return texts, labels

# Load data
train_texts, train_labels = load_data('ml/data/splits/train.json')
val_texts, val_labels = load_data('ml/data/splits/validation.json')
test_texts, test_labels = load_data('ml/data/splits/test.json')

# Tokenizer
tokenizer = Tokenizer(oov_token='<OOV>')
tokenizer.fit_on_texts(train_texts)

vocab_size = len(tokenizer.word_index) + 1
max_length = 20 # reasonable max length for voice commands

# Save Tokenizer
with open('ml/artifacts/tokenizer.json', 'w') as f:
    f.write(tokenizer.to_json())

# Convert to sequences and pad
train_seq = tokenizer.texts_to_sequences(train_texts)
train_padded = pad_sequences(train_seq, maxlen=max_length, padding='post')

val_seq = tokenizer.texts_to_sequences(val_texts)
val_padded = pad_sequences(val_seq, maxlen=max_length, padding='post')

test_seq = tokenizer.texts_to_sequences(test_texts)
test_padded = pad_sequences(test_seq, maxlen=max_length, padding='post')

# Label Encoder
label_encoder = LabelEncoder()
label_encoder.fit(train_labels)

# Save Label Encoder
with open('ml/artifacts/label_encoder.json', 'w') as f:
    json.dump({
        'classes': label_encoder.classes_.tolist()
    }, f, indent=2)

train_labels_encoded = label_encoder.transform(train_labels)
val_labels_encoded = label_encoder.transform(val_labels)
test_labels_encoded = label_encoder.transform(test_labels)

num_classes = len(label_encoder.classes_)

# Model architecture
model = Sequential([
    Embedding(input_dim=vocab_size, output_dim=128, input_length=max_length),
    Bidirectional(LSTM(64)),
    Dropout(0.3),
    Dense(64, activation='relu'),
    Dropout(0.3),
    Dense(num_classes, activation='softmax')
])

model.compile(loss='sparse_categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
model.summary()

# Callbacks
early_stop = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
checkpoint = ModelCheckpoint('ml/artifacts/model.keras', monitor='val_loss', save_best_only=True)

# Train
history = model.fit(
    train_padded, train_labels_encoded,
    epochs=50,
    validation_data=(val_padded, val_labels_encoded),
    callbacks=[early_stop, checkpoint],
    verbose=1
)

# Save training history plot
plt.figure(figsize=(12, 4))
plt.subplot(1, 2, 1)
plt.plot(history.history['loss'], label='Train Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.legend()
plt.title('Loss')

plt.subplot(1, 2, 2)
plt.plot(history.history['accuracy'], label='Train Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
plt.legend()
plt.title('Accuracy')
plt.savefig('ml/results/training_history.png')

print("Training complete. Model and artifacts saved.")
