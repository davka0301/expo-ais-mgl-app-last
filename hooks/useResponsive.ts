// hooks/useResponsive.ts
import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

export function useResponsive() {
  const scaleW = SCREEN_WIDTH / BASE_WIDTH;
  const scaleH = SCREEN_HEIGHT / BASE_HEIGHT;
  const scale = Math.min(scaleW, scaleH);

  // Width/Height responsive
  const rw = (value: number) => value * scaleW;
  const rh = (value: number) => value * scaleH;

  // Perfect Font Scaling
  const rf = (size: number) =>
    Math.round(PixelRatio.roundToNearestPixel(size * scale));

  // Card width responsive
  const isTablet = SCREEN_WIDTH >= 600;
  const cardWidth = SCREEN_WIDTH;

  return {
    rw, // responsive width
    rh, // responsive height
    rf, // responsive fontSize
    cardWidth,
    screenWidth: SCREEN_WIDTH,
    screenHeight: SCREEN_HEIGHT,
    isTablet,
  };
}
