import { useState, useCallback, useEffect, useRef } from 'react';

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
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported in this browser');
      return;
    }

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    loadVoices();
    
    if ('onvoiceschanged' in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    return () => {
      stop();
    };
  }, []);

  const speak = useCallback((text: string, options: TextToSpeechOptions = {}) => {
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported in this browser');
      return;
    }

    stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    const mergedOptions = { ...defaultOptions, ...options };
    if (mergedOptions.rate !== undefined) utterance.rate = mergedOptions.rate;
    if (mergedOptions.pitch !== undefined) utterance.pitch = mergedOptions.pitch;
    if (mergedOptions.volume !== undefined) utterance.volume = mergedOptions.volume;
    if (mergedOptions.lang !== undefined) utterance.lang = mergedOptions.lang;
    if (mergedOptions.voice !== undefined && mergedOptions.voice !== null) {
      utterance.voice = mergedOptions.voice;
    }

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      setPaused(false);
      utteranceRef.current = null;
    };
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setSpeaking(false);
      setPaused(false);
      utteranceRef.current = null;
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error starting speech synthesis:', error);
    }
  }, [defaultOptions]);

  const stop = useCallback(() => {
    if (!window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setSpeaking(false);
    setPaused(false);
  }, []);

  const pause = useCallback(() => {
    if (!window.speechSynthesis || !speaking) return;
    
    try {
      window.speechSynthesis.pause();
      setPaused(true);
    } catch (error) {
      console.error('Error pausing speech synthesis:', error);
    }
  }, [speaking]);

  const resume = useCallback(() => {
    if (!window.speechSynthesis || !paused) return;
    
    try {
      window.speechSynthesis.resume();
      setPaused(false);
    } catch (error) {
      console.error('Error resuming speech synthesis:', error);
    }
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
