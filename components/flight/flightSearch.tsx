// components/flight/FlightSearch.tsx

import { StyleSheet, Text, View } from "react-native";
import React from "react";
// useResponsiveSize-ийн кодыг харуулаагүй тул dummy hook үүсгэсэн.
import Svg, {
  ClipPath,
  Defs,
  Path,
  Rect,
  Circle,
  FeDropShadow,
} from "react-native-svg";
import { Colors } from "../../constants/color";
import { useResponsiveSize } from "@/hooks/useResponsiveSize";

// NOTE: useResponsiveSize hook-ийн кодыг харуулаагүй тул загвар үүсгэв.

const FlightSearch = () => {
  const { width } = useResponsiveSize();

  const cardWidth = width * 0.95;
  const radius = 30;
  const cardHeight = cardWidth * 0.7;
  const notch = width * 0.04;
  const a = 2;

  // Path commands:
  const path = `

  M0,${radius}

  Q0,0 ${radius},0

  L${cardWidth - radius},0

  Q${cardWidth},0 ${cardWidth},${radius}

  L${cardWidth},${cardHeight / a - notch}

  A${notch},${notch} 0 1,0 ${cardWidth},${cardHeight / a + notch}

  L${cardWidth},${cardHeight - radius}

  Q${cardWidth},${cardHeight} ${cardWidth - radius},${cardHeight}

  L${radius},${cardHeight}

  Q0,${cardHeight} 0,${cardHeight - radius}

  L0,${cardHeight / a + notch}

  A${notch},${notch} 0 1,0 0,${cardHeight / a - notch}

  Z

`;

  return (
    // 2. Хөндлөнгөөр төвлөрүүлэх (Horizontal Center)
    <View style={[styles.header, { width: cardWidth }]}>
      <Svg width={cardWidth} height={cardHeight}>
        <Defs>
          {/* Сүүдэрийг тодорхойлох Filter */}
          <FeDropShadow
            id="ticketShadow"
            dx="0" // X-тэнхлэгийн шилжилт
            dy="5" // Y-тэнхлэгийн шилжилт (доошоо)
            stdDeviation="3" // Блэрийн хэмжээ
            floodColor="#000000" // Сүүдрийн өнгө
            floodOpacity="0.25" // Сүүдрийн тунгалаг байдал
          />
          <ClipPath id="ticketClip">
            <Path d={path} />
          </ClipPath>
        </Defs>

        {/* Тасалбарын суурь (Background Rect) */}
        <Rect
          width={cardWidth}
          height={cardHeight}
          fill={Colors.background}
          stroke={Colors.background}
          clipPath="url(#ticketClip)"
          strokeWidth="1"
          filter="url(#ticketShadow)"
        />
      </Svg>
    </View>
  );
};

export default FlightSearch;

const styles = StyleSheet.create({
  header: {
    // 3. Хөндлөнгөөр төвлөрүүлэх гол өөрчлөлт:
    position: "absolute",
    top: 100, // Дээд талаас 100 зай авах
    // Хэрэв parent View-г ашиглахгүй бол:
    alignSelf: "center", // Энэ нь View-г эцэг элементийн төвд байрлуулна
    // Эсвэл: left: 0, right: 0, marginHorizontal: 'auto'

    // Энэ компонентын доторх Svg-ийг төвлөрүүлэх шаардлагагүй (учир нь Svg нь View-тэй ижил хэмжээтэй болсон)
    alignItems: "center",

    // Debug зорилготой backgroundColor-ийг устгасан
  },
});
