"use client";

import { usePathname } from "next/navigation";

export default function LanguageSwitch() {
  const pathname = usePathname(); // e.g. /en or /en/...
  const parts = pathname.split("/");
  const locale = parts[1] || "en";

  function hrefFor(nextLocale: string) {
    const rest = parts.slice(2).join("/");
    return `/${nextLocale}/${rest}`.replace(/\/$/, "");
  }

  return (
    <div className="flex items-center gap-2">
      {(["en", "de"] as const).map((l) => (
        <a
          key={l}
          href={hrefFor(l)}
          className={
            "rounded-full border px-3 py-1 text-xs transition " +
            (locale === l
              ? "border-black/20 bg-zinc-900 text-white dark:border-white/20 dark:bg-white dark:text-zinc-900"
              : "border-black/10 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-white/5")
          }
        >
          {l.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
