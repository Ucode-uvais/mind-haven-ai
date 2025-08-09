"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlayCircle, Music4 } from "lucide-react";
import Image from "next/image";
import { usePlayerStore } from "@/lib/stores/player-store";

// Static data for playlists
const playlists = [
  {
    id: "calm-sadness",
    title: "Calm for Sadness",
    description: "Gentle melodies to soothe a heavy heart.",
    thumbnail: "/music/thumbnails/01.png",
    emotionTags: ["sad", "lonely"],
    tracks: [
      {
        id: "1",
        title: "Stillness Within",
        artist: "Serene Soundscapes",
        src: "/music/01.mp3",
      },
    ],
  },
  {
    id: "loneliness-comfort",
    title: "Comfort for Loneliness",
    description: "Warm soundscapes to feel connected.",
    thumbnail: "/music/thumbnails/02.png",
    emotionTags: ["lonely", "distress"],
    tracks: [
      {
        id: "2",
        title: "Gentle Embrace",
        artist: "Aura Harmonix",
        src: "/music/03.mp3",
      },
    ],
  },
  {
    id: "distress-relief",
    title: "Relief from Distress",
    description: "Calming music to ease your mind.",
    thumbnail: "/music/thumbnails/03.png",
    emotionTags: ["distress", "anxious"],
    tracks: [
      {
        id: "3",
        title: "Peaceful Resonance",
        artist: "Zen States",
        src: "/music/02.mp3",
      },
      {
        id: "4",
        title: "Whispering Wind",
        artist: "Mindful Journeys",
        src: "/music/04.mp3",
      },
    ],
  },
  {
    id: "anger-peace",
    title: "Peace from Anger",
    description: "Soothing sounds to calm rageing thoughts.",
    thumbnail: "/music/thumbnails/04.png",
    emotionTags: ["anxious", "rage"],
    tracks: [
      {
        id: "5",
        title: "Fields of Ard Skeliige",
        artist: "Marcin",
        src: "/music/05.mp3",
      },
      {
        id: "6",
        title: "Wildheart",
        artist: "Brunhvile",
        src: "/music/06.mp3",
      },
    ],
  },
  {
    id: "stress-melt",
    title: "Melt from Stress",
    description: "Melodies to dissolve tension and worry.",
    thumbnail: "/music/thumbnails/05.png",
    emotionTags: ["stressed", "overwhelmed"],
    tracks: [
      {
        id: "7",
        title: "Kaer Morhen",
        artist: "Marcin",
        src: "/music/07.mp3",
      },
      {
        id: "8",
        title: "Spirit of the wild",
        artist: "Brunhvile",
        src: "/music/08.mp3",
      },
    ],
  },
  {
    id: "fear-strength",
    title: "Strength for Fear",
    description: "Empowering melodies to ignite courage and resilience.",
    thumbnail: "/music/thumbnails/06.png",
    emotionTags: ["scared", "nervous"],
    tracks: [
      {
        id: "9",
        title: "Wolf & the Moon",
        artist: "Brunhville",
        src: "/music/09.mp3",
      },
      {
        id: "10",
        title: "Heroes never Die",
        artist: "David Chappell",
        src: "/music/10.mp3",
      },
    ],
  },
];

export const MeditationPlaylists = () => {
  const { playPlaylist } = usePlayerStore();

  const handlePlaylistPlay = (playlist: (typeof playlists)[0]) => {
    playPlaylist(playlist.tracks);
  };

  return (
    // Main container card for the section
    <Card className="border-primary/10 bg-slate-50 dark:bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Music4 className="h-5 w-5 text-primary" />
          Meditation Playlists
        </CardTitle>
        <CardDescription>
          Music to soothe you when you&apos;re feeling down
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            // Each playlist item is now a single motion.div acting as the card
            <motion.div
              key={playlist.id}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="relative group h-64 w-full cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-xl dark:shadow-2xl dark:hover:shadow-primary/20 transition-shadow duration-300"
              onClick={() => handlePlaylistPlay(playlist)}
            >
              {/* The Image component fills the entire container */}
              <Image
                src={playlist.thumbnail}
                alt={playlist.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Gradient overlay for text readability, positioned at the bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              {/* Text content positioned at the bottom */}
              <div className="absolute bottom-0 left-0 p-4">
                <h4 className="text-lg font-semibold text-white tracking-wide">
                  {playlist.title}
                </h4>
                <p className="text-sm text-white/80 mt-1">
                  {playlist.description}
                </p>
              </div>

              {/* Play icon overlay, centered */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                <PlayCircle className="w-16 h-16 text-white/90" />
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
