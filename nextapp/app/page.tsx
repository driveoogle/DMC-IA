import CinematicThemeSwitcher from "@/components/ui/cinematic-theme-switcher";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-zinc-50 px-6 py-16 text-zinc-900 transition-colors duration-700 dark:bg-[#0b0d10] dark:text-zinc-100">
      <section className="w-full max-w-4xl rounded-3xl border border-zinc-200 bg-white/90 p-8 shadow-2xl shadow-zinc-200/60 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90 dark:shadow-black/30 md:p-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-zinc-500 dark:text-zinc-400">Mode clair / mode sombre</p>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white md:text-4xl">
              Le thème du site bascule maintenant entre les deux modes avec une animation cinématographique.
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-300">
              Le support global a été ajouté au layout principal et le composant de bascule est intégré à la page d’accueil pour tester immédiatement le thème.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 rounded-3xl border border-zinc-200 bg-zinc-100/80 p-6 dark:border-zinc-800 dark:bg-zinc-900/80 md:min-w-[220px]">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Basculer le thème</span>
            <CinematicThemeSwitcher />
          </div>
        </div>
      </section>
    </main>
  );
}
