"use client";

import { useMemo, useState } from "react";
import { PRESETS } from "@/lib/presets";

type Mode = "preset" | "custom";

function clampNumber(n: number) {
    return Number.isFinite(n) ? n : 0;
}

export default function MixCalculator() {
    const [liters, setLiters] = useState<number>(5);
    const [mode, setMode] = useState<Mode>("preset");
    const [presetId, setPresetId] = useState<string>(PRESETS[0].id);
    const [customX, setCustomX] = useState<number>(50);

    const x = useMemo(() => {
        if (mode === "preset") return PRESETS.find((p) => p.id === presetId)?.x ?? 50;
        return customX;
    }, [mode, presetId, customX]);

    const oilMl = useMemo(() => {
        const L = clampNumber(liters);
        const ratio = clampNumber(x);
        if (L <= 0 || ratio <= 0) return null;
        return (L * 1000) / ratio;
    }, [liters, x]);

    const rounded = oilMl === null ? null : Math.round(oilMl);

    const error =
        liters <= 0
            ? "Fuel must be > 0."
            : x < 10 || x > 200
                ? "Ratio X should be between 10 and 200."
                : null;

    const inputClass =
        "w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 " +
        "border-black/10 bg-white focus:ring-black/10 " +
        "dark:border-white/10 dark:bg-zinc-950 dark:focus:ring-white/10";

    const copyText = rounded === null ? "" : `${liters} L @ 1:${x} → ${rounded} ml oil`;

    async function copy() {
        try {
            await navigator.clipboard.writeText(copyText);
        } catch {
            // ignore
        }
    }

    return (
        <div className="space-y-5">
            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                    Fuel (liters)
                </label>
                <input
                    className={inputClass}
                    type="number"
                    min={0}
                    step={0.1}
                    value={liters}
                    onChange={(e) => setLiters(Number(e.target.value))}
                />
            </div>

            <div className="space-y-2">
                <div className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Mode</div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => setMode("preset")}
                        className={
                            "rounded-xl px-3 py-2 text-sm border transition " +
                            (mode === "preset"
                                ? "border-black/20 bg-zinc-900 text-white hover:brightness-95 active:brightness-90 dark:border-white/20 dark:bg-white dark:text-zinc-900"
                                : "border-black/10 bg-white text-zinc-900 hover:bg-zinc-50 active:bg-zinc-100 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-white/5")
                        }
                    >
                        Preset
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("custom")}
                        className={
                            "rounded-xl px-3 py-2 text-sm border transition " +
                            (mode === "custom"
                                ? "border-black/20 bg-zinc-900 text-white hover:brightness-95 active:brightness-90 dark:border-white/20 dark:bg-white dark:text-zinc-900"
                                : "border-black/10 bg-white text-zinc-900 hover:bg-zinc-50 active:bg-zinc-100 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-white/5")
                        }
                    >
                        Custom
                    </button>
                </div>
            </div>

            {mode === "preset" ? (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Preset</label>
                    <select
                        className={inputClass}
                        value={presetId}
                        onChange={(e) => setPresetId(e.target.value)}
                    >
                        {PRESETS.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.label}
                            </option>
                        ))}
                    </select>
                </div>
            ) : (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                        Custom ratio (1 : X)
                    </label>
                    <input
                        className={inputClass}
                        type="number"
                        min={10}
                        max={200}
                        step={1}
                        value={customX}
                        onChange={(e) => setCustomX(Number(e.target.value))}
                    />
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">Example: 50 means 1:50.</div>
                </div>
            )}

            <div className="rounded-2xl border border-black/10 bg-zinc-50 p-4 dark:border-white/10 dark:bg-white/[0.06]">
                <div className="text-sm text-zinc-600 dark:text-zinc-300">
                    Selected ratio:{" "}
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">1:{x}</span>
                </div>

                {error ? (
                    <div className="mt-2 text-sm text-red-600">{error}</div>
                ) : (
                    <div className="mt-2 flex items-center justify-between gap-4">
                        <div className="text-lg">
                            Oil needed: <span className="font-semibold">{rounded} ml</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-xs text-zinc-600 dark:text-zinc-400">
                                {oilMl?.toFixed(1)} ml exact
                            </div>
                            <button
                                type="button"
                                onClick={copy}
                                disabled={rounded === null}
                                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm hover:bg-zinc-50 active:bg-zinc-100 disabled:opacity-50 dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-white/5 dark:active:bg-white/10"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
