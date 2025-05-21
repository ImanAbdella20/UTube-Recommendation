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

export interface Note {
  id: string;
  videoId: string;
  content: string;
  createdAt: Date;
}



interface NoteStoreState {
  userNotes: {
    [userId: string]: Note[];
  };
  getUserNotes: (userId: string) => Note[];
  addNote: (userId: string, videoId: string, content: string) => void;
  removeNote: (userId: string, noteId: string) => void;
  updateNote: (userId: string, noteId: string, content: string) => void;
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


export const useNoteStore = create<NoteStoreState>()(
  persist(
    (set, get) => ({
      userNotes: {},

      getUserNotes: (userId) => {
        return get().userNotes[userId] || [];
      },

      addNote: (userId, videoId, content) => {
        set((state) => {
          const userNotes = state.userNotes[userId] || [];
          const newNote: Note = {
            id: Date.now().toString(),
            videoId,
            content,
            createdAt: new Date(),
          };

          return {
            userNotes: {
              ...state.userNotes,
              [userId]: [...userNotes, newNote],
            },
          };
        });
        window.dispatchEvent(new CustomEvent('notes-updated'));
      },

      removeNote: (userId, noteId) => {
        set((state) => {
          const userNotes = state.userNotes[userId];
          if (!userNotes) return state;

          return {
            userNotes: {
              ...state.userNotes,
              [userId]: userNotes.filter((note) => note.id !== noteId),
            },
          };
        });
        window.dispatchEvent(new CustomEvent('notes-updated'));
      },

      updateNote: (userId, noteId, content) => {
        set((state) => {
          const userNotes = state.userNotes[userId];
          if (!userNotes) return state;

          return {
            userNotes: {
              ...state.userNotes,
              [userId]: userNotes.map((note) =>
                note.id === noteId ? { ...note, content } : note
              ),
            },
          };
        });
        window.dispatchEvent(new CustomEvent('notes-updated'));
      },
    }),
    {
      name: 'user-notes-store',
    }
  )
);
