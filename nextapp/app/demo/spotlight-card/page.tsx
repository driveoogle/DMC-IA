import { GlowCard } from "@/components/ui/spotlight-card";

export default function DemoSpotlightCard() {
  return (
    <div className="w-screen h-screen flex flex-row items-center justify-center gap-10 bg-black">
      <GlowCard glowColor="blue" />
      <GlowCard glowColor="purple" />
      <GlowCard glowColor="green" />
    </div>
  );
}
