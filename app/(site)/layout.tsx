import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 gap-4 sm:gap-6 overflow-hidden">
      <Header />

      <div className="flex gap-4 sm:gap-6 flex-1 min-h-0">
        <Sidebar />

        {/* Main content panel — the only scrollable region */}
        <main className="flex-1 min-w-0 rounded-2xl bg-surface border border-border overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
