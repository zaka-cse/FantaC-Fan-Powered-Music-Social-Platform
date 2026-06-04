"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Logo from "@/components/ui/Logo";
import { ChevronRight, Check, Bell, Music } from "lucide-react";

const GENRES = ["Afrobeats", "Hip Hop", "Amapiano", "R&B", "Pop", "Drill", "EDM", "Afrohouse", "Dancehall", "Rock", "Alternative", "Latin"];
const ARTISTS = [
  { id: "1", name: "Burna Boy", image: null, followers: "15.4M" },
  { id: "2", name: "Ayra Starr", image: null, followers: "2.8M" },
  { id: "3", name: "Rema", image: null, followers: "9.5M" },
  { id: "4", name: "Asake", image: null, followers: "3.1M" },
  { id: "5", name: "Davido", image: null, followers: "12M" },
  { id: "6", name: "Wizkid", image: null, followers: "14M" },
];
const CAMPS = [
  { id: "1", artistName: "Burna Boy", campName: "African Giant Camp", country: "Nigeria", members: "320K" },
  { id: "2", artistName: "Ayra Starr", campName: "Celestial Camp", members: "88K" },
  { id: "3", artistName: "Rema", campName: "Raven Camp", members: "216K" },
  { id: "4", artistName: "Asake", campName: "YBNL Nation", members: "85K" },
];

