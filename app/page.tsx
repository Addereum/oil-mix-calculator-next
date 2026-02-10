import MixCalculator from "@/components/MixCalculator";

export default function Page() {
    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
            <div className="w-full max-w-xl rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-white/10">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">2T Oil Mix</h1>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                            Presets for classic 2-stroke engines + custom ratios.
                        </p>
                    </div>

                    <span className="rounded-full border border-black/10 px-3 py-1 text-xs text-zinc-600 dark:border-white/10 dark:text-zinc-300">
            v1
          </span>
                </div>

                <div className="mt-6">
                    <MixCalculator />
                </div>

                <div className="mt-6 border-t border-black/10 pt-4 text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400">
                    Results are for convenience. Always follow your engine/oil manufacturer recommendations.
                </div>
            </div>
        </main>
    );
}
