"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { PRESETS } from "@/lib/presets";

type Mode = "preset" | "custom";
type ErrorCode =
  | "fuelMissing"
  | "fuelNonPositive"
  | "ratioMissing"
  | "ratioRange"
  | null;

function toNumberSafe(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

function formatMl(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(
    n
  );
}

export default function MixCalculator() {
  const t = useTranslations("calc");

  const [litersStr, setLitersStr] = useState("5");
  const liters = useMemo(() => toNumberSafe(litersStr), [litersStr]);

  const [mode, setMode] = useState<Mode>("preset");
  const [presetId, setPresetId] = useState<string>(
    PRESETS[0]?.id ?? "trabant-50"
  );
  const [customXStr, setCustomXStr] = useState("50");
  const customX = useMemo(() => toNumberSafe(customXStr), [customXStr]);

  const preset = useMemo(
    () => PRESETS.find((p) => p.id === presetId),
    [presetId]
  );

  const x = useMemo(
    () => (mode === "preset" ? preset?.x ?? 50 : customX),
    [mode, preset, customX]
  );

  const oilMl = useMemo(() => {
    if (!Number.isFinite(liters) || !Number.isFinite(x)) return null;
    if (liters <= 0 || x <= 0) return null;
    return (liters * 1000) / x;
  }, [liters, x]);

  const rounded = oilMl === null ? null : Math.round(oilMl);

  const errorCode: ErrorCode =
    !Number.isFinite(liters) || litersStr.trim() === ""
      ? "fuelMissing"
      : liters <= 0
      ? "fuelNonPositive"
      : !Number.isFinite(x) || (mode === "custom" && customXStr.trim() === "")
      ? "ratioMissing"
      : x < 10 || x > 200
      ? "ratioRange"
      : null;

  const errorText = errorCode ? t(`errors.${errorCode}`) : null;

  const copyText =
    rounded === null || errorCode
      ? ""
      : t("copyText", { liters: litersStr, x: String(x), ml: String(rounded) });

  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1400);
  }

  async function copy() {
    if (!copyText) return;
    try {
      await navigator.clipboard.writeText(copyText);
      showToast(t("toastCopied"));
    } catch {
      showToast(t("toastCopyFailed"));
    }
  }

  const inputBase =
    "w-full rounded-2xl border px-4 py-3 text-[15px] outline-none transition " +
    "border-black/10 bg-white shadow-sm shadow-black/[0.03] " +
    "focus:border-black/20 focus:ring-4 focus:ring-black/5 " +
    "dark:border-white/10 dark:bg-zinc-950 dark:shadow-none " +
    "dark:focus:border-white/20 dark:focus:ring-white/10";

  const labelClass = "text-sm font-medium text-zinc-800 dark:text-zinc-200";
  const hintClass = "text-xs text-zinc-500 dark:text-zinc-400";

  const fuelHasError =
    errorCode === "fuelMissing" || errorCode === "fuelNonPositive";
  const ratioHasError =
    errorCode === "ratioMissing" || errorCode === "ratioRange";

  return (
    <div className="relative space-y-6">
      {/* toast */}
      <div className="pointer-events-none absolute right-0 top-0 z-10">
        {toast ? (
          <div className="rounded-2xl border border-black/10 bg-white/90 px-3 py-2 text-xs text-zinc-800 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-950/80 dark:text-zinc-100">
            {toast}
          </div>
        ) : null}
      </div>

      {/* Fuel */}
      <div className="space-y-2">
        <div className="flex items-end justify-between gap-3">
          <label className={labelClass}>{t("fuelLabel")}</label>
          <div className={hintClass}>{t("fuelUnit")}</div>
        </div>

        <div className="relative">
          <input
            className={
              inputBase +
              (fuelHasError ? " border-red-500/40 focus:ring-red-500/10" : "")
            }
            inputMode="decimal"
            type="text"
            value={litersStr}
            onChange={(e) => {
              const v = e.target.value.replace(",", ".");
              if (/^[0-9]*([.][0-9]*)?$/.test(v) || v === "") setLitersStr(v);
            }}
            placeholder={t("fuelPlaceholder")}
          />
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-zinc-500 dark:text-zinc-400">
            L
          </div>
        </div>
      </div>

      {/* Mode segmented control */}
      <div className="space-y-2">
        <div className={labelClass}>{t("modeLabel")}</div>
        <div className="grid grid-cols-2 rounded-2xl border border-black/10 bg-zinc-50 p-1 dark:border-white/10 dark:bg-white/[0.06]">
          <button
            type="button"
            onClick={() => setMode("preset")}
            className={
              "rounded-xl px-3 py-2 text-sm font-medium transition " +
              (mode === "preset"
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50")
            }
          >
            {t("preset")}
          </button>
          <button
            type="button"
            onClick={() => setMode("custom")}
            className={
              "rounded-xl px-3 py-2 text-sm font-medium transition " +
              (mode === "custom"
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50")
            }
          >
            {t("custom")}
          </button>
        </div>
      </div>

      {/* Preset / Custom */}
      {mode === "preset" ? (
        <div className="space-y-2">
          <label className={labelClass}>{t("presetLabel")}</label>
          <select
            className={inputBase}
            value={presetId}
            onChange={(e) => setPresetId(e.target.value)}
          >
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>

          <div className={hintClass}>
            {preset
              ? t("presetHint", { x: String(preset.x) })
              : t("presetSelectHint")}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-end justify-between gap-3">
            <label className={labelClass}>{t("customLabel")}</label>
            <div className={hintClass}>1 : X</div>
          </div>

          <div className="relative">
            <input
              className={
                inputBase +
                (ratioHasError
                  ? " border-red-500/40 focus:ring-red-500/10"
                  : "")
              }
              inputMode="numeric"
              type="text"
              value={customXStr}
              onChange={(e) => {
                const v = e.target.value;
                if (/^[0-9]*$/.test(v) || v === "") setCustomXStr(v);
              }}
              placeholder={t("customPlaceholder")}
            />
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-zinc-500 dark:text-zinc-400">
              X
            </div>
          </div>

          <div className={hintClass}>{t("customHint")}</div>
        </div>
      )}

      {/* Result card */}
      <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/[0.06]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-gradient-to-br from-zinc-200/70 to-transparent blur-3xl dark:from-white/10" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm text-zinc-600 dark:text-zinc-300">
              {t("selectedRatio")}:{" "}
              <span className="font-medium text-zinc-900 dark:text-zinc-50">
                1:{Number.isFinite(x) ? x : "—"}
              </span>
            </div>
            <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {t("formulaHint")}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setLitersStr("5");
              setMode("preset");
              setPresetId(PRESETS[0]?.id ?? "trabant-50");
              setCustomXStr("50");
              showToast(t("toastReset"));
            }}
            className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-50 active:bg-zinc-100 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-white/5 dark:active:bg-white/10"
          >
            {t("reset")}
          </button>
        </div>

        {errorText ? (
          <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
            {errorText}
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {t("oilNeeded")}
              </div>
              <div className="mt-1 text-3xl font-semibold tracking-tight">
                {rounded === null ? "—" : `${formatMl(rounded)} ml`}
              </div>
              <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {oilMl ? t("exact", { ml: oilMl.toFixed(1) }) : ""}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={copy}
                disabled={!copyText}
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-medium hover:bg-zinc-50 active:bg-zinc-100 disabled:opacity-50 dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-white/5 dark:active:bg-white/10"
              >
                {t("copy")}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!copyText) return;
                  window.location.href = `sms:&body=${encodeURIComponent(
                    copyText
                  )}`;
                }}
                disabled={!copyText}
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-medium hover:bg-zinc-50 active:bg-zinc-100 disabled:opacity-50 dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-white/5 dark:active:bg-white/10"
              >
                {t("share")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

//Helloooooooooo
