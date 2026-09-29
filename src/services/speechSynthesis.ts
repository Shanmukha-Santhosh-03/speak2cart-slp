import type { Language } from '../types';

export class SpeechSynthesisService {
  private synth: SpeechSynthesis | null = null;
  private enabled: boolean = true;
  private currentLanguage: Language = 'en';

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled && this.synth) {
      this.synth.cancel();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setLanguage(lang: Language) {
    this.currentLanguage = lang;
  }

  public speak(text: string) {
    if (!this.enabled || !this.synth || !text) return;

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;

    const voices = this.synth.getVoices();
    const langCode = this.getLangCode(this.currentLanguage);
    
    // Find matching voice for language
    const voice = voices.find(v => v.lang.startsWith(langCode)) || voices[0];
    if (voice) {
      utterance.voice = voice;
    }

    this.synth.speak(utterance);
  }

  private getLangCode(lang: Language): string {
    switch (lang) {
      case 'hi': return 'hi';
      case 'en':
      default:
        return 'en';
    }
  }
}
