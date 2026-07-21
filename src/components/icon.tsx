import {
  Atom,
  Sun,
  Cpu,
  FlaskConical,
  Zap,
  Leaf,
  Beaker,
  Microscope,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  atom: Atom,
  sun: Sun,
  cpu: Cpu,
  "flask-conical": FlaskConical,
  zap: Zap,
  leaf: Leaf,
  beaker: Beaker,
  microscope: Microscope,
  sparkles: Sparkles,
};

export function DynamicIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = map[name] ?? Atom;
  return <Icon className={className} />;
}
