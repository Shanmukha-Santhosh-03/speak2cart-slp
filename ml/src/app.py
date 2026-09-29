from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.text import tokenizer_from_json
from tensorflow.keras.preprocessing.sequence import pad_sequences
import json
import os
from fastapi.middleware.cors import CORSMiddleware
import re
import google.generativeai as genai
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import Levenshtein # We'll need python-Levenshtein, or just implement a simple lev function

app = FastAPI(title="Voice Intelligence API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and preprocessors
model = None
tokenizer = None
classes = None
class_to_idx = None
idx_to_class = None
max_length = 20

@app.on_event("startup")
def load_ml_components():
    global model, tokenizer, classes, class_to_idx, idx_to_class
    try:
        # Load Tokenizer
        with open('ml/artifacts/tokenizer.json', 'r') as f:
            tokenizer_data = f.read()
        tokenizer = tokenizer_from_json(tokenizer_data)
        
        # Load Label Encoder
        with open('ml/artifacts/label_encoder.json', 'r') as f:
            le_data = json.load(f)
        classes = le_data['classes']
        class_to_idx = {cls: idx for idx, cls in enumerate(classes)}
        idx_to_class = {idx: cls for idx, cls in enumerate(classes)}
        
        # Load Model
        model = tf.keras.models.load_model('ml/artifacts/model.keras')
        print("ML components loaded successfully.")
    except Exception as e:
        print(f"Warning: ML components failed to load on startup. Run training first. Error: {e}")

class PredictRequest(BaseModel):
    text: str

def extract_entities(text: str):
    # Deterministic NLP for entity extraction
    text = text.lower()
    entities = {}
    
    # Simple regex for quantity
    qty_match = re.search(r'\b(\d+(\.\d+)?)\b', text)
    if qty_match:
        entities['quantity'] = float(qty_match.group(1))
    
    # Units
    units = ['bottles', 'bottle', 'cartons', 'carton', 'boxes', 'box', 'bags', 'bag', 'packs', 'pack', 'loaf', 'loaves', 'bunch', 'tubs', 'tub', 'rolls', 'roll', 'kg', 'kilos', 'kilo', 'lbs', 'pound', 'pounds', 'pcs', 'piece', 'pieces']
    for unit in units:
        if re.search(rf'\b{unit}\b', text):
            entities['unit'] = unit
            break
            
    # Try to extract item (heuristic: after units or verbs, excluding common stop words)
    # This is a fallback to ensure we return *something* for the item. The React frontend 
    # uses its own parser as a backup or for extraction if needed, but the SLP spec requires 
    # the API to return entities.
    clean_text = re.sub(r'\b(add|put|buy|get|remove|delete|drop|clear|change|update|find|search|look for|check off|mark|got the|bought the|to my list|on my list|from my list)\b', '', text).strip()
    clean_text = re.sub(r'\b(of|the|a|an)\b', '', clean_text).strip()
    clean_text = re.sub(r'\b(\d+(\.\d+)?)\b', '', clean_text).strip()
    for unit in units:
        clean_text = re.sub(rf'\b{unit}\b', '', clean_text).strip()
    
    if clean_text:
        entities['item'] = ' '.join(clean_text.split())
    else:
        entities['item'] = 'grocery item'
        
    # Search price filter
    price_match = re.search(r'under \$?(\d+(\.\d+)?)', text)
    if price_match:
        entities['priceFilter'] = float(price_match.group(1))
        
    return entities

@app.get("/health")
def health_check():
    return {"status": "ok", "model_loaded": model is not None}

@app.post("/predict-intent")
def predict_intent(request: PredictRequest):
    if model is None or tokenizer is None or classes is None:
        raise HTTPException(status_code=503, detail="Model is not loaded.")
        
    text = request.text.strip()
    if not text:
        return {
            "intent": "UNKNOWN",
            "confidence": 1.0,
            "entities": {}
        }
        
    # Preprocess
    seq = tokenizer.texts_to_sequences([text])
    padded = pad_sequences(seq, maxlen=max_length, padding='post')
    
    # Predict
    pred_probs = model.predict(padded)[0]
    pred_idx = np.argmax(pred_probs)
    confidence = float(pred_probs[pred_idx])
    intent = idx_to_class[pred_idx]
    
    # Thresholding for Unknown
    if confidence < 0.60:
        intent = "UNKNOWN"
        
    entities = extract_entities(text)
    
    return {
        "intent": intent,
        "confidence": confidence,
        "entities": entities
    }

# --- KITCHEN BUDDY LLM INTEGRATION ---

# Custom simple levenshtein to avoid external dependency if not installed
def lev_dist(s1, s2):
    if len(s1) > len(s2):
        s1, s2 = s2, s1
    distances = range(len(s1) + 1)
    for index2, char2 in enumerate(s2):
        newDistances = [index2 + 1]
        for index1, char1 in enumerate(s1):
            if char1 == char2:
                newDistances.append(distances[index1])
            else:
                newDistances.append(1 + min((distances[index1], distances[index1+1], newDistances[-1])))
        distances = newDistances
    return distances[-1]

class KitchenBuddyRequest(BaseModel):
    message: str
    conversationHistory: List[Dict[str, str]] = []
    pantry: List[Dict[str, Any]] = []
    language: str = "English"

class KitchenBuddyResponse(BaseModel):
    answer: str
    scope: str
    normalizedQuestion: str
    usedPantryContext: bool

@app.post("/api/kitchen-buddy", response_model=KitchenBuddyResponse)
def kitchen_buddy(request: KitchenBuddyRequest):
    # Load vocabulary
    try:
        with open('src/data/indianFoodVocabulary.json', 'r') as f:
            vocab = json.load(f)
    except Exception:
        vocab = {
            "biriyani": "biryani", "sambhar": "sambar", "toor dall": "toor dal",
            "garam masla": "garam masala", "turmaric": "turmeric", "dahi": "curd",
            "suji": "rava", "jeera": "cumin", "imli": "tamarind", "dhaniya": "coriander",
            "panner": "paneer", "wid": "with", "n": "and", "wat": "what", "wht": "what",
            "mak": "make", "hav": "have", "insted": "instead", "dall": "dal"
        }
        
    text = request.message.lower()
    
    # 1. Normalization
    for wrong, right in vocab.items():
        text = re.sub(rf'\b{wrong}\b', right, text)
        
    # Fuzzy match known entities
    known_entities = list(set(vocab.values())) + ['paneer', 'sambar', 'rasam', 'biryani', 'tamarind', 'curd', 'rava', 'cumin', 'coriander', 'garam masala', 'turmeric', 'toor dal', 'rice', 'tomato', 'onion', 'dosa', 'idli', 'chapati', 'roti']
    words = text.split()
    corrected_words = []
    for w in words:
        if len(w) < 4 or w in known_entities:
            corrected_words.append(w)
            continue
        best_match = w
        min_d = 999
        for e in known_entities:
            if ' ' in e: continue
            d = lev_dist(w, e)
            if d < min_d:
                min_d = d
                best_match = e
        if min_d == 1 and len(w) >= 5:
            corrected_words.append(best_match)
        else:
            corrected_words.append(w)
    
    normalized_text = ' '.join(corrected_words)
    
    # 2. Context Prep
    pantry_str = "Empty"
    if request.pantry:
        pantry_items = [f"{item.get('name')} ({item.get('quantity')} {item.get('unit')})" for item in request.pantry]
        pantry_str = ", ".join(pantry_items)
        
    # 3. LLM Generation
    api_key = os.environ.get("VITE_GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return {
            "answer": "Kitchen Buddy backend is missing the API key. Please configure the environment variable.",
            "scope": "out_of_scope",
            "normalizedQuestion": normalized_text,
            "usedPantryContext": False
        }
        
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    system_prompt = f"""You are Kitchen Buddy, an intelligent conversational food and kitchen assistant inside Speak2Cart.
Your supported domain includes: food, Indian food, cooking, recipes, ingredients, spices, masalas, cooking techniques, substitutions, food storage, and pantry management.

CRITICAL RULES:
1. ANSWER WHAT THE USER ACTUALLY ASKED. Do not return generic canned responses like "I can help with recipes".
2. You MUST output your response in strict JSON format. Do not use Markdown block syntax (```json).
3. Determine if the question is inside your supported domain. If it is genuinely unrelated (e.g., "Write Java code", "Who won the cricket match?"), set scope to "out_of_scope" and answer with exactly: "I'm Kitchen Buddy, so I can help with food, cooking, ingredients, recipes and your pantry. Ask me something related to your kitchen."
4. Do NOT reject questions just because they are unusual, as long as they relate to food/cooking/kitchen (e.g. "Can I use lemon instead of tamarind?" -> scope "food", answer it!).
5. For recipes/substitutions/pantry questions, provide a concise, useful answer (2-5 sentences or short bullets).

Current User Pantry:
{pantry_str}

Respond in the following JSON format ONLY:
{{
  "answer": "Your actual helpful response here",
  "scope": "food|kitchen|pantry|cooking|out_of_scope",
  "usedPantryContext": true or false
}}
"""
    
    # Build history
    messages = []
    for msg in request.conversationHistory[-5:]:
        role = "model" if msg.get("sender") == "buddy" else "user"
        if role == "model" and "Hi! I'm Kitchen Buddy" in msg.get("text", ""): continue
        messages.append({"role": role, "parts": [msg.get("text")]})
        
    messages.append({"role": "user", "parts": [system_prompt + "\n\nUser Question: " + normalized_text]})
    
    try:
        response = model.generate_content(messages)
        res_text = response.text
        # Clean markdown code block if present
        res_text = res_text.strip()
        if res_text.startswith("```json"):
            res_text = res_text[7:]
        if res_text.startswith("```"):
            res_text = res_text[3:]
        if res_text.endswith("```"):
            res_text = res_text[:-3]
        res_text = res_text.strip()
        
        parsed = json.loads(res_text)
        return {
            "answer": parsed.get("answer", "I couldn't process that."),
            "scope": parsed.get("scope", "food"),
            "normalizedQuestion": normalized_text,
            "usedPantryContext": parsed.get("usedPantryContext", False)
        }
    except Exception as e:
        print("Error generating LLM response:", e)
        return {
            "answer": "Kitchen Buddy is having trouble connecting right now. Please try again.",
            "scope": "error",
            "normalizedQuestion": normalized_text,
            "usedPantryContext": False
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
