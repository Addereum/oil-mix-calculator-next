import MixCalculator from "@/components/MixCalculator";

export default function Page() {
    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
            <div className="w-full max-w-xl rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-white/10">
                <h1 className="text-2xl font-semibold tracking-tight">2-Stroke Oil Mix Calculator</h1>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                    Choose a preset or enter a custom ratio (1:X).
                </p>

                <div className="mt-6">
                    <MixCalculator />
                </div>
            </div>
        </main>
    );
}
