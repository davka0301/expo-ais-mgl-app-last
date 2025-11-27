import { useEffect, useState } from "react";
import { Dimensions } from "react-native";

export function useResponsiveSize() {
  const [screen, setScreen] = useState(Dimensions.get("window"));

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreen(window); // дэлгэц өөрчлөгдөх бүрт шинэчлэнэ
    });

    return () => subscription?.remove();
  }, []);

  const { width, height } = screen;

  const headerTop = height * 0.15;

  const headerNotamTop = height * 0.2;

  return {
    width,
    height,
    headerTop,
    headerNotamTop,
  };
}
