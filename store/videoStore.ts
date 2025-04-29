import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VideoStore {
  bookmarks: string[];
  favorites: string[];
  addBookmark: (thumb: string) => void;
  removeBookmark: (thumb: string) => void;
  addFavorite: (thumb: string) => void;
  removeFavorite: (thumb: string) => void;
}

export const useVideoStore = create<VideoStore>()(
  persist(
    (set) => ({
      bookmarks: [],
      favorites: [],
      addBookmark: (thumb) =>
        set((state) => ({
          bookmarks: state.bookmarks.includes(thumb)
            ? state.bookmarks
            : [...state.bookmarks, thumb],
        })),
      removeBookmark: (thumb) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((item) => item !== thumb),
        })),
      addFavorite: (thumb) =>
        set((state) => ({
          favorites: state.favorites.includes(thumb)
            ? state.favorites
            : [...state.favorites, thumb],
        })),
      removeFavorite: (thumb) =>
        set((state) => ({
          favorites: state.favorites.filter((item) => item !== thumb),
        })),
    }),
    {
      name: 'video-storage',
      onRehydrateStorage: () => (state) => {
        console.log('Rehydrating video store...', state);
      },
    }
  )
);
