import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface DialogCardProps {
    id: string;
    title: string;
    category: string;
    difficulty: string;
}

export function DialogCard({ id, title, category, difficulty }: DialogCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-500">Category: {category}</p>
                <p className="text-sm font-medium text-blue-600">Level: {difficulty}</p>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href={`/training/${id}`}>Start Conversation</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
