import {
  ActivityIndicator,
  Animated,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import NotamHeader from "@/components/notam/notamHeader";
import { Colors } from "@/constants/color";
import { StatusBar } from "expo-status-bar";
import useNotamData from "@/hooks/useNotamData";
import useNotamCat from "@/hooks/useNotamCatData";
import NotamCard from "@/components/notam/notamCard";

const Notam = () => {
  const [series, setSeries] = useState("A");
  const { serie, loading } = useNotamCat(series);
  const [refreshing, setRefreshing] = useState(false);
  const { notamData, refetch } = useNotamData(series);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <NotamHeader
        onSeries={serie}
        selectedSerie={series}
        onSelectSerie={(code) => setSeries(code)}
      />

      {/* NOTAM CARD */}
      {!loading && notamData.length > 0 ? (
        <Animated.FlatList
          data={notamData}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            paddingBottom: 120,
          }}
          renderItem={({ item }) => {
            return <NotamCard item={item} />;
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
    </View>
  );
};

export default Notam;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
