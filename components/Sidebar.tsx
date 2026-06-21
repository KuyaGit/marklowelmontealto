"use client";

import { usePathname } from "next/navigation";
import { nav } from "@/data/nav";
import { NavButton } from "@/components/NavButton";
import {
  UserIcon,
  BriefcaseIcon,
  CodeIcon,
  AwardIcon,
  BookIcon,
  MailIcon,
} from "@/components/icons";

// Map route → icon component (keeps data/nav.ts as plain data, no component imports)
const iconMap: Record<string, React.ReactNode> = {
  "/about": <UserIcon size={22} />,
  "/works": <BriefcaseIcon size={22} />,
  "/projects": <CodeIcon size={22} />,
  "/certificate": <AwardIcon size={22} />,
  "/blog": <BookIcon size={22} />,
  "/contact": <MailIcon size={22} />,
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="flex flex-col items-center gap-4 pt-2"
    >
      {nav.map(({ href, label }) => {
        const isActive =
          pathname === href || pathname.startsWith(href + "/");
        return (
          <NavButton key={href} href={href} label={label} isActive={isActive}>
            {iconMap[href]}
          </NavButton>
        );
      })}
    </nav>
  );
}
