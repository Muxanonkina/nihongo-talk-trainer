'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { DialogCard } from '@/components/dialog/DialogCard';

interface Dialog {
    id: string;
    title: string;
    category: string;
    difficulty: string;
}

export default function DialogsPage() {
    const [dialogs, setDialogs] = useState<Dialog[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock data for MVP if API fails
    const mockDialogs = [
        { id: '1', title: 'At the Convenience Store', category: 'Shopping', difficulty: 'N5' },
        { id: '2', title: 'Ordering at a Restaurant', category: 'Restaurant', difficulty: 'N4' },
        { id: '3', title: 'Self Introduction', category: 'Social', difficulty: 'N5' },
    ];

    useEffect(() => {
        // In real app, fetch from API
        // api.get('/dialogs').then((res) => setDialogs(res.data)).catch(...);
        setDialogs(mockDialogs);
        setLoading(false);
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
