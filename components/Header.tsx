import Image from "next/image";
import { profile } from "@/data/profile";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="rounded-2xl bg-surface border border-border p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-44 h-36 sm:w-52 sm:h-44 rounded-xl border border-border overflow-hidden relative">
            <Image
              src="/profile.JPG"
              alt="Mark Lowel Montealto — Full Stack Developer & DevOps Engineer"
              fill
              sizes="(max-width: 640px) 176px, 208px"
              className="object-cover object-top"
              priority
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col justify-between gap-3 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <p className="text-xs font-medium tracking-widest uppercase text-foreground/50">
              {profile.dateLine}
            </p>
            <ThemeToggle />
          </div>

          <div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-none text-foreground">
              {profile.name.split(" ").slice(0, 2).join(" ")}
              <br />
              {profile.name.split(" ").slice(2).join(" ")}
            </h1>
            <p className="mt-1 text-sm font-medium tracking-wider text-foreground/50 uppercase">
              {profile.role}
            </p>
          </div>

          <p className="text-sm leading-relaxed text-foreground/70 max-w-md">
            {profile.intro}
          </p>
        </div>
      </div>
    </header>
  );
}
