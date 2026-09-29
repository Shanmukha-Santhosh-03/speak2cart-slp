import type { Language } from '../types';

// SpeechRecognition type declarations for browser support
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export class VoiceRecognitionService {
  private recognition: any = null;
  public isListening: boolean = false;
  private language: Language = 'en';

  public onResultCallback?: (transcript: string, isFinal: boolean) => void;
  public onErrorCallback?: (error: string) => void;
  public onEndCallback?: () => void;
  public onVolumeChangeCallback?: (volume: number) => void;

  private volumeInterval: any = null;

  constructor(lang: Language = 'en') {
    this.language = lang;
    this.initRecognition();
  }

  public isSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  public setLanguage(lang: Language) {
    this.language = lang;
    if (this.recognition) {
      this.recognition.lang = this.getLangCode(lang);
    }
  }

  private getLangCode(lang: Language): string {
    switch (lang) {
      case 'hi': return 'hi-IN';
      case 'en':
      default:
        return 'en-US';
    }
  }

  private initRecognition() {
    const SpeechClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechClass) return;

    this.recognition = new SpeechClass();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;
    this.recognition.lang = this.getLangCode(this.language);

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript && this.onResultCallback) {
        this.onResultCallback(finalTranscript, true);
      } else if (interimTranscript && this.onResultCallback) {
        this.onResultCallback(interimTranscript, false);
      }
    };

    this.recognition.onerror = (event: any) => {
      this.stopVolumeSimulation();
      this.isListening = false;
      if (this.onErrorCallback) {
        this.onErrorCallback(event.error || 'Speech recognition failed');
      }
    };

    this.recognition.onend = () => {
      this.stopVolumeSimulation();
      this.isListening = false;
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    };
  }

  public start(): boolean {
    if (!this.recognition) {
      this.initRecognition();
    }

    if (!this.recognition) {
      if (this.onErrorCallback) {
        this.onErrorCallback('Speech recognition is not supported in this browser.');
      }
      return false;
    }

    try {
      this.isListening = true;
      this.recognition.start();
      this.startVolumeSimulation();
      return true;
    } catch (e) {
      this.stopVolumeSimulation();
      this.isListening = false;
      if (this.onErrorCallback) {
        this.onErrorCallback('Could not access microphone');
      }
      return false;
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }
    this.stopVolumeSimulation();
    this.isListening = false;
  }

  private startVolumeSimulation() {
    this.stopVolumeSimulation();
    // Simulate real-time audio volume levels for responsive Voice Orb animation
    this.volumeInterval = setInterval(() => {
      if (this.onVolumeChangeCallback && this.isListening) {
        const simulatedVolume = 0.2 + Math.random() * 0.8;
        this.onVolumeChangeCallback(simulatedVolume);
      }
    }, 120);
  }

  private stopVolumeSimulation() {
    if (this.volumeInterval) {
      clearInterval(this.volumeInterval);
      this.volumeInterval = null;
    }
    if (this.onVolumeChangeCallback) {
      this.onVolumeChangeCallback(0);
    }
  }
}
