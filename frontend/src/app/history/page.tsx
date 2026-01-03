'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserProgress {
    id: string;
    score: number;
    dialog: {
        title: string;
    };
    createdAt: string;
}

export default function HistoryPage() {
    const [history, setHistory] = useState<UserProgress[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/userprogress');
                setHistory(response.data);
            } catch (error) {
                console.error('Failed to fetch history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="mb-8 text-3xl font-bold">Conversation History</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {history.map((item) => (
                    <Link href={`/history/${item.id}`} key={item.id}>
                        <Card className="cursor-pointer hover:shadow-lg">
                            <CardHeader>
                                <CardTitle>{item.dialog.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Score: {item.score}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
