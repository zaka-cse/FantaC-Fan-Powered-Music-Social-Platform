"use client";
import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import Avatar from "@/components/ui/Avatar";
import { Trophy, Crown, ChevronDown } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { motion } from "framer-motion";

const TABS = ["Daily", "Weekly", "Monthly", "All Time"];
const COUNTRIES = ["Global", "Nigeria", "Ghana", "South Africa", "UK"];

const LEADERBOARD = [
  { rank: 1, username: "KingTee", country: "Nigeria", camp: "Top Camper", points: 98760, badge: "👑" },
  { rank: 2, username: "StarGirl", country: "Nigeria", camp: "Top Camper", points: 78540, badge: "⭐" },
  { rank: 3, username: "MusicLover", country: "Nigeria", camp: "Top Camper", points: 68230, badge: "🎵" },
  { rank: 4, username: "VibesBoss", country: "Nigeria", camp: "African Giant Camp", points: 54320, badge: null },
  { rank: 5, username: "Olamide_01", country: "Nigeria", camp: "30BG Camp", points: 43780, badge: null },
  { rank: 6, username: "DavidoFanatic", country: "Nigeria", camp: "30BG Camp", points: 37640, badge: null },
  { rank: 7, username: "Blaze_01", country: "Nigeria", camp: "Raven Camp", points: 32410, badge: null },
  { rank: 8, username: "Py_Davido", country: "Nigeria", camp: "30BG Camp", points: 28905, badge: null },
  { rank: 9, username: "30BG_Forever", country: "Nigeria", camp: "30BG Camp", points: 25610, badge: null },
  { rank: 10, username: "Adc_D_Wizzy", country: "Nigeria", camp: "Starboy Camp", points: 22960, badge: null },
  { rank: 11, username: "Chi_30BG", country: "Nigeria", camp: "30BG Camp", points: 18430, badge: null },
  { rank: 12, username: "RealFan_01", country: "Nigeria", camp: "Celestial Camp", points: 15320, badge: null },
];

const TOP3_COLORS = ["bg-[#FFD700]", "bg-[#C0C0C0]", "bg-[#CD7F32]"];
const TOP3_SIZES = ["w-20 h-20", "w-16 h-16", "w-14 h-14"];
const TOP3_ORDER = [1, 0, 2]; // Silver, Gold, Bronze visually

export default function CamperboardPage() {
  const [activeTab, setActiveTab] = useState(3);
  const [country, setCountry] = useState("Nigeria");

  const top3 = LEADERBOARD.slice(0, 3);
  const rest = LEADERBOARD.slice(3);

  return (
    <div>
      <TopBar title="Camperboard" />

      <div className="xl:grid xl:grid-cols-[1fr_300px] xl:gap-6 xl:items-start max-w-5xl">
        {/* ── LEFT: filters + podium + list ── */}
        <div>
          {/* Filter Row */}
          <div className="px-4 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <button className="flex items-center gap-1.5 bg-[#141414] border border-[#2A2A2A] rounded-full px-3 py-1.5 text-sm shrink-0">
              <span>🌍 {country}</span>
              <ChevronDown size={14} className="text-[#9CA3AF]" />
            </button>
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap shrink-0 transition-all ${
                  activeTab === i ? "bg-[#FF6A00] text-white" : "bg-[#141414] text-[#9CA3AF] border border-[#2A2A2A]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Top 3 Podium */}
          <div className="px-4 py-6">
            <div className="flex items-end justify-center gap-4 mb-6">
              {TOP3_ORDER.map((idx) => {
                const entry = top3[idx];
                const visualPos = TOP3_ORDER.indexOf(idx);
                const heights = ["h-24", "h-32", "h-20"];
                return (
                  <motion.div
                    key={entry.rank}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: visualPos * 0.1 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <span className="text-lg">{entry.badge || `#${entry.rank}`}</span>
                    <Avatar name={entry.username} size={idx === 0 ? "lg" : "md"} className={`ring-2 ${TOP3_COLORS[entry.rank - 1]} ring-offset-2 ring-offset-[#0B0B0B]`} />
                    <p className="font-bold text-xs text-center max-w-[60px] truncate">{entry.username}</p>
                    <p className="text-[#FF6A00] text-xs font-bold">{formatNumber(entry.points)}</p>
                    <div className={`${heights[idx]} w-16 rounded-t-xl ${TOP3_COLORS[entry.rank - 1]} opacity-20 flex items-center justify-center`}>
                      <span className="text-2xl font-black text-white opacity-100">#{entry.rank}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Leaderboard list */}
          <div className="px-4 space-y-2 pb-6">
            <div className="flex items-center justify-between text-xs text-[#6B7280] font-semibold uppercase tracking-wider px-3 mb-3">
              <span>Rank / Camper</span>
              <span>Points</span>
            </div>
            {rest.map((entry, i) => (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 bg-[#141414] rounded-2xl p-3"
              >
                <span className="w-8 text-center text-sm font-bold text-[#9CA3AF]">#{entry.rank}</span>
                <Avatar name={entry.username} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{entry.username}</p>
                  <p className="text-xs text-[#9CA3AF] truncate">{entry.camp}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-[#FF6A00]">{formatNumber(entry.points)}</p>
                  <p className="text-xs text-[#6B7280]">pts</p>
                </div>
              </motion.div>
            ))}
            <button className="w-full mt-4 py-3 border border-[#2A2A2A] rounded-2xl text-[#9CA3AF] text-sm font-semibold hover:border-[#444] transition-colors">
              View Full Leaderboard
            </button>
          </div>
        </div>

        {/* ── RIGHT: desktop panel ── */}
        <div className="hidden xl:block px-4 xl:px-0 pr-4 space-y-4 sticky top-4 py-4">
          <div className="bg-[#141414] rounded-2xl p-4">
            <h3 className="font-bold text-sm text-[#9CA3AF] uppercase tracking-wider mb-3">My Rank</h3>
            <div className="flex items-center gap-3 py-2">
              <span className="text-[#FF6A00] font-black text-2xl">#247</span>
              <div>
                <p className="font-semibold text-sm">You</p>
                <p className="text-xs text-[#9CA3AF]">African Giant Camp</p>
              </div>
            </div>
            <div className="mt-2 bg-[#0B0B0B] rounded-xl p-3 text-center">
              <p className="text-[#FF6A00] font-black text-lg">12,840</p>
              <p className="text-xs text-[#9CA3AF]">points this week</p>
            </div>
          </div>

          <div className="bg-[#141414] rounded-2xl p-4">
            <h3 className="font-bold text-sm text-[#9CA3AF] uppercase tracking-wider mb-3">Top Camps</h3>
            {["30BG Camp", "African Giant Camp", "Starboy Camp"].map((c, i) => (
              <div key={c} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#FF6A00] font-bold text-sm">#{i + 1}</span>
                  <span className="text-sm truncate">{c}</span>
                </div>
                <Trophy size={14} className="text-[#FFD700] shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
