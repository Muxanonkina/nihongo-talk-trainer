import Link from 'next/link';

export function Navbar() {
    return (
        <nav className="border-b">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="text-xl font-bold">
                    Nihongo Talk Trainer
                </Link>
                <div className="flex gap-4">
                    <Link href="/dialogs" className="text-sm font-medium hover:underline">
                        Dialogs
                    </Link>
                    <Link href="/history" className="text-sm font-medium hover:underline">
                        History
                    </Link>
                    <Link href="/login" className="text-sm font-medium hover:underline">
                        Login
                    </Link>
                </div>
            </div>
        </nav>
    );
}
