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
    const [error, setError] = useState<string | null>(null);
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
                setError(null);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                if (event.error === 'not-allowed') {
                    if (window.isSecureContext) {
                        setError('Microphone access denied. Please allow usage in browser settings.');
                    } else {
                        setError('Microphone access requires HTTPS. Please detect using localhost or a secure connection.');
                    }
                } else if (event.error === 'no-speech') {
                    setError('No speech detected. Please try again.');
                } else {
                    setError(`Error: ${event.error}`);
                }
                setRecording(false);
            };

            recognitionRef.current.onend = () => {
                setRecording(false);
            };
        } else {
            console.warn('Web Speech API not supported');
            setError('Browser does not support Speech Recognition.');
        }
    }, [onTranscript]);

    const toggleRecording = () => {
        setError(null);
        if (recording) {
            recognitionRef.current?.stop();
        } else {
            try {
                recognitionRef.current?.start();
                setRecording(true);
            } catch (err) {
                console.error('Failed to start recording:', err);
            }
        }
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <Button
                variant={recording ? 'destructive' : 'default'}
                size="icon"
                className={`h-16 w-16 rounded-full transition-all ${recording ? 'animate-pulse scale-110' : ''}`}
                onClick={toggleRecording}
                title={recording ? 'Stop Recording' : 'Start Recording'}
            >
                {recording ? <Square className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>
            {error && (
                <p className="text-sm text-red-500 max-w-[200px] text-center bg-red-50 p-2 rounded border border-red-200">
                    {error}
                </p>
            )}
        </div>
    );
}
