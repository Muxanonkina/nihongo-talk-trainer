'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [script, setScript] = useState<any[]>([]); // simplified type for now
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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

    // Similarity calculation function for fuzzy matching
    const calculateSimilarity = (str1: string, str2: string): number => {
        const s1 = str1.trim().toLowerCase();
        const s2 = str2.trim().toLowerCase();

        // Exact match gets 100%
        if (s1 === s2) return 100;

        // Character overlap method - good for Japanese text with voice recognition
        const chars1 = new Set(s1.split(''));
        const chars2 = new Set(s2.split(''));

        const intersection = new Set([...chars1].filter(x => chars2.has(x)));
        const union = new Set([...chars1, ...chars2]);

        // Avoid division by zero
        if (union.size === 0) return 0;

        return Math.round((intersection.size / union.size) * 100);
    };

    const handleDialogComplete = async (finalMessages: Message[]) => {
        setSaving(true);
        try {
            // Real Score Calculation with Similarity Matching:
            // Compare user messages with script user lines
            const userScriptLines = script.filter(l => l.sender === 'user');
            const userMessages = finalMessages.filter(m => m.sender === 'user');

            console.log('User Script Lines (sender=user):', userScriptLines);
            console.log('User Messages:', userMessages);

            let totalScore = 0;
            const similarities: number[] = [];

            userMessages.forEach((msg, idx) => {
                if (userScriptLines[idx]) {
                    const similarity = calculateSimilarity(msg.text, userScriptLines[idx].text);
                    similarities.push(similarity);
                    totalScore += similarity;
                    console.log(`Turn ${idx + 1}: "${msg.text}" vs "${userScriptLines[idx].text}" = ${similarity}%`);
                }
            });

            const score = userScriptLines.length > 0
                ? Math.round(totalScore / userScriptLines.length)
                : 100;

            console.log('Similarity scores per turn:', similarities);
            console.log('Calculated Score:', score);


            await api.post('/userprogress', {

                dialogId: params.id,
                score,
                messages: finalMessages,
                feedback: `You completed the scenario with ${score}% accuracy.`
            });

            router.push('/history');
        } catch (error) {
            console.error('Failed to save progress:', error);
            addMessage('Error: Failed to save progress. Please try again.', 'bot');
        } finally {
            setSaving(false);
        }
    };

    const handleUserTranscript = (text: string) => {
        if (saving) return;

        addMessage(text, 'user');

        setTimeout(() => {
            // Progression
            const nextBotLineIndex = currentLineIndex + 2;
            if (nextBotLineIndex < script.length) {
                const line = script[nextBotLineIndex];
                addMessage(line.text, 'bot', line.translation);
                playTTS(line.text);
                setCurrentLineIndex(nextBotLineIndex);
            } else {
                // Dialog finished
                const completionMsg = 'Great job! Scenario complete. Saving your progress...';
                addMessage(completionMsg, 'bot');

                // Construct final messages to include the completion message
                const finalMessages: Message[] = [
                    ...messages,
                    { id: Date.now().toString() + '-user', text, sender: 'user' },
                    { id: Date.now().toString() + '-bot', text: completionMsg, sender: 'bot' }
                ];
                handleDialogComplete(finalMessages);
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
                    {saving && <div className="text-center text-sm text-gray-500 italic">Saving scenario...</div>}
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
