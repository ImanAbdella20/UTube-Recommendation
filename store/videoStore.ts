import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VideoStoreState {
  userVideos: {
    [userId: string]: {
      bookmarks: string[];
      favorites: string[];
    };
  };
  getUserBookmarks: (userId: string) => string[];
  getUserFavorites: (userId: string) => string[];
  addBookmark: (userId: string, videoId: string) => void;
  removeBookmark: (userId: string, videoId: string) => void;
  addFavorite: (userId: string, videoId: string) => void;
  removeFavorite: (userId: string, videoId: string) => void;
}

export const useVideoStore = create<VideoStoreState>()(
  persist(
    (set, get) => ({
      userVideos: {},

      getUserBookmarks: (userId) => {
        return get().userVideos[userId]?.bookmarks || [];
      },

      getUserFavorites: (userId) => {
        return get().userVideos[userId]?.favorites || [];
      },

      addBookmark: (userId, videoId) => {
        set((state) => {
          const user = state.userVideos[userId] || { bookmarks: [], favorites: [] };
          const updatedBookmarks = user.bookmarks.includes(videoId)
            ? user.bookmarks
            : [...user.bookmarks, videoId];

          return {
            userVideos: {
              ...state.userVideos,
              [userId]: {
                ...user,
                bookmarks: updatedBookmarks,
              },
            },
          };
        });
      },

      removeBookmark: (userId, videoId) => {
        set((state) => {
          const user = state.userVideos[userId];
          if (!user) return state;

          return {
            userVideos: {
              ...state.userVideos,
              [userId]: {
                ...user,
                bookmarks: user.bookmarks.filter((id) => id !== videoId),
              },
            },
          };
        });
      },

      addFavorite: (userId, videoId) => {
        set((state) => {
          const user = state.userVideos[userId] || { bookmarks: [], favorites: [] };
          const updatedFavorites = user.favorites.includes(videoId)
            ? user.favorites
            : [...user.favorites, videoId];

          return {
            userVideos: {
              ...state.userVideos,
              [userId]: {
                ...user,
                favorites: updatedFavorites,
              },
            },
          };
        });
      },

      removeFavorite: (userId, videoId) => {
        set((state) => {
          const user = state.userVideos[userId];
          if (!user) return state;

          return {
            userVideos: {
              ...state.userVideos,
              [userId]: {
                ...user,
                favorites: user.favorites.filter((id) => id !== videoId),
              },
            },
          };
        });
      },
    }),
    {
      name: 'user-video-store',
      onRehydrateStorage: () => (state) => {
        console.log('Rehydrating user-based video store...', state);
      },
    }
  )
);
