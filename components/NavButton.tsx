import Link from "next/link";

interface NavButtonProps {
  href: string;
  label: string;
  isActive: boolean;
  children: React.ReactNode;
}

export function NavButton({ href, label, isActive, children }: NavButtonProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
      className={[
        "flex h-12 w-12 items-center justify-center rounded-full border transition-colors duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        isActive
          ? "bg-foreground text-background border-foreground"
          : "bg-surface text-muted border-border hover:border-foreground/40 hover:text-foreground active:scale-95",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
