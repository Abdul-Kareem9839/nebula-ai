import { useCallback, useRef, useState } from 'react';

/**
 * Browser-native STT/TTS — Web Speech API. Free, no backend round-trip,
 * no API key. Supported in Chrome/Edge; falls back gracefully elsewhere
 * (isSupported === false lets the UI hide voice controls).
 */
export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isSupported = Boolean(SpeechRecognition) && 'speechSynthesis' in window;

  const startListening = useCallback(() => {
    if (!isSupported) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (e) => setTranscript(e.results[0][0].transcript);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isSupported, SpeechRecognition]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const speak = useCallback(
    (text) => {
      if (!isSupported) return;
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    },
    [isSupported]
  );

  return { isSupported, isListening, transcript, startListening, stopListening, speak };
}
