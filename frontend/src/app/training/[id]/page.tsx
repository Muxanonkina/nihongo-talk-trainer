'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/axios';
import { ChatBubble } from '@/components/auth/dialog/ChatBubble';
import { VoiceRecorder } from '@/components/auth/dialog/VoiceRecorder';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    translation?: string;
}

export default function TrainingPage() {
    const params = useParams();
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [script, setScript] = useState<any[]>([]); // simplified type for now
    const [loading, setLoading] = useState(true);
    const initializedRef = useRef(false);

    useEffect(() => {
        const fetchDialog = async () => {
            try {
                const response = await api.get(`/dialogs/${params.id}`);
                const dialogData = response.data;
                if (dialogData && dialogData.script) {
                    setScript(dialogData.script);

                    // Initial greeting - only if not already initialized
                    if (!initializedRef.current) {
                        const firstLine = dialogData.script[0];
                        if (firstLine) {
                            addMessage(firstLine.text, 'bot', firstLine.translation);
                            playTTS(firstLine.text);
                        }
                        initializedRef.current = true;
                    }
                }
            } catch (error) {
                console.error("Failed to fetch dialog", error);
            } finally {
                setLoading(false);
            }
        }

        if (params.id) {
            fetchDialog();
        }
    }, [params.id]);

    const addMessage = (text: string, sender: 'user' | 'bot', translation?: string) => {
        setMessages((prev) => [
            ...prev,
            { id: Date.now().toString(), text, sender, translation },
        ]);
    };

    const handleUserTranscript = (text: string) => {
        addMessage(text, 'user');

        // Simple Mock Evaluation & Progression
        // In real app: compare text with script[currentLineIndex + 1].text

        setTimeout(() => {
            // Mock Bot Reply
            const nextBotLineIndex = currentLineIndex + 2;
            if (nextBotLineIndex < script.length) {
                const line = script[nextBotLineIndex];
                addMessage(line.text, 'bot', line.translation);
                playTTS(line.text);
                setCurrentLineIndex(nextBotLineIndex);
            } else {
                // Dialog finished
                addMessage('Great job! Scenario complete.', 'bot');
            }
        }, 1000);

        setCurrentLineIndex(currentLineIndex + 1); // Move to user line
    };

    const playTTS = (text: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ja-JP';
            window.speechSynthesis.speak(utterance);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading scenario...</div>;
    }

    if (!script || script.length === 0) {
        return <div className="p-8 text-center">Scenario not found.</div>;
    }

    return (
        <div className="container mx-auto flex h-[calc(100vh-4rem)] flex-col py-4">
            <Card className="flex flex-1 flex-col overflow-hidden">
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                        <ChatBubble key={msg.id} {...msg} />
                    ))}
                </CardContent>
                <div className="border-t p-4 flex justify-center items-center bg-gray-50">
                    <div className="text-center space-y-2">
                        <p className="text-sm text-gray-500">Tap mic to speak</p>
                        <VoiceRecorder onTranscript={handleUserTranscript} />
                    </div>
                </div>
            </Card>
        </div>
    );
}
