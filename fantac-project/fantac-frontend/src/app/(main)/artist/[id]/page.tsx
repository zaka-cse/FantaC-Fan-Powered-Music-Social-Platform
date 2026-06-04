"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronDown, Link2,
  Heart, MessageCircle, Share2, Play,
  MoreHorizontal, ShoppingBag, Gift, Calendar, DollarSign,
  Lock, Check
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

const ARTIST = {
  id: "davido",
  name: "Davido",
  verified: true,
  genre: "Afrobeats Artist",
  location: "Lagos, NG",
  bio: "Award-winning Afrobeats artist and songwriter. Creating timeless music and building a global family. 🌍",
  link: "linktr.ee/davido",
  socials: { instagram: true, tiktok: true, youtube: true, twitter: true },
  stats: { posts: 236, likes: 1200000, followers: 4800000, campers: 320000 },
};

const TABS = ["Posts", "Music", "Videos", "Camp Only"];

const MOCK_POSTS = [
  { id: "p1", caption: "Timeless out now! #TimelessTheAlbum", likes: 12400, comments: 1200, shares: 856, time: "3d ago", pinned: true, color: "from-orange-900 to-red-950", tall: true },
  { id: "p2", caption: "Grateful for the love always! ❤️ #30BG", likes: 8700, comments: 623, shares: 412, time: "5d ago", color: "from-slate-800 to-slate-950", tall: false },
  { id: "p3", caption: "Vibes in the studio 🎵", likes: 6300, comments: 51000, shares: 366, time: "1w ago", color: "from-zinc-800 to-zinc-950", tall: false },
  { id: "p4", caption: "Every show is a movie 🎬", likes: 9100, comments: 721, shares: 509, time: "2w ago", color: "from-amber-900 to-orange-950", tall: true },
];

