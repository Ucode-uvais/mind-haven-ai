import { create } from "zustand";

interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
}

interface PlayerState {
  playlist: Track[];
  currentTrackIndex: number | null;
  currentTrack: Track | null;
  isPlaying: boolean;
  isMinimized: boolean;
  volume: number;
  playPlaylist: (tracks: Track[]) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
  setVolume: (volume: number) => void;
  toggleMinimize: () => void;
  _updateCurrentTrack: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  playlist: [],
  currentTrackIndex: null,
  currentTrack: null,
  isPlaying: false,
  isMinimized: true,
  volume: 0.5,

  playPlaylist: (tracks) => {
    set({
      playlist: tracks,
      currentTrackIndex: 0,
      isPlaying: true,
      isMinimized: false,
    });
    get()._updateCurrentTrack();
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  playNext: () =>
    set((state) => {
      if (state.currentTrackIndex === null) return {};
      const nextIndex = (state.currentTrackIndex + 1) % state.playlist.length;
      return { currentTrackIndex: nextIndex };
    }),

  playPrev: () =>
    set((state) => {
      if (state.currentTrackIndex === null) return {};
      const prevIndex =
        (state.currentTrackIndex - 1 + state.playlist.length) %
        state.playlist.length;
      return { currentTrackIndex: prevIndex };
    }),

  setVolume: (volume) => set({ volume }),

  toggleMinimize: () => set((state) => ({ isMinimized: !state.isMinimized })),

  // Internal function to update the current track based on the index
  _updateCurrentTrack: () =>
    set((state) => {
      if (state.currentTrackIndex !== null) {
        return { currentTrack: state.playlist[state.currentTrackIndex] };
      }
      return { currentTrack: null };
    }),
}));
