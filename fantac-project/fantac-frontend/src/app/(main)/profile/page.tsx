"use client";
import { useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import CreatePostModal from "@/components/modals/CreatePostModal";
import { Settings, LogOut, Flame, Star, Grid3X3, Heart, Music, Trophy, Wallet, Camera, Plus } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { motion } from "framer-motion";

const PROFILE_TABS = [
  { icon: Grid3X3, label: "Posts" },
  { icon: Music, label: "Playlists" },
  { icon: Heart, label: "Activity" },
];

const MOCK_STATS = { posts: 48, followers: 2300, following: 320, likes: 12100, campsJoined: 2 };

const MOCK_CAMPS = [
  { id: "1", artistName: "Burna Boy", campName: "African Giant Camp", rank: 245, points: 12840 },
  { id: "2", artistName: "Davido", campName: "30BG Camp", rank: 892, points: 4310 },
];

export default function ProfilePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState(0);
  const [streak] = useState(7);
  const [level] = useState(4);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const picInputRef = useRef<HTMLInputElement>(null);

  const handlePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfilePic(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {/* Top bar — full width bg, inner aligns with content column */}
      <div className="sticky top-0 z-40 bg-[#0B0B0B]/95 backdrop-blur-md border-b border-[#1A1A1A]">
        <div className="flex items-center justify-between px-4 h-14 max-w-5xl">
          <h1 className="font-bold text-lg">Profile</h1>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#1A1A1A] transition-colors">
              <Settings size={20} className="text-[#9CA3AF]" />
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#1A1A1A] transition-colors"
            >
              <LogOut size={20} className="text-[#9CA3AF]" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop: 2-col layout; mobile: single column */}
      <div className="xl:grid xl:grid-cols-[1fr_300px] xl:gap-6 xl:items-start max-w-5xl">

        {/* ── LEFT: profile ── */}
        <div className="max-w-2xl">
          {/* Profile Header */}
          <div className="px-4 pt-6 pb-4">
            <div className="flex items-start gap-4">
              {/* Profile picture with upload overlay */}
            <div className="relative cursor-pointer group" onClick={() => picInputRef.current?.click()}>
              <Avatar src={profilePic || session?.user?.image} name={session?.user?.name || "U"} size="xl" />
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={22} className="text-white" />
              </div>
              <input ref={picInputRef} type="file" accept="image/*" className="hidden" onChange={handlePicChange} />
            </div>
              <div className="flex-1">
                <h2 className="text-xl font-black">{session?.user?.name || "Fan User"}</h2>
                <p className="text-[#9CA3AF] text-sm">@{(session?.user?.name || "fanuser").toLowerCase().replace(" ", "")}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 bg-[#FF6A00]/15 text-[#FF6A00] px-2 py-0.5 rounded-full">
                    <Flame size={12} />
                    <span className="text-xs font-semibold">{streak}d streak</span>
                  </div>
                  <div className="flex items-center gap-1 bg-[#7B61FF]/15 text-[#7B61FF] px-2 py-0.5 rounded-full">
                    <Star size={12} />
                    <span className="text-xs font-semibold">Level {level}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-5 gap-2 mt-5 text-center">
              {[
                { label: "Posts", value: MOCK_STATS.posts },
                { label: "Followers", value: formatNumber(MOCK_STATS.followers) },
                { label: "Following", value: MOCK_STATS.following },
                { label: "Likes", value: formatNumber(MOCK_STATS.likes) },
                { label: "Camps", value: MOCK_STATS.campsJoined },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-black text-base">{s.value}</p>
                  <p className="text-[#9CA3AF] text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Content Tabs */}
          <div className="border-b border-[#1A1A1A]">
            <div className="flex px-4">
              {PROFILE_TABS.map(({ icon: Icon, label }, i) => (
                <button
                  key={label}
                  onClick={() => setActiveTab(i)}
                  className={`flex-1 flex flex-col items-center py-3 gap-1 transition-all relative ${
                    activeTab === i ? "text-white" : "text-[#6B7280]"
                  }`}
                >
                  <Icon size={20} strokeWidth={activeTab === i ? 2.5 : 1.8} />
                  {activeTab === i && (
                    <motion.div layoutId="profile-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6A00]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Empty state */}
          <div className="px-4 py-12 text-center text-[#6B7280]">
            <div className="text-4xl mb-3">
              {activeTab === 0 ? "📝" : activeTab === 1 ? "🎵" : "❤️"}
            </div>
            <p className="font-semibold">Nothing here yet</p>
            <p className="text-sm mt-1">
              {activeTab === 0 ? "Share your first post" : activeTab === 1 ? "Create your first playlist" : "Start liking posts"}
            </p>
          </div>
        </div>

        {/* ── RIGHT: desktop sidebar ── */}
        <div className="hidden xl:block space-y-4 py-6 pr-4 sticky top-20">
          {/* Camps */}
          <div className="bg-[#141414] rounded-2xl p-4">
            <h3 className="text-sm font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">My Camps</h3>
            <div className="space-y-2">
              {MOCK_CAMPS.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <Avatar name={c.artistName} size="sm" />
                    <div>
                      <p className="font-semibold text-sm">{c.campName}</p>
                      <p className="text-[#9CA3AF] text-xs">Rank #{c.rank}</p>
                    </div>
                  </div>
                  <p className="font-bold text-sm text-[#FF6A00]">{formatNumber(c.points)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Wallet */}
          <div className="bg-gradient-to-r from-[#141414] to-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-[#FF6A00]/15 rounded-xl flex items-center justify-center">
                <Wallet size={18} className="text-[#FF6A00]" />
              </div>
              <div>
                <p className="text-xs text-[#9CA3AF]">Wallet Balance</p>
                <p className="font-black text-lg">₦0.00</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">Top Up</Button>
          </div>
        </div>
      </div>

      {/* Mobile FAB — new post */}
      <button
        onClick={() => setShowPostModal(true)}
        className="md:hidden fixed bottom-24 right-4 z-40 w-14 h-14 bg-gradient-to-r from-[#FF6A00] to-[#FF9A3C] rounded-full flex items-center justify-center shadow-lg shadow-[#FF6A00]/30 hover:scale-105 active:scale-95 transition-transform"
      >
        <Plus size={24} className="text-white" />
      </button>

      {showPostModal && <CreatePostModal onClose={() => setShowPostModal(false)} />}
    </div>
  );
}
