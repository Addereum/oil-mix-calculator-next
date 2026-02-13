import MixCalculator from "@/components/MixCalculator";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations();

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center p-6">
        <div className="w-full">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                {t("app.title")}
              </h1>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                {t("app.subtitle")}
              </p>
            </div>

            <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-zinc-600 backdrop-blur dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300">
              v1
            </span>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <MixCalculator />
          </div>

          <div className="mt-6 text-xs text-center text-zinc-500 dark:text-zinc-400">
            {t("footer.disclaimer")}
          </div>

          <div className="mt-8 flex justify-center">
            <a
              href="https://addereum.de"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs text-zinc-600 shadow-sm transition hover:border-black/20 hover:text-zinc-900 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-white/20 dark:hover:text-white"
            >
              <span className="opacity-70 group-hover:opacity-100 transition">
                {t("madeBy", { name: "Addereum" })}
              </span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
