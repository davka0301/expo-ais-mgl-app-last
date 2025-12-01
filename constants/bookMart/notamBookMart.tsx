// constants/notamBookMart.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Notam } from "@/hooks/interface/notam";

interface NotamWishlistContextType {
  wishlist: Notam[];
  addToWishlist: (item: Notam) => void;
  removeFromWishlist: (number: string) => void;
  isLoaded: boolean;
}

const STORAGE_KEY = "NOTAM_WISHLIST";

const NotamWishlistContext = createContext<
  NotamWishlistContextType | undefined
>(undefined);

export const NotamWishlistProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [wishlist, setWishlist] = useState<Notam[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 📌 1. LOAD FROM ASYNC STORAGE
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          setWishlist(JSON.parse(json));
        }
      } catch (e) {
        console.error("Wishlist load error:", e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadWishlist();
  }, []);

  // 📌 2. SAVE TO ASYNC STORAGE
  const saveWishlist = async (data: Notam[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Wishlist save error:", e);
    }
  };

  // 📌 3. ADD
  const addToWishlist = (item: Notam) => {
    setWishlist((prev) => {
      if (prev.find((w) => w.number === item.number)) return prev;
      const updated = [...prev, item];
      saveWishlist(updated);
      return updated;
    });
  };

  // 📌 4. REMOVE
  const removeFromWishlist = (number: string) => {
    setWishlist((prev) => {
      const updated = prev.filter((w) => w.number !== number);
      saveWishlist(updated);
      return updated;
    });
  };

  return (
    <NotamWishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isLoaded }}
    >
      {children}
    </NotamWishlistContext.Provider>
  );
};

export const useNotamWishlist = () => {
  const ctx = useContext(NotamWishlistContext);
  if (!ctx)
    throw new Error(
      "useNotamWishlist must be used within NotamWishlistProvider"
    );
  return ctx;
};
