'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { DialogCard } from '@/components/auth/dialog/DialogCard';

interface Dialog {
    id: string;
    title: string;
    category: string;
    difficulty: string;
}

export default function DialogsPage() {
    const [dialogs, setDialogs] = useState<Dialog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDialogs = async () => {
            try {
                const response = await api.get('/dialogs');
                setDialogs(response.data);
            } catch (error) {
                console.error('Failed to fetch dialogs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDialogs();
    }, []);

    return (
        <div className="container mx-auto py-8">
            <h1 className="mb-8 text-3xl font-bold">Choose a Scenario</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {dialogs.map((dialog) => (
                    <DialogCard key={dialog.id} {...dialog} />
                ))}
            </div>
        </div>
    );
}
