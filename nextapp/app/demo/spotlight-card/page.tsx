import { GlowCard } from "@/components/ui/spotlight-card";

export default function DemoSpotlightCard() {
  return (
    <div className="w-screen h-screen flex flex-row items-center justify-center gap-10 bg-black">
      <GlowCard glowColor="blue">
        <div className="flex h-full flex-col items-center justify-center text-white/80">
          <span className="text-sm uppercase tracking-widest text-blue-300">Blue</span>
          <p className="mt-2 text-xs text-white/50">Bouge la souris ici</p>
        </div>
      </GlowCard>
      <GlowCard glowColor="purple">
        <div className="flex h-full flex-col items-center justify-center text-white/80">
          <span className="text-sm uppercase tracking-widest text-purple-300">Purple</span>
          <p className="mt-2 text-xs text-white/50">Bouge la souris ici</p>
        </div>
      </GlowCard>
      <GlowCard glowColor="green">
        <div className="flex h-full flex-col items-center justify-center text-white/80">
          <span className="text-sm uppercase tracking-widest text-green-300">Green</span>
          <p className="mt-2 text-xs text-white/50">Bouge la souris ici</p>
        </div>
      </GlowCard>
    </div>
  );
}
