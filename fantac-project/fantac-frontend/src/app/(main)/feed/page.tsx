"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import PostCard from "@/components/feed/PostCard";
import Avatar from "@/components/ui/Avatar";
import { useSession } from "next-auth/react";
import { Post } from "@/types";

const TABS = ["For You", "Following", "Camps", "Trending"];

// Mock data for demo
const MOCK_POSTS: Post[] = [
  {
    _id: "1",
    userId: "u1",
    user: { _id: "u1", username: "BurnaBoyOfficial", email: "", avatar: undefined, country: "NG", points: 0, level: 10, streak: 30, followers: 15400000, following: 100, campsJoined: [], isArtist: true, verified: true, createdAt: "" },
    type: "music",
    content: "New track just dropped! 🔥 This one is for the real fans only",
    campTag: "African Giant Camp",
    likes: 24800,
    comments: 1240,
    isLiked: false,
    track: { _id: "t1", title: "Closer", artistId: "u1", artist: { _id: "u1", username: "Burna Boy", email: "", points: 0, level: 10, streak: 0, followers: 15400000, following: 0, campsJoined: [], isArtist: true, verified: true, createdAt: "", campers: 320000, genres: [] }, coverArt: "", audioUrl: "", duration: 212, plays: 1200000, likes: 45000 },
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    _id: "2",
    userId: "u2",
    user: { _id: "u2", username: "AyraStarr", email: "", avatar: undefined, country: "NG", points: 0, level: 8, streak: 15, followers: 2800000, following: 200, campsJoined: [], isArtist: true, verified: true, createdAt: "" },
    type: "text",
    content: "Thank you Lagos!! That show was insane 🎤❤️ You all showed love fr. See you at the next one. The celestial vibes were immaculate 🌟",
    campTag: "Celestial Camp",
    likes: 12400,
    comments: 876,
    isLiked: true,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    _id: "3",
    userId: "u3",
    user: { _id: "u3", username: "KingTee01", email: "", avatar: undefined, country: "NG", points: 98760, level: 7, streak: 7, followers: 2300, following: 320, campsJoined: ["camp1"], isArtist: false, verified: false, createdAt: "" },
    type: "text",
    content: "Burna's new album hits different at 3am no cap 🔊🌙 Who else is listening right now? The production on track 4 is absolutely fire 🔥",
    likes: 847,
    comments: 56,
    isLiked: false,
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    _id: "4",
    userId: "u4",
    user: { _id: "u4", username: "Davido", email: "", avatar: undefined, country: "NG", points: 0, level: 10, streak: 25, followers: 12000000, following: 500, campsJoined: [], isArtist: true, verified: true, createdAt: "" },
    type: "music",
    content: "Feel Good coming to your speakers 🎶 #OBO30BG",
    likes: 31200,
    comments: 2100,
    isLiked: false,
    track: { _id: "t2", title: "Feel Good", artistId: "u4", artist: { _id: "u4", username: "Davido", email: "", points: 0, level: 10, streak: 0, followers: 12000000, following: 0, campsJoined: [], isArtist: true, verified: true, createdAt: "", campers: 850000, genres: [] }, coverArt: "", audioUrl: "", duration: 198, plays: 2500000, likes: 89000 },
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      {/* TopBar — hidden on md+ since sidebar handles navigation */}
      <TopBar />

      {/* Tabs */}
      <div className="sticky top-0 md:top-0 z-30 bg-[#0B0B0B] border-b border-[#1A1A1A]">
        <div className="flex overflow-x-auto scrollbar-hide px-4 gap-1">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`whitespace-nowrap px-4 py-3 text-sm font-semibold transition-all relative ${
                activeTab === i ? "text-white" : "text-[#6B7280] hover:text-[#9CA3AF]"
              }`}
            >
              {tab}
              {activeTab === i && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6A00] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Posts — on xl screens, two-col layout with sidebar */}
      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-6 xl:items-start px-4 py-4 max-w-5xl">
        {/* Main feed */}
        <div className="space-y-3">
          <AnimatePresence>
            {MOCK_POSTS.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </AnimatePresence>
        </div>

        {/* Right sidebar — desktop only */}
        <div className="hidden xl:block space-y-4 sticky top-4">
          <div className="bg-[#141414] rounded-2xl p-4">
            <h3 className="font-bold text-sm text-[#9CA3AF] uppercase tracking-wider mb-3">Trending Camps</h3>
            {["African Giant Camp", "30BG Camp", "Starboy Camp"].map((c, i) => (
              <div key={c} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#FF6A00] font-bold text-sm">#{i + 1}</span>
                  <span className="text-sm">{c}</span>
                </div>
                <button className="text-xs text-[#FF6A00] font-semibold hover:underline">Join</button>
              </div>
            ))}
          </div>
          <div className="bg-[#141414] rounded-2xl p-4">
            <h3 className="font-bold text-sm text-[#9CA3AF] uppercase tracking-wider mb-3">Top Campers</h3>
            {["KingTee", "StarGirl", "MusicLover"].map((u, i) => (
              <div key={u} className="flex items-center gap-2 py-2">
                <span className="text-[#FF6A00] font-bold text-sm w-5">#{i + 1}</span>
                <div className="w-7 h-7 rounded-full bg-[#1A1A1A] flex items-center justify-center text-xs font-bold text-[#FF6A00]">{u[0]}</div>
                <span className="text-sm">{u}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAB — mobile only (desktop uses sidebar button) */}
      <button className="md:hidden fixed bottom-24 right-4 z-40 w-14 h-14 bg-gradient-to-r from-[#FF6A00] to-[#FF9A3C] rounded-full flex items-center justify-center shadow-lg shadow-[#FF6A00]/30 hover:scale-105 active:scale-95 transition-transform">
        <Plus size={24} className="text-white" />
      </button>
    </div>
  );
}
