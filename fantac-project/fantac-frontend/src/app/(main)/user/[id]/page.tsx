"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Grid3X3, Heart, Music, UserPlus, Check, Flame, Star } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { formatNumber } from "@/lib/utils";
import { motion } from "framer-motion";

const MOCK_USER = {
  username: "KingTee01",
  level: 7,
  streak: 7,
  followers: 2300,
  following: 320,
  posts: 48,
  likes: 12100,
  camps: ["African Giant Camp", "30BG Camp"],
  bio: "Music is life 🎵 | Afrobeats lover | 30BG forever",
};

const TABS = [
  { icon: Grid3X3, label: "Posts" },
  { icon: Music, label: "Playlists" },
  { icon: Heart, label: "Liked" },
];

export default function UserProfilePage() {
  const router = useRouter();
  const [followed, setFollowed] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen bg-[#0B0B0B] max-w-2xl">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-[#0B0B0B]/95 backdrop-blur-md border-b border-[#1A1A1A] flex items-center px-4 h-14 gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#1A1A1A] transition-colors"
        >
          <ChevronLeft size={22} />
        </button>
        <h1 className="font-bold text-base">{MOCK_USER.username}</h1>
      </div>

      {/* Profile header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-start gap-4">
          <Avatar name={MOCK_USER.username} size="xl" />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black">{MOCK_USER.username}</h2>
            <p className="text-[#9CA3AF] text-sm">@{MOCK_USER.username.toLowerCase()}</p>

            {/* Badges */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <div className="flex items-center gap-1 bg-[#FF6A00]/15 text-[#FF6A00] px-2 py-0.5 rounded-full">
                <Flame size={11} />
                <span className="text-xs font-semibold">{MOCK_USER.streak}d streak</span>
              </div>
              <div className="flex items-center gap-1 bg-[#7B61FF]/15 text-[#7B61FF] px-2 py-0.5 rounded-full">
                <Star size={11} />
                <span className="text-xs font-semibold">Level {MOCK_USER.level}</span>
              </div>
            </div>
          </div>

          {/* Follow button */}
          <motion.button
            onClick={() => setFollowed(!followed)}
            whileTap={{ scale: 0.94 }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all shrink-0 ${
              followed
                ? "bg-[#2A2A2A] text-[#9CA3AF]"
                : "bg-gradient-to-r from-[#7B61FF] to-[#A78BFA] text-white hover:opacity-90"
            }`}
          >
            {followed ? <Check size={14} /> : <UserPlus size={14} />}
            {followed ? "Following" : "Follow"}
          </motion.button>
        </div>

        {/* Bio */}
        {MOCK_USER.bio && (
          <p className="text-sm text-[#E5E7EB] mt-4 leading-relaxed">{MOCK_USER.bio}</p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mt-4 text-center">
          {[
            { label: "Posts", value: MOCK_USER.posts },
            { label: "Followers", value: formatNumber(MOCK_USER.followers) },
            { label: "Following", value: MOCK_USER.following },
            { label: "Likes", value: formatNumber(MOCK_USER.likes) },
          ].map((s) => (
            <div key={s.label} className="bg-[#141414] rounded-2xl py-3">
              <p className="font-black text-base">{s.value}</p>
              <p className="text-[#9CA3AF] text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Camps */}
        <div className="mt-4">
          <p className="text-xs text-[#9CA3AF] font-semibold uppercase tracking-wider mb-2">Camps</p>
          <div className="flex flex-wrap gap-2">
            {MOCK_USER.camps.map((c) => (
              <span key={c} className="text-xs bg-[#FF6A00]/10 text-[#FF6A00] px-3 py-1 rounded-full font-semibold">
                🏕️ {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#1A1A1A]">
        <div className="flex px-4">
          {TABS.map(({ icon: Icon, label }, i) => (
            <button
              key={label}
              onClick={() => setActiveTab(i)}
              className={`flex-1 flex flex-col items-center py-3 gap-1 relative transition-colors ${
                activeTab === i ? "text-white" : "text-[#6B7280]"
              }`}
            >
              <Icon size={20} strokeWidth={activeTab === i ? 2.5 : 1.8} />
              {activeTab === i && (
                <motion.div layoutId="user-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6A00]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      <div className="px-4 py-16 text-center text-[#6B7280]">
        <div className="text-4xl mb-3">
          {activeTab === 0 ? "📝" : activeTab === 1 ? "🎵" : "❤️"}
        </div>
        <p className="font-semibold">Nothing here yet</p>
      </div>
    </div>
  );
}
