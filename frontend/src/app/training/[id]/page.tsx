'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ChatBubble } from '@/components/dialog/ChatBubble';
import { VoiceRecorder } from '@/components/dialog/VoiceRecorder';
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

    // Mock Script
    const script = [
        { sender: 'bot', text: 'いらっしゃいませ！', translation: 'Welcome!' },
        { sender: 'user', text: 'すみません、これいくらですか？', translation: 'Excuse me, how much is this?' },
        { sender: 'bot', text: 'それは百円です。', translation: 'That is 100 yen.' },
        { sender: 'user', text: 'じゃ、これください。', translation: 'Okay, I will take this.' },
    ] as const;

    useEffect(() => {
        // Initial greeting
        if (messages.length === 0) {
            addMessage(script[0].text, 'bot', script[0].translation);
            playTTS(script[0].text);
        }
    }, []);

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
