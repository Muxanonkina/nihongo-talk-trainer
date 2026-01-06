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
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDialogs = async () => {
            try {
                // Check for token first
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No authentication token found. Please login.');
                    setLoading(false);
                    return;
                }

                console.log('Fetching dialogs...');
                const response = await api.get('/dialogs');
                console.log('Dialogs response:', response.data);

                if (Array.isArray(response.data)) {
                    setDialogs(response.data);
                } else {
                    console.error('Unexpected response format:', response.data);
                    setError('Received invalid data from server.');
                }
            } catch (error: any) {
                console.error('Failed to fetch dialogs:', error);

                if (error.response) {
                    // Server responded with a status code other than 2xx
                    setError(error.response.data?.message || `Server Error: ${error.response.status}`);
                } else if (error.request) {
                    // Request was made but no response received
                    setError('Cannot connect to the server. Please check if the backend is running.');
                } else {
                    // Something happened in setting up the request
                    setError('An unexpected error occurred.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDialogs();
    }, []);

    if (loading) {
        return <div className="p-8 text-center">Loading scenarios...</div>;
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-500">
                <p className="font-bold">Error</p>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="mb-8 text-3xl font-bold">Choose a Scenario</h1>
            {dialogs.length === 0 ? (
                <p className="text-gray-500">No scenarios found.</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {dialogs.map((dialog) => (
                        <DialogCard key={dialog.id} {...dialog} />
                    ))}
                </div>
            )}
        </div>
    );
}

