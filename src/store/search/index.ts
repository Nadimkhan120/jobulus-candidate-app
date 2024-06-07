import { MMKV } from 'react-native-mmkv';
import { create } from 'zustand';
import type { StateStorage } from 'zustand/middleware';
import { createJSONStorage, persist } from 'zustand/middleware';

const storage = new MMKV();

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storage.delete(name);
  },
};

interface SearchState {
  recentSearches: any;
  setRecentSearches: (data: any) => void;
  removeRecentSearches: (data: any) => void;
}

export const useSearchStorage = create<SearchState>()(
  persist(
    (set, get) => ({
      recentSearches: [],
      setRecentSearches: (data: any) => {
        set((state) => {
          // Check if the ID already exists
          const isIdExists = state?.recentSearches?.some((item) => item?.id === data?.id);

          if (!isIdExists) {
            // If ID doesn't exist, add the new item
            return { recentSearches: [...state.recentSearches, data] };
          }

          // If ID already exists, do nothing
          return state;
        });
      },

      removeRecentSearches: (data: any) => {},
    }),
    {
      name: 'search-storage', // name of item in the storage (must be unique)
      storage: createJSONStorage(() => zustandStorage), // (optional) by default the 'localStorage' is used
    }
  )
);

export const setRecentSearches = (data: any) => {
  return useSearchStorage.getState().setRecentSearches(data);
};

export const removeRecentSearches = (data: any) => {
  return useSearchStorage.getState().removeRecentSearches(data);
};
