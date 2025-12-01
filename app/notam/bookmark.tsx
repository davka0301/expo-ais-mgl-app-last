import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useNotamWishlist } from "@/constants/bookMart/notamBookMart";
import { Ionicons } from "@expo/vector-icons";
import NotamCard from "@/components/notam/notamCard";

const Bookmark = () => {
  const { language } = useLanguage();
  const { wishlist, isLoaded } = useNotamWishlist();

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          Хадгалж буй мэдээлэл уншиж байна...
        </Text>
      </View>
    );
  }

  if (wishlist.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="bookmark-outline" size={56} color="#ccc" />
        <Text style={styles.emptyText}>
          {" "}
          {language == "EN"
            ? "No saved NOTAMs."
            : "Хадгалсан NOTAM алга байна..."}
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={wishlist}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <NotamCard item={item} />}
        contentContainerStyle={{
          paddingTop: 10,
        }}
        scrollEventThrottle={16}
      />
    </View>
  );
};

export default Bookmark;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 12 },

  // Loading UI
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#666", marginTop: 8 },
});
