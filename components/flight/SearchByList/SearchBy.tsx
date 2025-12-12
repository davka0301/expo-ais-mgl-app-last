import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SEARCH_BY } from "@/constants/searchBy";
import SearchByItem from "./SearchByItem";
import FlightNumber from "./Modals/FlightNumber";
import AirLine from "./Modals/AirLine";
import DateList from "./Modals/DateList";
import DirectionDate from "./Modals/Direction/DirectionDate";
import DirectionSelect from "./Modals/Direction/DirectionSelect";

type SearchItem = (typeof SEARCH_BY)[0];
type ActiveModal = "1" | "2" | "3" | "4" | null;

const initialState: SearchItem = {
  id: "",
  name_title: "",
  name_title_mn: "",
  sub_title: "",
  sub_title_mn: "",
  icon: "",
};

const SearchBy = ({ selectedAirport }: { selectedAirport: string }) => {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [selectedItem, setSelectedItem] = useState<SearchItem>(initialState);
  const [isDirectionListVisible, setIsDirectionListVisible] = useState(false);
  const [selectedDirectionDate, setSelectedDirectionDate] =
    useState<string>("");

  const handleItemPress = (item: SearchItem) => {
    setSelectedItem(item);
    switch (item.id) {
      case "1":
        setActiveModal("1");
        break;
      case "2":
        setActiveModal("2");
        break;
      case "3":
        setActiveModal("3");
        break;
      case "4":
        setActiveModal("4");
        break;
      default:
        setActiveModal(null);
        break;
    }
  };
  const handleCloseModal = () => {
    setActiveModal(null);
    setIsDirectionListVisible(false);
    setSelectedItem(initialState);
  };

  const handleFlight = (value: string) => {
    handleCloseModal();
  };

  const handleAirLine = (value: string) => {
    // Do something with the entered flight details
    Alert.alert(`Entered ${selectedItem.name_title}`, `Value: ${value}`);
    handleCloseModal();
  };

  const handleDate = (value: string) => {
    // Do something with the entered flight details
    Alert.alert(`Entered ${selectedItem.name_title}`, `Value: ${value}`);
    handleCloseModal();
  };
  const handleDirection = (date: string) => {
    setSelectedDirectionDate(date);
    setIsDirectionListVisible(true);
    setActiveModal(null);
  };
  return (
    <View>
      <Text style={styles.headerText}>Search By</Text>
      {SEARCH_BY.map((item) => (
        <SearchByItem
          key={item.id}
          iconName={item.icon}
          title={item.name_title}
          subtitle={item.sub_title}
          onPress={() => handleItemPress(item)}
        />
      ))}
      <FlightNumber
        isVisible={activeModal === "1"}
        onClose={handleCloseModal}
        onNext={handleFlight}
        itemData={selectedItem}
        selectedAirport={selectedAirport}
      />
      <AirLine
        isVisible={activeModal === "2"}
        onClose={handleCloseModal}
        onNext={handleAirLine}
        itemData={selectedItem}
        selectedAirport={selectedAirport}
      />
      <DirectionDate
        isVisible={activeModal === "3"}
        onClose={handleCloseModal}
        onNext={handleDirection}
        itemData={selectedItem}
      />

      <DirectionSelect
        isVisible={isDirectionListVisible}
        onClose={handleCloseModal}
        itemData={selectedItem}
        selectedAirport={selectedAirport}
        date={selectedDirectionDate}
      />

      <DateList
        isVisible={activeModal === "4"}
        onClose={handleCloseModal}
        onNext={handleDate}
        itemData={selectedItem}
        selectedAirport={selectedAirport}
      />
    </View>
  );
};

export default SearchBy;
const styles = StyleSheet.create({
  headerText: {
    fontSize: 18,
    fontFamily: "Bold",
    marginBottom: 15,
  },
});
