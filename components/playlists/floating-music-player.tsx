"use client";

import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "@/lib/stores/player-store";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  ChevronDown,
  Music,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";

export const FloatingMusicPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    playNext,
    playPrev,
    volume,
    setVolume,
    isMinimized,
    toggleMinimize,
  } = usePlayerStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  const dragConstraintsRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const dragControls = useDragControls(); // Hook to manually control dragging

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        audioRef.current.play().catch((e) => console.error("Play error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100
      );
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime =
        (value[0] / 100) * audioRef.current.duration;
    }
  };

  if (!currentTrack) return null;

  return (
    <>
      <div
        ref={dragConstraintsRef}
        className="fixed inset-0 pointer-events-none z-50"
      />
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNext}
        onLoadedData={() => {
          if (isPlaying && audioRef.current) {
            audioRef.current.play();
          }
        }}
      />
      <AnimatePresence>
        {/* Main draggable container */}
        <motion.div
          drag
          dragListener={false} // Disable default drag trigger
          dragControls={dragControls} // Use manual controls
          dragConstraints={dragConstraintsRef}
          dragMomentum={false}
          className="fixed bottom-4 right-4 z-50 pointer-events-auto"
        >
          {isMinimized ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onTap={toggleMinimize}
              onPointerDown={(e) => dragControls.start(e)} // The whole icon is the handle
              className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-lg border border-primary/20 shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing"
            >
              <Music className="w-8 h-8 text-primary animate-pulse" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-80 p-4 rounded-xl bg-card/80 backdrop-blur-lg border border-primary/10 shadow-2xl"
            >
              {/* Drag Handle: The header area */}
              <div
                onPointerDown={(e) => dragControls.start(e)}
                className="flex items-center justify-between cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-md bg-secondary overflow-hidden pointer-events-none">
                    <Image
                      src="/music/thumbnails/default.png"
                      width={48}
                      height={48}
                      alt="Album art"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm pointer-events-none">
                      {currentTrack.title}
                    </h4>
                    <p className="text-xs text-muted-foreground pointer-events-none">
                      {currentTrack.artist}
                    </p>
                  </div>
                </div>
                {/* This button stops drag propagation so it can be clicked */}
                <Button
                  variant="ghost"
                  size="icon"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={toggleMinimize}
                >
                  <ChevronDown className="w-5 h-5" />
                </Button>
              </div>

              <div className="mt-4">
                <Slider
                  value={[progress]}
                  onValueChange={handleSeek}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-center gap-4 mt-4">
                <Button variant="ghost" size="icon" onClick={playPrev}>
                  <SkipBack className="w-5 h-5" />
                </Button>
                <Button
                  size="icon"
                  className="w-12 h-12 rounded-full"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </Button>
                <Button variant="ghost" size="icon" onClick={playNext}>
                  <SkipForward className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-center gap-2 mt-4">
                {volume > 0 ? (
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <VolumeX className="w-4 h-4 text-muted-foreground" />
                )}
                <Slider
                  value={[volume * 100]}
                  onValueChange={(v) => setVolume(v[0] / 100)}
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
};
