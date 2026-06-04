"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Music2, Users, Mic2 } from "lucide-react";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import OAuthButtons from "@/components/auth/OAuthButtons";
import Link from "next/link";
import { signIn } from "next-auth/react";

const GENRES = ["Afrobeats", "Afropop", "Highlife", "Amapiano", "Hip-Hop", "R&B", "Gospel", "Dancehall", "Trap"];
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<"fan" | "artist">("fan");
  const [form, setForm] = useState({ username: "", email: "", password: "", genre: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isArtist = role === "artist";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (isArtist && !form.genre) {
      setError("Please select your primary genre");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          isArtist,
          genre: form.genre,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Signup failed. Please try again.");
        return;
      }
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (result?.ok) {
        router.replace(isArtist ? "/onboarding?role=artist" : "/onboarding");
      } else {
        router.replace("/login");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 py-6"
    >
      <div className="text-center">
        <Logo className="justify-center mb-6" />
        <h1 className="text-2xl font-black">Create your account</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Join the fan revolution</p>
      </div>

      {/* Role toggle */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setRole("fan")}
          className={`flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all ${
            role === "fan"
              ? "border-[#FF6A00] bg-[#FF6A00]/10"
              : "border-[#2A2A2A] bg-[#141414] hover:border-[#3A3A3A]"
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === "fan" ? "bg-[#FF6A00]" : "bg-[#2A2A2A]"}`}>
            <Users size={20} className="text-white" />
          </div>
          <div className="text-center">
            <p className={`font-bold text-sm ${role === "fan" ? "text-[#FF6A00]" : "text-[#9CA3AF]"}`}>Fan</p>
            <p className="text-[#6B7280] text-[10px] mt-0.5">Support your faves</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setRole("artist")}
          className={`flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all ${
            role === "artist"
              ? "border-[#7B61FF] bg-[#7B61FF]/10"
              : "border-[#2A2A2A] bg-[#141414] hover:border-[#3A3A3A]"
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === "artist" ? "bg-[#7B61FF]" : "bg-[#2A2A2A]"}`}>
            <Mic2 size={20} className="text-white" />
          </div>
          <div className="text-center">
            <p className={`font-bold text-sm ${role === "artist" ? "text-[#7B61FF]" : "text-[#9CA3AF]"}`}>Artist</p>
            <p className="text-[#6B7280] text-[10px] mt-0.5">Grow your fanbase</p>
          </div>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={isArtist ? "Stage Name" : "Username"}
          placeholder={isArtist ? "Your artist name" : "@yourname"}
          icon={isArtist ? <Music2 size={18} /> : <User size={18} />}
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
          autoComplete="username"
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={<Mail size={18} />}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          placeholder="Min. 8 characters"
          icon={<Lock size={18} />}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          autoComplete="new-password"
        />

        {/* Genre selector — artist only */}
        <AnimatePresence>
          {isArtist && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <p className="text-sm font-semibold text-[#9CA3AF] mb-2">Primary Genre <span className="text-red-400">*</span></p>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setForm({ ...form, genre: g })}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      form.genre === g
                        ? "bg-[#7B61FF] text-white"
                        : "bg-[#1A1A1A] border border-[#2A2A2A] text-[#9CA3AF] hover:border-[#7B61FF]/40"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 px-4 rounded-xl">{error}</p>
        )}

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={loading}
          className={isArtist ? "bg-gradient-to-r from-[#7B61FF] to-[#A78BFA] hover:opacity-90" : ""}
        >
          {isArtist ? "Create Artist Account" : "Create Fan Account"}
        </Button>
      </form>

      <OAuthButtons callbackUrl="/onboarding" />

      <p className="text-center text-sm text-[#9CA3AF]">
        Already have an account?{" "}
        <Link href="/login" className="text-[#FF6A00] font-semibold hover:underline">
          Log in
        </Link>
      </p>

      <p className="text-center text-xs text-[#6B7280]">
        By continuing, you agree to our{" "}
        <span className="underline cursor-pointer">Terms</span> and{" "}
        <span className="underline cursor-pointer">Privacy Policy</span>
      </p>
    </motion.div>
  );
}
