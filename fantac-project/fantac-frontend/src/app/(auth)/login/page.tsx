"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Music2, Users } from "lucide-react";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import OAuthButtons from "@/components/auth/OAuthButtons";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"fan" | "artist">("fan");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else if (result?.ok) {
        // Redirect based on selected role — artist goes to feed too for now
        router.replace("/feed");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isArtist = role === "artist";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 py-8"
    >
      <div className="text-center">
        <Logo className="justify-center mb-6" />
        <h1 className="text-2xl font-black">Welcome back</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Log in to your FantaC account</p>
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
          <span className={`font-bold text-sm ${role === "fan" ? "text-[#FF6A00]" : "text-[#9CA3AF]"}`}>Fan</span>
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
            <Music2 size={20} className="text-white" />
          </div>
          <span className={`font-bold text-sm ${role === "artist" ? "text-[#7B61FF]" : "text-[#9CA3AF]"}`}>Artist</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          placeholder="Your password"
          icon={<Lock size={18} />}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          autoComplete="current-password"
        />

        <div className="text-right">
          <Link href="/forgot-password" className="text-sm text-[#FF6A00] hover:underline">
            Forgot password?
          </Link>
        </div>

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
          Log in as {isArtist ? "Artist" : "Fan"}
        </Button>
      </form>

      <OAuthButtons callbackUrl="/feed" />

      <p className="text-center text-sm text-[#9CA3AF]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-[#FF6A00] font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </motion.div>
  );
}
