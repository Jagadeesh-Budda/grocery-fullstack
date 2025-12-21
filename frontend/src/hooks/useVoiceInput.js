import { useState, useRef, useEffect } from "react";

export default function useVoiceInput() {
    const [transcript, setTranscript] = useState("");
    const [isListening, setIsListening] = useState(false);
    const recognizerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (recognizerRef.current) {
                try {
                    recognizerRef.current.stop();
                } catch (e) {}
                recognizerRef.current = null;
            }
        };
    }, []);

    const startListening = () => {
        if (isListening || recognizerRef.current) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech Recognition API not supported");
            return;
        }

        const recognizer = new SpeechRecognition();
        recognizer.lang = "en-US";
        recognizer.interimResults = false;
        recognizer.maxAlternatives = 1;

        recognizer.onstart = () => setIsListening(true);

        recognizer.onresult = (event) => {
            const result = event.results[0]?.[0]?.transcript || "";
            setTranscript(result);
        };

        recognizer.onend = () => {
            setIsListening(false);
            recognizerRef.current = null;
        };

        recognizer.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
            recognizerRef.current = null;
        };

        recognizerRef.current = recognizer;
        try {
            recognizer.start();
        } catch (e) {
            console.error("Failed to start speech recognition:", e);
            setIsListening(false);
            recognizerRef.current = null;
        }
    };

    const stopListening = () => {
        if (recognizerRef.current) {
            try {
                recognizerRef.current.stop();
            } catch (e) {}
        }
        setIsListening(false);
    };

    return {
        transcript,
        isListening,
        startListening,
        stopListening,
    };
}