import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import AipSearchHeader from "./aipSearchHeader";
import { useAipCatData } from "@/hooks/useAipCatData";
import { AipCat } from "@/hooks/interface/aip/aipCat";
import { useLanguage } from "@/context/LanguageContext";
import { useAipData } from "@/hooks/useAipData";
import { Colors } from "@/constants/color";
import { AD, ENR, GEN } from "@/constants/aipSearchName";
import { useRouter } from "expo-router";
import { AMDT } from "@/hooks/interface/aip/amdt";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { AIC } from "@/hooks/interface/aip/aic";
import { SUP } from "@/hooks/interface/aip/sup";

const AipSearch = (props: any) => {
  const router = useRouter();
  const { language } = useLanguage();
  const { tabs } = useAipCatData();
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [selectedTab, setSelectedTab] = useState("AIP");
  const { aipData } = useAipData(selectedTab);
  const DATASETS = [GEN, ENR, AD];

  const toggle = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      <AipSearchHeader />
      <View style={styles.searchCard}>
        {/* TAB  */}
        <View style={styles.tabConteiner}>
          {tabs.map((tabs: AipCat) => (
            <TouchableOpacity
              key={tabs.cat_code}
              style={[
                styles.tab,
                selectedTab === tabs.cat_code && styles.activeTab,
              ]}
              onPress={() => {
                setSelectedTab(tabs.cat_code as any);
                setExpanded({});
              }}
            >
              <Text
                style={[
                  selectedTab === tabs.cat_code
                    ? styles.activeTabText
                    : styles.tabText,
                ]}
              >
                {language === "EN" ? tabs.cat_name_en : tabs.cat_name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView style={styles.scrollContainer}>
          {selectedTab === "AIP" &&
            Object.entries(DATASETS).map(([datasetKey, arr]) =>
              arr.map((section) => (
                <View key={`section-${datasetKey}-${section.group_id}`}>
                  {/* one level */}
                  <TouchableOpacity
                    key={`${datasetKey}-${section.group_id}`}
                    style={styles.oneSection}
                    onPress={() => toggle(section.group_name_en)}
                  >
                    <Text
                      style={{
                        fontFamily: "Medium",
                        fontSize: 16,
                        color: "#fff",
                      }}
                    >
                      {expanded[section.group_name_en] ? "-" : "+"}{" "}
                      {language === "EN"
                        ? section.group_name_en
                        : section.group_name_mn}
                    </Text>
                  </TouchableOpacity>

                  {/* two level */}
                  {expanded[section.group_name_en] &&
                    section.groups.map((g) => (
                      <View key={`group-${g.code}`}>
                        <TouchableOpacity
                          key={g.code}
                          style={styles.twoSection}
                          onPress={() => toggle(g.code)}
                        >
                          <Text style={{ color: "#5a57ff" }} numberOfLines={1}>
                            {expanded[g.code] ? "–" : "+ "} {g.code}{" "}
                            {language === "EN" ? g.name_en : g.name_mn}
                          </Text>
                        </TouchableOpacity>
                        {/* three level */}
                        {expanded[g.code] &&
                          g.items?.map((aip: any) => (
                            <TouchableOpacity
                              key={aip.code}
                              style={styles.threeSection}
                              onPress={async () => {
                                try {
                                  const res = await fetch(
                                    "https://ais.mn/api/aismongolia/aip?cat=AIP"
                                  );
                                  const json = await res.json();
                                  const found = json.find(
                                    (item: any) => item.code === aip.code
                                  );
                                  if (!found) return;

                                  // ✅ JSON бэлтгэж дамжуулах
                                  const payload = {
                                    type: "AIP",
                                    code: found.code,
                                    aip_en: found.aip_en,
                                    aip_mn: found.aip,
                                    direction: found.parent_direction,
                                  };
                                  const encoded = encodeURIComponent(
                                    JSON.stringify(payload)
                                  );

                                  router.replace({
                                    pathname: "/(tabs)/aip",
                                    params: { data: encoded },
                                  });
                                } catch (e) {
                                  console.error("AIP fetch error:", e);
                                }
                              }}
                            >
                              <Text
                                style={{ color: "#0000ff" }}
                                numberOfLines={1}
                              >
                                {aip.code}{" "}
                                {language === "EN" ? aip.name_en : aip.name_mn}
                              </Text>
                            </TouchableOpacity>
                          ))}
                      </View>
                    ))}
                </View>
              ))
            )}
          {selectedTab === "AMDT" &&
            aipData.map((amdt: AMDT, idx) => (
              <TouchableOpacity
                key={`${amdt.amendment_name ?? "amdt"}-${idx}`}
                onPress={() => {
                  const payload = {
                    type: "AMDT",
                    en: amdt.file_name_en,
                    mn: amdt.file_name_mn,
                  };
                  const encoded = encodeURIComponent(JSON.stringify(payload));
                  router.replace({
                    pathname: "/(tabs)/aip",
                    params: {
                      data: encoded,
                    },
                  });
                }}
                style={styles.oneSection}
              >
                <Text style={styles.orderText}>{amdt.amendment_name}</Text>
                <Text style={styles.orderDate}>{amdt.pub_date}</Text>
              </TouchableOpacity>
            ))}
          {selectedTab === "AIC" &&
            aipData.map((aic: AIC, idx) => (
              <TouchableOpacity
                // key={aic.menu_name}
                key={`${aic.menu_name ?? "aic"}-${idx}`}
                onPress={() => {
                  const payload = {
                    type: "AIC",
                    en: aic.file_name_en,
                    mn: aic.file_name_mn,
                  };
                  const encoded = encodeURIComponent(JSON.stringify(payload));
                  router.replace({
                    pathname: "/(tabs)/aip",
                    params: { data: encoded },
                  });
                }}
                style={styles.oneSection}
              >
                <Text style={styles.orderText}>{aic.menu_name}</Text>
                <Text style={styles.orderDate}>{aic.date}</Text>
              </TouchableOpacity>
            ))}
          {selectedTab === "SUP" &&
            aipData.map((sup: SUP, idx) => (
              <TouchableOpacity
                key={`${sup.menu_name ?? "sup"}-${idx}`}
                style={styles.oneSection}
                onPress={() => {
                  const payload = {
                    type: "sup",
                    en: sup.file_name_en,
                    mn: sup.file_name_mn,
                  };
                  const encoded = encodeURIComponent(JSON.stringify(payload));
                  router.replace({
                    pathname: "/(tabs)/aip",
                    params: { data: encoded },
                  });
                }}
              >
                <Text style={styles.orderText}>{sup.menu_name}</Text>
                <Text style={styles.orderDate}>{sup.date}</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    </DrawerContentScrollView>
  );
};

export default AipSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchCard: {
    position: "absolute",
    top: 120,
    width: "100%",
    height: "100%",
  },
  // TABs
  tabConteiner: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#d9d9d9",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomColor: "transparent",
  },
  activeTab: {
    backgroundColor: "#00007d",
    borderBottomColor: "#007AFF",
    borderRadius: 8,
  },
  tabText: {
    color: "#000",
    fontFamily: "Bold",
    fontSize: 15,
  },
  activeTabText: {
    color: "#fff",
    fontFamily: "Bold",
    fontSize: 15,
  },
  // SCROLL
  scrollContainer: {
    backgroundColor: "white",
    marginTop: -10,
  },
  // AIP
  oneSection: { backgroundColor: "#00007D", padding: 8, marginTop: 12 },
  twoSection: {
    backgroundColor: "#fff",
    marginRight: -12,
    marginLeft: -12,
    paddingLeft: 15,
  },
  threeSection: {
    paddingLeft: 15,
  },
  // ORDER
  orderText: {
    color: Colors.text_white,
    fontFamily: "Bold",
  },
  orderDate: { color: Colors.text_white, fontFamily: "Regular", fontSize: 12 },
});
