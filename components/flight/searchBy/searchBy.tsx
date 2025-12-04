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
import { Colors } from "@/constants/color";
import FlightNumber from "./bottomSheet/flightNumber";
import Airline from "./bottomSheet/airline";
import DateSelect from "./bottomSheet/dateSelect";
import DirectionDate from "./bottomSheet/direction/directionDate";

type ModalType = "1" | "2" | "3" | "4" | null;

const SearchBy = ({ selectedAirport }: { selectedAirport: string }) => {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["60%"], []);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<any>(null);

  // dates
  const today = new Date().toISOString().split("T")[0];
  const [selectedDates, setSelectedDates] = useState<string[]>([today]);

  // reset dates
  const resetDates = () => {
    setSelectedDates([today]);
  };

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

  const openSheet = useCallback(
    (item: any) => {
      setModalType(item.id);
      setModalData({ ...item, airportCode: selectedAirport }); // 🔥 icon, title, subtitle бүгд энд
      bottomSheetRef.current?.present();
    },
    [selectedAirport]
  );

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
      onCancel: () => {
        bottomSheetRef.current?.close(), resetDates();
      },
    };
    switch (modalType) {
      case "1":
        return <FlightNumber {...commonProps} onNext={handleNextFromModal} />;

      case "2":
        return <Airline {...commonProps} onNext={handleNextFromModal} />;

      case "3":
        return (
          <DirectionDate
            {...commonProps}
            airportCode={modalData?.airportCode}
            onNext={handleNextDirection}
          />
        );

      case "4":
        return (
          <DateSelect
            {...commonProps}
            selectedDates={selectedDates}
            onDayPress={onDayPress}
            marked={marked}
            onNext={handleNextDate}
          />
        );

      default:
        return null;
    }
  };

  const handleNextDate = () => {
    bottomSheetRef.current?.close();
    router.push({
      pathname: "/flight/searchBy/searchByDate",
      params: {
        dates: JSON.stringify(selectedDates),
        airportCode: modalData?.airportCode,
      },
    });
    resetDates();
  };
  const handleNextFromModal = (payload?: any) => {
    bottomSheetRef.current?.close();
    router.push({
      pathname: "/flight/searchBy/searchByFlightNumber",
      params: { route: payload },
    });
  };
  const handleNextDirection = (payload: {
    date: string;
    airportCode: string;
    directionCode: string;
  }) => {
    bottomSheetRef.current?.close();
    router.push({
      pathname: "/flight/searchBy/searchByDirection",
      params: {
        date: payload.date,
        airportCode: payload.airportCode,
        directionCode: payload.directionCode,
      },
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
  },
  headerText: {
    fontSize: 18,
    fontFamily: "Bold",
    marginBottom: 15,
  },
});
