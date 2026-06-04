"use client";
import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Heart, Plus, Share2, Volume2, Shuffle, Repeat } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import { usePlayerStore } from "@/store/playerStore";
import { formatTime, formatNumber } from "@/lib/utils";
import { Track } from "@/types";
import Image from "next/image";
import { motion } from "framer-motion";

const MOCK_TRACKS: Track[] = [
  { _id: "t1", title: "Feel Good", artistId: "u1", artist: { _id: "u1", username: "Davido", email: "", points: 0, level: 10, streak: 0, followers: 12000000, following: 0, campsJoined: [], isArtist: true, verified: true, createdAt: "", campers: 850000, genres: [] }, coverArt: "", audioUrl: "", duration: 198, plays: 2500000, likes: 89000 },
  { _id: "t2", title: "Essence", artistId: "u2", artist: { _id: "u2", username: "Wizkid", email: "", points: 0, level: 10, streak: 0, followers: 14000000, following: 0, campsJoined: [], isArtist: true, verified: true, createdAt: "", campers: 1200000, genres: [] }, coverArt: "", audioUrl: "", duration: 214, plays: 5400000, likes: 210000 },
  { _id: "t3", title: "Peace Be Unto You", artistId: "u3", artist: { _id: "u3", username: "Rema", email: "", points: 0, level: 10, streak: 0, followers: 9500000, following: 0, campsJoined: [], isArtist: true, verified: true, createdAt: "", campers: 216000, genres: [] }, coverArt: "", audioUrl: "", duration: 187, plays: 1800000, likes: 67000 },
  { _id: "t4", title: "Higher", artistId: "u4", artist: { _id: "u4", username: "Burna Boy", email: "", points: 0, level: 10, streak: 0, followers: 15400000, following: 0, campsJoined: [], isArtist: true, verified: true, createdAt: "", campers: 320000, genres: [] }, coverArt: "", audioUrl: "", duration: 222, plays: 3100000, likes: 125000 },
  { _id: "t5", title: "Unavailable", artistId: "u5", artist: { _id: "u5", username: "Davido", email: "", points: 0, level: 10, streak: 0, followers: 12000000, following: 0, campsJoined: [], isArtist: true, verified: true, createdAt: "", campers: 850000, genres: [] }, coverArt: "", audioUrl: "", duration: 176, plays: 4200000, likes: 178000 },
];

const COLORS = ["from-[#FF6A00] to-[#FF4500]", "from-[#7B61FF] to-[#A78BFA]", "from-[#00C9FF] to-[#0066FF]", "from-[#FF1493] to-[#FF69B4]", "from-[#00FF88] to-[#00CC66]"];

export default function StreamPage() {
  const { currentTrack, isPlaying, progress, setTrack, togglePlay, nextTrack, prevTrack, setProgress } = usePlayerStore();
  const [liked, setLiked] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  const displayTrack = currentTrack || MOCK_TRACKS[0];
  const trackIndex = MOCK_TRACKS.findIndex(t => t._id === displayTrack._id);
  const colorClass = COLORS[trackIndex % COLORS.length];

  return (
    <div>
      <TopBar title="Stream" />

      <div className="px-4 max-w-3xl md:grid md:grid-cols-[1fr_280px] md:gap-8 md:items-start md:pt-6">
        {/* Full Player */}
        <div className="py-6 space-y-6">
          {/* Album Art */}
          <motion.div
            key={displayTrack._id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`aspect-square rounded-3xl bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-2xl mx-auto max-w-[280px]`}
          >
            {displayTrack.coverArt ? (
              <Image src={displayTrack.coverArt} alt={displayTrack.title} width={280} height={280} className="rounded-3xl object-cover w-full h-full" />
            ) : (
              <div className="text-6xl">🎵</div>
            )}
          </motion.div>

          {/* Track Info */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black">{displayTrack.title}</h2>
              <p className="text-[#9CA3AF]">{displayTrack.artist?.username}</p>
            </div>
            <button onClick={() => setLiked(!liked)}>
              <Heart size={24} className={liked ? "fill-red-500 text-red-500" : "text-[#9CA3AF]"} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={progress}
              onChange={(e) => setProgress(parseFloat(e.target.value))}
              className="w-full accent-[#FF6A00]"
            />
            <div className="flex justify-between text-xs text-[#9CA3AF]">
              <span>{formatTime((progress) * displayTrack.duration)}</span>
              <span>{formatTime(displayTrack.duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <button onClick={() => setShuffle(!shuffle)} className={shuffle ? "text-[#FF6A00]" : "text-[#9CA3AF]"}>
              <Shuffle size={22} />
            </button>
            <button onClick={prevTrack} className="text-white hover:text-[#FF6A00] transition-colors">
              <SkipBack size={30} fill="currentColor" />
            </button>
            <button
              onClick={() => currentTrack ? togglePlay() : setTrack(displayTrack, MOCK_TRACKS)}
              className="w-16 h-16 bg-gradient-to-r from-[#FF6A00] to-[#FF9A3C] rounded-full flex items-center justify-center shadow-lg shadow-[#FF6A00]/40 hover:scale-105 active:scale-95 transition-transform"
            >
              {isPlaying ? <Pause size={26} fill="white" /> : <Play size={26} fill="white" className="ml-1" />}
            </button>
            <button onClick={nextTrack} className="text-white hover:text-[#FF6A00] transition-colors">
              <SkipForward size={30} fill="currentColor" />
            </button>
            <button onClick={() => setRepeat(!repeat)} className={repeat ? "text-[#FF6A00]" : "text-[#9CA3AF]"}>
              <Repeat size={22} />
            </button>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-center gap-6">
            <button className="flex items-center gap-1.5 text-[#9CA3AF] hover:text-white transition-colors text-sm">
              <Plus size={18} />
              Playlist
            </button>
            <button className="flex items-center gap-1.5 text-[#9CA3AF] hover:text-white transition-colors text-sm">
              <Share2 size={18} />
              Share
            </button>
            <button className="flex items-center gap-1.5 text-[#9CA3AF] hover:text-white transition-colors text-sm">
              <Volume2 size={18} />
              Volume
            </button>
          </div>
        </div>

        {/* UP NEXT */}
        <div className="space-y-3 pb-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#9CA3AF] text-sm uppercase tracking-wider">Up Next</h3>
          </div>
          <div className="space-y-2">
            {MOCK_TRACKS.filter(t => t._id !== displayTrack._id).map((track, i) => (
              <button
                key={track._id}
                onClick={() => setTrack(track, MOCK_TRACKS)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#141414] transition-colors text-left"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${COLORS[i % COLORS.length]} flex items-center justify-center shrink-0 text-lg`}>
                  🎵
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{track.title}</p>
                  <p className="text-[#9CA3AF] text-xs">{track.artist?.username}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-[#9CA3AF]">{formatTime(track.duration)}</p>
                  <p className="text-xs text-[#6B7280]">{formatNumber(track.plays)} plays</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
