import * as tf from '@tensorflow/tfjs';

let model: tf.LayersModel | null = null;
let tokenizer: any = null;
let labelEncoder: any = null;
let isInitializing = false;

// The base path might need adjustment for GitHub Pages
const getBasePath = () => {
  return import.meta.env.BASE_URL || '/';
};

export async function initMLModel() {
  if (model) return true;
  if (isInitializing) return false;
  
  isInitializing = true;
  try {
    const basePath = getBasePath();
    
    // Load Tokenizer
    const tokenRes = await fetch(`${basePath}tfjs_model/tokenizer.json`);
    tokenizer = await tokenRes.json();
    
    // Load Label Encoder
    const labelRes = await fetch(`${basePath}tfjs_model/label_encoder.json`);
    labelEncoder = await labelRes.json();
    
    // Load Model
    model = await tf.loadLayersModel(`${basePath}tfjs_model/model.json`);
    
    console.log("TFJS Model, tokenizer and label encoder loaded successfully");
    isInitializing = false;
    return true;
  } catch (err) {
    console.error("Failed to load ML model in browser:", err);
    isInitializing = false;
    return false;
  }
}

// Preprocessing: lowercase, remove punct, tokenize, pad to 20
function preprocessText(text: string): number[] {
  const clean = text.toLowerCase().replace(/[^\w\s]/g, '');
  const words = clean.split(/\s+/).filter(w => w.length > 0);
  
  const wordIndex = JSON.parse(tokenizer.config.word_index);
  const sequence = words.map(w => wordIndex[w] || 0); // 0 or <OOV> depending on training, typically keras oov is not explicitly in dict if not set
  
  // Pad/truncate to 20
  const maxLen = 20;
  let padded = [...sequence];
  if (padded.length > maxLen) {
    padded = padded.slice(0, maxLen);
  } else {
    while (padded.length < maxLen) {
      padded.push(0); // POST padding
    }
  }
  return padded;
}

export async function predictIntentTFJS(text: string): Promise<{ intent: string, confidence: number }> {
  if (!model) {
    const ready = await initMLModel();
    if (!ready) throw new Error("Model not ready");
  }
  
  const padded = preprocessText(text);
  
  // Create a tensor with shape [1, 20]
  const inputTensor = tf.tensor2d([padded], [1, 20], 'float32');
  
  // Predict
  const prediction = model!.predict(inputTensor) as tf.Tensor;
  const probs = await prediction.data();
  
  // Cleanup tensor
  inputTensor.dispose();
  prediction.dispose();
  
  // Find argmax
  let maxIdx = 0;
  let maxProb = probs[0];
  for (let i = 1; i < probs.length; i++) {
    if (probs[i] > maxProb) {
      maxProb = probs[i];
      maxIdx = i;
    }
  }
  
  const classLabels = labelEncoder.classes;
  let intent = classLabels[maxIdx];
  
  if (maxProb < 0.60) {
    intent = "UNKNOWN";
  }
  
  return { intent, confidence: maxProb };
}
