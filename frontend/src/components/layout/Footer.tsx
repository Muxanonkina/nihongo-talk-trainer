export function Footer() {
    return (
        <footer className="border-t py-6 text-center text-sm text-gray-500">
            <div className="container mx-auto">
                &copy; {new Date().getFullYear()} Nihongo Talk Trainer.
            </div>
        </footer>
    );
}
