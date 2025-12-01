import { StyleSheet, Text, View } from "react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { SEARCH_BY } from "@/constants/searchBy";
import SearchByItem from "./searchByItem";
import { useRouter } from "expo-router";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { ModalType } from "./typesSearch";
import { Colors } from "@/constants/color";
import FlightNumber from "./bottomSheet/flightNumber";
import Airline from "./bottomSheet/airline";
import Route from "./bottomSheet/route";
import DateSelect from "./bottomSheet/dateSelect";

const SearchBy = () => {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["60%", "80%"], []);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<any>(null); // 🔥 Шинэ state

  // dates
  const today = new Date().toISOString().split("T")[0];
  const [selectedDates, setSelectedDates] = useState<string[]>([today]);

  const onDayPress = useCallback((day: any) => {
    const date = day.dateString;
    setSelectedDates((prev) => {
      if (prev.includes(date)) return prev.filter((d) => d !== date);
      return [...prev, date];
    });
  }, []);

  const marked = useMemo(() => {
    const m: any = {};
    selectedDates.forEach((d) => {
      m[d] = { selected: true, selectedColor: Colors.primary };
    });
    return m;
  }, [selectedDates]);

  const openSheet = useCallback((item: any) => {
    setModalType(item.id);
    setModalData(item); // 🔥 icon, title, subtitle бүгд энд
    bottomSheetRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    []
  );

  const renderSheetContent = () => {
    const commonProps = {
      icon: modalData?.icon,
      title: modalData?.name_title,
      subtitle: modalData?.sub_title,
      onCancel: () => bottomSheetRef.current?.close(),
      onNext: handleNextFromModal,
    };
    switch (modalType) {
      case "1":
        return <FlightNumber {...commonProps} />;

      case "2":
        return <Airline {...commonProps} />;

      case "3":
        return <Route {...commonProps} />;

      case "4":
        return (
          <DateSelect
            {...commonProps}
            selectedDates={selectedDates}
            onDayPress={onDayPress}
            marked={marked}
          />
        );

      default:
        return null;
    }
  };

  const handleNextFromModal = (payload?: any) => {
    // close and navigate with params as needed
    bottomSheetRef.current?.close();
    router.push({
      pathname: "/flight/searchBy/searchBy",
      params: { route: payload },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Search By</Text>
      {SEARCH_BY.map((item) => (
        <SearchByItem
          key={item.id}
          iconName={item.icon}
          title={item.name_title}
          subtitle={item.sub_title}
          onPress={() => openSheet(item)}
        />
      ))}

      <BottomSheetModal
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView>{renderSheetContent()}</BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

export default SearchBy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  headerText: {
    fontSize: 18,
    fontFamily: "Bold",
    marginBottom: 15,
  },
});
