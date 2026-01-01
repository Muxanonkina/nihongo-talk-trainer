import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-8 py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight">
        Master Japanese Conversation <br /> with AI
      </h1>
      <p className="max-w-2xl text-lg text-gray-600">
        Practice realistic dialogues, improve your pronunciation, and gain confidence in Japanese.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/dialogs">Start Training</Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </div>
  );
}
