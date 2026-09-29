import vocabularyData from '../data/indianFoodVocabulary.json';
import kbData from '../data/kitchenKnowledgeBase.json';

const vocabulary: Record<string, string> = vocabularyData;
const kb = kbData as { topic: string, content: string }[];

// Simple Levenshtein distance
function levenshtein(a: string, b: string): number {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Known food entities to fuzzy match against
const foodEntities = Array.from(new Set(Object.values(vocabulary).concat([
  'paneer', 'sambar', 'rasam', 'biryani', 'tamarind', 'curd', 'rava', 'cumin', 'coriander', 
  'garam masala', 'turmeric', 'toor dal', 'rice', 'tomato', 'onion'
])));

export interface NormalizationResult {
  original: string;
  normalized: string;
  uncertainMatches: { originalWord: string, suggestedWord: string }[];
}

export function processUserMessage(text: string): NormalizationResult {
  let normalized = text.toLowerCase();
  const uncertainMatches: { originalWord: string, suggestedWord: string }[] = [];
  
  // 1. Direct dictionary replacement (for known slang/abbreviations)
  Object.entries(vocabulary).forEach(([wrong, right]) => {
    const regex = new RegExp(`\\b${wrong}\\b`, 'g');
    normalized = normalized.replace(regex, right);
  });

  // 2. Fuzzy match words against known food entities
  const words = normalized.split(/\s+/);
  const correctedWords = words.map(word => {
    // skip small words
    if (word.length < 4) return word;
    
    // exact match exists
    if (foodEntities.includes(word)) return word;

    let bestMatch = '';
    let minDistance = 999;
    
    for (const entity of foodEntities) {
      // Don't fuzzy match against multi-word entities for single words (keep it simple)
      if (entity.includes(' ')) continue;

      const dist = levenshtein(word, entity);
      if (dist < minDistance) {
        minDistance = dist;
        bestMatch = entity;
      }
    }

    if (minDistance === 1 && word.length >= 5) {
      // High confidence (1 typo in a 5+ letter word) -> automatically normalize
      return bestMatch;
    } else if (minDistance === 1 || (minDistance === 2 && word.length >= 6)) {
      // Uncertain -> ask the user
      uncertainMatches.push({ originalWord: word, suggestedWord: bestMatch });
      return word; // Keep original for now until user confirms
    }
    
    return word;
  });

  normalized = correctedWords.join(' ');
  // Capitalize first letter of normalized just to make it nice, or keep it lowercase for NLP
  
  return {
    original: text,
    normalized,
    uncertainMatches
  };
}

export function retrieveKnowledge(query: string): string {
  const q = query.toLowerCase();
  let relevantInfo = [];
  
  for (const entry of kb) {
    if (q.includes(entry.topic.toLowerCase())) {
      relevantInfo.push(entry.content);
    }
  }
  
  return relevantInfo.join('\n\n');
}