const STEPS = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(0);
  const [genres, setGenres] = useState<string[]>([]);
  const [artists, setFollowing] = useState<string[]>([]);
  const [camp, setCamp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleGenre = (g: string) =>
    setGenres((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);

  const toggleArtist = (id: string) =>
    setFollowing((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const finish = async () => {
    setLoading(true);
    // Save preferences to backend
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ genres, following: artists, campId: camp }),
      });
    } catch {}
    router.replace("/feed");
  };

  const stepContent = [
    // Step 0: Genre Selection
    <div key="genres" className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-3">🎵</div>
        <h2 className="text-2xl font-black">Pick your genres</h2>
        <p className="text-[#9CA3AF] text-sm mt-1">Choose at least 3 you enjoy</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => toggleGenre(g)}
            className={`py-3 px-2 rounded-2xl text-sm font-semibold transition-all duration-200 border ${
              genres.includes(g)
                ? "bg-[#FF6A00] border-[#FF6A00] text-white"
                : "bg-[#141414] border-[#2A2A2A] text-[#9CA3AF] hover:border-[#444]"
            }`}
          >
            {g}
          </button>
        ))}
      </div>
      <Button fullWidth size="lg" onClick={() => setStep(1)} disabled={genres.length < 3}>
        Continue → ({genres.length}/3 min)
      </Button>
    </div>,

    // Step 1: Follow Artists
    <div key="artists" className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-3">⭐</div>
        <h2 className="text-2xl font-black">Follow artists</h2>
        <p className="text-[#9CA3AF] text-sm mt-1">Follow at least 3 to personalize your feed</p>
      </div>
      <div className="space-y-3">
        {ARTISTS.map((a) => (
          <div key={a.id} className="flex items-center justify-between bg-[#141414] rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <Avatar name={a.name} size="md" />
              <div>
                <p className="font-semibold text-sm">{a.name}</p>
                <p className="text-[#9CA3AF] text-xs">{a.followers} followers</p>
              </div>
            </div>
            <button
              onClick={() => toggleArtist(a.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                artists.includes(a.id)
                  ? "bg-[#FF6A00] text-white"
                  : "border border-[#333] text-white hover:border-[#FF6A00]"
              }`}
            >
              {artists.includes(a.id) ? "Following" : "Follow"}
            </button>
          </div>
        ))}
      </div>
      <Button fullWidth size="lg" onClick={() => setStep(2)} disabled={artists.length < 3}>
        Continue → ({artists.length}/3 min)
      </Button>
    </div>,

    // Step 2: Join Camp
    <div key="camp" className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-3">🏕️</div>
        <h2 className="text-2xl font-black">Join an artist camp</h2>
        <p className="text-[#9CA3AF] text-sm mt-1">Be a true fan — 1 camp per country</p>
      </div>
      <div className="space-y-3">
        {CAMPS.map((c) => (
          <button
            key={c.id}
            onClick={() => setCamp(camp === c.id ? null : c.id)}
            className={`w-full flex items-center justify-between bg-[#141414] rounded-2xl p-4 transition-all border ${
              camp === c.id ? "border-[#FF6A00]" : "border-[#2A2A2A] hover:border-[#333]"
            }`}
          >
            <div className="flex items-center gap-3">
              <Avatar name={c.artistName} size="md" />
              <div className="text-left">
                <p className="font-semibold text-sm">{c.campName}</p>
                <p className="text-[#9CA3AF] text-xs">{c.members} members</p>
              </div>
            </div>
            <span className={`text-sm font-semibold px-4 py-2 rounded-full ${
              camp === c.id ? "bg-[#FF6A00] text-white" : "border border-[#333] text-white"
            }`}>
              {camp === c.id ? "Joined ✓" : "Join"}
            </span>
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <Button variant="outline" size="lg" fullWidth onClick={() => setStep(3)}>Skip</Button>
        <Button size="lg" fullWidth onClick={() => setStep(3)} disabled={!camp}>Continue →</Button>
      </div>
    </div>,

    // Step 3: Notifications
    <div key="notifications" className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-3">🔔</div>
        <h2 className="text-2xl font-black">Stay in the loop</h2>
        <p className="text-[#9CA3AF] text-sm mt-1">Never miss updates from your artists and camps</p>
      </div>
      <div className="space-y-3">
        {[
          { icon: "🏕️", title: "Camp updates", desc: "News and announcements" },
          { icon: "🎤", title: "Events & live shows", desc: "Get notified about events" },
          { icon: "🏆", title: "Competitions", desc: "Be first to know" },
          { icon: "🎁", title: "Rewards & exclusives", desc: "Special drops and offers" },
        ].map((n) => (
          <div key={n.title} className="flex items-center justify-between bg-[#141414] rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{n.icon}</span>
              <div>
                <p className="font-semibold text-sm">{n.title}</p>
                <p className="text-[#9CA3AF] text-xs">{n.desc}</p>
              </div>
            </div>
            <div className="w-12 h-6 bg-[#FF6A00] rounded-full flex items-center justify-end pr-1">
              <div className="w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
        ))}
      </div>
      <Button fullWidth size="lg" onClick={() => setStep(4)}>
        Enable Notifications →
      </Button>
      <button onClick={() => setStep(4)} className="w-full text-center text-sm text-[#6B7280] hover:text-white transition-colors">
        Maybe Later
      </button>
    </div>,

    // Step 4: Success
    <div key="success" className="space-y-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="w-24 h-24 bg-[#FF6A00] rounded-full flex items-center justify-center mx-auto"
      >
        <Check size={48} className="text-white" strokeWidth={3} />
      </motion.div>
      <div>
        <h2 className="text-3xl font-black">You&apos;re in!</h2>
        <p className="text-[#9CA3AF] mt-2 text-base">You are now part of FantaC.</p>
        <p className="text-[#9CA3AF] text-sm mt-1">Welcome, {session?.user?.name || "fan"} 🎉</p>
      </div>
      <div className="bg-[#141414] rounded-2xl p-5 text-left space-y-3">
        <p className="text-sm font-semibold text-[#9CA3AF]">You&apos;re set up with:</p>
        <div className="space-y-2">
          {genres.slice(0, 3).map(g => (
            <div key={g} className="flex items-center gap-2 text-sm">
              <Check size={14} className="text-[#FF6A00]" />
              <span>{g} music</span>
            </div>
          ))}
          <div className="flex items-center gap-2 text-sm">
            <Check size={14} className="text-[#FF6A00]" />
            <span>Following {artists.length} artists</span>
          </div>
          {camp && (
            <div className="flex items-center gap-2 text-sm">
              <Check size={14} className="text-[#FF6A00]" />
              <span>Joined a fan camp</span>
            </div>
          )}
        </div>
      </div>
      <Button fullWidth size="lg" loading={loading} onClick={finish}>
        Enter FantaC →
      </Button>
    </div>,
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col">
      {/* Progress */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-3">
          <Logo size="sm" />
          <span className="text-xs text-[#6B7280]">Step {step + 1} of {STEPS}</span>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= step ? "bg-[#FF6A00]" : "bg-[#2A2A2A]"}`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {stepContent[step]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