const SECONDARY_ACTIONS = [
  { icon: DollarSign, label: "Support", color: "text-[#FF6A00]", bg: "bg-[#FF6A00]/10" },
  { icon: Calendar,    label: "Events",  color: "text-[#7B61FF]", bg: "bg-[#7B61FF]/10" },
  { icon: ShoppingBag, label: "Shop",    color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { icon: Gift,        label: "Giveaway",color: "text-pink-400",   bg: "bg-pink-400/10" },
];

export default function ArtistProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab]       = useState(0);
  const [isFollowing, setIsFollowing]   = useState(false);
  const [isInCamp, setIsInCamp]         = useState(false);
  const [likedPosts, setLikedPosts]     = useState<string[]>([]);

  const toggleLike = (id: string) =>
    setLikedPosts(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  return (
    <div className="min-h-screen bg-[#0B0B0B] max-w-4xl">

      {/* BANNER */}
      <div className="relative h-44 sm:h-56 md:h-60 w-full bg-gradient-to-br from-[#2d0f00] via-[#1a0800] to-[#0d0d0d]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B0B0B]/10 to-[#0B0B0B]" />
        <button onClick={() => router.back()}
          className="md:hidden absolute top-4 left-4 w-9 h-9 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center z-10">
          <ChevronLeft size={20} className="text-white" />
        </button>
        <button className="absolute top-4 right-4 w-9 h-9 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center z-10">
          <MoreHorizontal size={20} className="text-white" />
        </button>
      </div>

      {/* PROFILE BODY */}
      <div className="px-4 md:px-6">
        {/* Avatar — pulled up over banner with negative margin */}
        <div className="-mt-12 mb-3">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full ring-[3px] ring-[#FF6A00] ring-offset-2 ring-offset-[#0B0B0B] bg-gradient-to-br from-orange-700 to-orange-900 flex items-center justify-center">
            <span className="text-3xl md:text-4xl font-black text-white">D</span>
          </div>
        </div>

        {/* Name + verified + location */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-black">{ARTIST.name}</h1>
              <div className="w-5 h-5 md:w-6 md:h-6 bg-[#7B61FF] rounded-full flex items-center justify-center shrink-0">
                <Check size={12} strokeWidth={3} className="text-white" />
              </div>
            </div>
            <p className="text-[#9CA3AF] text-sm mt-0.5">{ARTIST.genre} • {ARTIST.location}</p>

            {/* Socials */}
            <div className="flex items-center gap-2 mt-2.5">
              {/* Instagram */}
              <div className="w-7 h-7 bg-[#1A1A1A] rounded-full flex items-center justify-center border border-[#2A2A2A] hover:border-[#FF6A00] transition-colors cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#9CA3AF]">
                  <rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </div>
              {/* TikTok */}
              <div className="w-7 h-7 bg-[#1A1A1A] rounded-full flex items-center justify-center border border-[#2A2A2A] hover:border-[#FF6A00] transition-colors cursor-pointer">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-[#9CA3AF]">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.24 8.24 0 004.83 1.56V6.81a4.85 4.85 0 01-1.06-.12z"/>
                </svg>
              </div>
              {/* YouTube */}
              <div className="w-7 h-7 bg-[#1A1A1A] rounded-full flex items-center justify-center border border-[#2A2A2A] hover:border-[#FF6A00] transition-colors cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#9CA3AF]">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
                </svg>
              </div>
              {/* X / Twitter */}
              <div className="w-7 h-7 bg-[#1A1A1A] rounded-full flex items-center justify-center border border-[#2A2A2A] hover:border-[#FF6A00] transition-colors cursor-pointer">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-[#9CA3AF]">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {[
            { label: "Posts",     value: ARTIST.stats.posts },
            { label: "Likes",     value: formatNumber(ARTIST.stats.likes) },
            { label: "Followers", value: formatNumber(ARTIST.stats.followers) },
            { label: "Campers",   value: formatNumber(ARTIST.stats.campers) },
          ].map((s) => (
            <div key={s.label} className="bg-[#141414] rounded-2xl py-3 px-1 text-center hover:bg-[#1A1A1A] transition-colors cursor-default">
              <p className="font-black text-base md:text-lg">{s.value}</p>
              <p className="text-[#9CA3AF] text-[10px] md:text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Bio + link */}
        <div className="mt-4 space-y-1.5">
          <p className="text-sm md:text-base leading-relaxed text-[#E5E7EB] max-w-lg">{ARTIST.bio}</p>
          <div className="flex items-center gap-1.5 text-[#FF6A00]">
            <Link2 size={13} />
            <span className="text-sm hover:underline cursor-pointer">{ARTIST.link}</span>
          </div>
        </div>

        {/* ── CTA BUTTONS ── */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <button onClick={() => setIsFollowing(!isFollowing)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              isFollowing
                ? "bg-[#7B61FF]/20 text-[#7B61FF] border border-[#7B61FF]/40"
                : "bg-gradient-to-r from-[#7B61FF] to-[#A78BFA] text-white hover:opacity-90"
            }`}>
            {isFollowing
              ? <><Check size={15} /> Following</>
              : <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg> Follow</>}
          </button>

          <button onClick={() => setIsInCamp(!isInCamp)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              isInCamp
                ? "bg-[#FF6A00]/20 text-[#FF6A00] border border-[#FF6A00]/40"
                : "bg-gradient-to-r from-[#FF6A00] to-[#FF9A3C] text-white hover:opacity-90"
            }`}>
            🏕️ {isInCamp ? "In Camp" : "Join Camp"}
          </button>

          <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[#2A2A2A] text-white text-sm font-bold hover:border-[#444] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            Message
          </button>

          <button className="w-10 h-10 rounded-full border border-[#2A2A2A] flex items-center justify-center hover:border-[#444] transition-colors shrink-0">
            <ChevronDown size={18} className="text-[#9CA3AF]" />
          </button>
        </div>

        {/* ── SECONDARY ACTIONS ── */}
        <div className="flex items-center justify-around mt-4 py-3 bg-[#141414] rounded-2xl max-w-sm md:max-w-md">
          {SECONDARY_ACTIONS.map(({ icon: Icon, label, color, bg }) => (
            <button key={label} className="flex flex-col items-center gap-1.5 hover:opacity-80 transition-opacity">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon size={18} className={color} />
              </div>
              <span className="text-xs text-[#9CA3AF]">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="sticky top-0 z-30 bg-[#0B0B0B] mt-4 border-b border-[#1A1A1A]">
        <div className="flex px-4 md:px-6 overflow-x-auto scrollbar-hide">
          {TABS.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-3 text-sm font-semibold transition-all relative ${
                activeTab === i ? "text-white" : "text-[#6B7280] hover:text-[#9CA3AF]"
              }`}>
              {tab}
              {tab === "Camp Only" && <Lock size={12} className="text-[#6B7280]" />}
              {activeTab === i && (
                <motion.div layoutId="artist-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6A00] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <AnimatePresence mode="wait">

        {/* Posts */}
        {activeTab === 0 && (
          <motion.div key="posts" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="px-3 md:px-6 py-3 pb-28">
            {/* 2-col on mobile, 3-col on lg+ */}
            <div className="columns-2 lg:columns-3 xl:columns-4 gap-3">
              {MOCK_POSTS.map((post, i) => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }} className="break-inside-avoid mb-3">
                  <div className="bg-[#141414] rounded-2xl overflow-hidden hover:bg-[#1A1A1A] transition-colors">
                    {/* Post header */}
                    <div className="flex items-center justify-between px-3 pt-3 pb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-black text-white">D</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold truncate">Davido</span>
                            <div className="w-3 h-3 bg-[#7B61FF] rounded-full flex items-center justify-center shrink-0">
                              <Check size={7} strokeWidth={3} className="text-white" />
                            </div>
                          </div>
                          <span className="text-[10px] text-[#6B7280]">{post.time}</span>
                        </div>
                      </div>
                      {post.pinned && (
                        <span className="text-[9px] bg-[#FF6A00]/20 text-[#FF6A00] px-1.5 py-0.5 rounded-full font-bold shrink-0">📌</span>
                      )}
                    </div>

                    {/* Image */}
                    <div className={`w-full bg-gradient-to-br ${post.color} flex items-center justify-center`}
                      style={{ height: post.tall ? "150px" : "110px" }}>
                      <Play size={26} className="text-white/50" />
                    </div>

                    {/* Caption */}
                    <div className="px-3 pt-2 pb-1">
                      <p className="text-xs text-[#E5E7EB] leading-relaxed line-clamp-2">{post.caption}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between px-3 pb-3 pt-1">
                      <button onClick={() => toggleLike(post.id)} className="flex items-center gap-1">
                        <Heart size={13} className={likedPosts.includes(post.id) ? "fill-red-500 text-red-500" : "text-[#9CA3AF]"} />
                        <span className="text-[10px] text-[#9CA3AF]">{formatNumber(post.likes + (likedPosts.includes(post.id) ? 1 : 0))}</span>
                      </button>
                      <button className="flex items-center gap-1">
                        <MessageCircle size={13} className="text-[#9CA3AF]" />
                        <span className="text-[10px] text-[#9CA3AF]">{formatNumber(post.comments)}</span>
                      </button>
                      <button className="flex items-center gap-1">
                        <Share2 size={13} className="text-[#9CA3AF]" />
                        <span className="text-[10px] text-[#9CA3AF]">{formatNumber(post.shares)}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Camp Only locked */}
        {activeTab === 3 && (
          <motion.div key="camponly" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="px-4 py-16 text-center">
            <div className="w-16 h-16 bg-[#141414] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock size={28} className="text-[#6B7280]" />
            </div>
            <h3 className="font-bold text-lg mb-1">Camp Only Content</h3>
            <p className="text-[#9CA3AF] text-sm max-w-xs mx-auto">
              Join this camp to unlock exclusive content, updates and rewards.
            </p>
            <button onClick={() => { setIsInCamp(true); setActiveTab(0); }}
              className="mt-5 px-8 py-3 bg-gradient-to-r from-[#FF6A00] to-[#FF9A3C] rounded-full font-bold text-sm">
              🏕️ Join Camp
            </button>
          </motion.div>
        )}

        {/* Music / Videos empty */}
        {(activeTab === 1 || activeTab === 2) && (
          <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="px-4 py-12 text-center text-[#6B7280]">
            <div className="text-4xl mb-3">{activeTab === 1 ? "🎵" : "🎬"}</div>
            <p className="font-semibold">{activeTab === 1 ? "No music yet" : "No videos yet"}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
