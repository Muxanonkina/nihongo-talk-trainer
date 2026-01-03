'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square } from 'lucide-react';

interface VoiceRecorderProps {
    onTranscript: (text: string) => void;
    isListening?: boolean;
}

export function VoiceRecorder({ onTranscript }: VoiceRecorderProps) {
    const [recording, setRecording] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.lang = 'ja-JP';
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event: any) => {
                const text = event.results[0][0].transcript;
                onTranscript(text);
                setRecording(false);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setRecording(false);
            };

            recognitionRef.current.onend = () => {
                setRecording(false);
            };
        } else {
            console.warn('Web Speech API not supported');
        }
    }, [onTranscript]);

    const toggleRecording = () => {
        if (recording) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
            setRecording(true);
        }
    };

    return (
        <Button
            variant={recording ? 'destructive' : 'default'}
            size="icon"
            className="h-16 w-16 rounded-full"
            onClick={toggleRecording}
        >
            {recording ? <Square className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>
    );
}
