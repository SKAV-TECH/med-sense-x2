
import { useState, useCallback } from 'react';

interface TextToSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
  voice?: SpeechSynthesisVoice | null;
}

export function useTextToSpeech(defaultOptions: TextToSpeechOptions = {}) {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load voices when available
  useState(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    loadVoices();
    
    // Chrome loads voices asynchronously
    if ('onvoiceschanged' in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  });

  const speak = useCallback((text: string, options: TextToSpeechOptions = {}) => {
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported in this browser');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create utterance with text
    const utterance = new SpeechSynthesisUtterance(text);

    // Set options
    const mergedOptions = { ...defaultOptions, ...options };
    if (mergedOptions.rate !== undefined) utterance.rate = mergedOptions.rate;
    if (mergedOptions.pitch !== undefined) utterance.pitch = mergedOptions.pitch;
    if (mergedOptions.volume !== undefined) utterance.volume = mergedOptions.volume;
    if (mergedOptions.lang !== undefined) utterance.lang = mergedOptions.lang;
    if (mergedOptions.voice !== undefined && mergedOptions.voice !== null) {
      utterance.voice = mergedOptions.voice;
    }

    // Set event handlers
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      setPaused(false);
    };
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setSpeaking(false);
      setPaused(false);
    };

    // Speak
    window.speechSynthesis.speak(utterance);
  }, [defaultOptions]);

  const stop = useCallback(() => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  }, []);

  const pause = useCallback(() => {
    if (!window.speechSynthesis || !speaking) return;
    window.speechSynthesis.pause();
    setPaused(true);
  }, [speaking]);

  const resume = useCallback(() => {
    if (!window.speechSynthesis || !paused) return;
    window.speechSynthesis.resume();
    setPaused(false);
  }, [paused]);

  return {
    speak,
    stop,
    pause,
    resume,
    speaking,
    paused,
    voices,
  };
}

export default useTextToSpeech;
