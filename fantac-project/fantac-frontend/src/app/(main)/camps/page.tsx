"use client";
import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { Users, ChevronRight, Flame } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { motion } from "framer-motion";

const CAMPS = [
  { id: "1", artistName: "Burna Boy", campName: "African Giant Camp", country: "Nigeria", members: 320000, isJoined: true, isOfficial: true, color: "from-[#FF6A00] to-[#FF4500]" },
  { id: "2", artistName: "Ayra Starr", campName: "Celestial Camp", country: "Nigeria", members: 88000, isJoined: false, isOfficial: true, color: "from-[#7B61FF] to-[#A78BFA]" },
  { id: "3", artistName: "Rema", campName: "Raven Camp", country: "Nigeria", members: 216000, isJoined: false, isOfficial: true, color: "from-[#00C9FF] to-[#0066FF]" },
  { id: "4", artistName: "Asake", campName: "YBNL Nation", country: "Nigeria", members: 85000, isJoined: false, isOfficial: true, color: "from-[#FF1493] to-[#FF69B4]" },
  { id: "5", artistName: "Davido", campName: "30BG Camp", country: "Nigeria", members: 850000, isJoined: false, isOfficial: true, color: "from-[#FFD700] to-[#FFA500]" },
  { id: "6", artistName: "Wizkid", campName: "Starboy Camp", country: "Nigeria", members: 1200000, isJoined: false, isOfficial: true, color: "from-[#00FF88] to-[#00CC66]" },
];

export default function CampsPage() {
  const [joined, setJoined] = useState<string[]>(["1"]);
  const [tab, setTab] = useState<"my" | "popular">("popular");

  const myCamps = CAMPS.filter(c => joined.includes(c.id));
  const allCamps = CAMPS;

  return (
    <div>
      <TopBar title="Camps" />

      <div className="px-4 py-4 max-w-5xl">
        {/* Tabs */}
        <div className="flex bg-[#141414] rounded-2xl p-1 mb-5">
          {[["popular", "Discover"], ["my", "My Camps"]].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setTab(val as any)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === val ? "bg-[#FF6A00] text-white" : "text-[#9CA3AF]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "my" && myCamps.length === 0 && (
          <div className="text-center py-12 text-[#9CA3AF]">
            <div className="text-4xl mb-3">🏕️</div>
            <p className="font-semibold">No camps yet</p>
            <p className="text-sm mt-1">Join a camp to become a true fan</p>
            <Button className="mt-4" onClick={() => setTab("popular")}>Discover Camps</Button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {(tab === "my" ? myCamps : allCamps).map((camp, i) => (
            <motion.div
              key={camp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#141414] rounded-2xl overflow-hidden"
            >
              {/* Camp Banner */}
              <div className={`h-20 bg-gradient-to-r ${camp.color} relative`}>
                {joined.includes(camp.id) && (
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <Flame size={12} className="text-[#FF6A00]" />
                    <span className="text-xs font-semibold text-white">Member</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 -mt-8">
                    <div className="w-14 h-14 rounded-xl border-2 border-[#0B0B0B] overflow-hidden bg-[#1A1A1A] flex items-center justify-center">
                      <Avatar name={camp.artistName} size="md" />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="font-bold">{camp.campName}</h3>
                  <p className="text-[#9CA3AF] text-sm">{camp.artistName} • {camp.country}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Users size={13} className="text-[#9CA3AF]" />
                    <span className="text-xs text-[#9CA3AF]">{formatNumber(camp.members)} members</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setJoined(prev => prev.includes(camp.id) ? prev.filter(x => x !== camp.id) : [...prev, camp.id])}
                    className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all ${
                      joined.includes(camp.id)
                        ? "bg-[#FF6A00]/15 text-[#FF6A00] border border-[#FF6A00]/30"
                        : "bg-[#FF6A00] text-white hover:bg-[#e55e00]"
                    }`}
                  >
                    {joined.includes(camp.id) ? "✓ Joined" : "Join Camp"}
                  </button>
                  <button className="px-4 py-2.5 rounded-full border border-[#333] text-white text-sm font-semibold hover:border-[#555] transition-colors flex items-center gap-1">
                    View <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
