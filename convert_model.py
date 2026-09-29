import tensorflowjs as tfjs
import tensorflow as tf

print("Loading model...")
model = tf.keras.models.load_model("ml/artifacts/model.keras")

print("Saving to SavedModel...")
model.export("temp_saved_model")

print("Converting model to TFJS format...")
tfjs.converters.convert_tf_saved_model("temp_saved_model", "public/tfjs_model")

print("Conversion complete.")
