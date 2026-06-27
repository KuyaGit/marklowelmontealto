import { GridIcon } from "@/components/icons";

interface SectionBarProps {
  title: string;
}

export function SectionBar({ title }: SectionBarProps) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
      <h1 className="text-sm font-semibold tracking-wider uppercase text-foreground/60">
        {title}
      </h1>
      <GridIcon size={18} className="text-foreground/30" />
    </div>
  );
}
