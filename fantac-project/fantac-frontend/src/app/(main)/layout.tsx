import BottomNav from "@/components/layout/BottomNav";
import Sidebar from "@/components/layout/Sidebar";
import MiniPlayer from "@/components/player/MiniPlayer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0B0B0B] md:flex md:items-start">
      {/* Sidebar is sticky — a real flex child so content fills the remaining column */}
      <Sidebar />

      {/* Content column — naturally starts right after the sidebar */}
      <div className="flex-1 min-w-0">
        <main className="pb-24 md:pb-6">
          {children}
        </main>
      </div>

      <MiniPlayer />
      <BottomNav />
    </div>
  );
}
