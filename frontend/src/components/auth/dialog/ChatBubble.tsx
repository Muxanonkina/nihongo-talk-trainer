import { cn } from '@/lib/utils';

interface ChatBubbleProps {
    text: string;
    sender: 'user' | 'bot';
    translation?: string;
}

export function ChatBubble({ text, sender, translation }: ChatBubbleProps) {
    const isUser = sender === 'user';

    return (
        <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
            <div
                className={cn(
                    'max-w-[80%] rounded-lg p-4',
                    isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                )}
            >
                <p className="text-lg">{text}</p>
                {translation && (
                    <p className={cn('mt-1 text-sm', isUser ? 'text-blue-100' : 'text-gray-500')}>
                        {translation}
                    </p>
                )}
            </div>
        </div>
    );
}
