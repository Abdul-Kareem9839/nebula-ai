# Voice (STT/TTS)

Kept out of the backend on purpose. The Web Speech API
(`SpeechRecognition` for STT, `speechSynthesis` for TTS) runs in-browser,
is built into Chrome/Edge, and costs nothing — no API key, no per-minute
billing, no server round-trip for audio.

See `frontend/src/features/orb/useVoice.js` for the client-side hook.

If browser support becomes a blocker later (e.g. Safari/Firefox gaps),
swap in a hosted free-tier STT/TTS provider here without touching any
other feature — same reasoning as the AI provider abstraction layer.
