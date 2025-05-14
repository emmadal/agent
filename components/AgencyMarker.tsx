import React, { memo } from "react";
import { StyleSheet } from "react-native";
import { Callout, Marker } from "react-native-maps";
import { Agency } from "@/types/agency.type";
import { router } from "expo-router";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import Icon from "@expo/vector-icons/Ionicons";

const AgencyMarker = ({ agency }: { agency: Agency }) => {
  return (
    <Marker
      tracksViewChanges={false}
      coordinate={{
        latitude: Number(agency.latitude),
        longitude: Number(agency.longitude),
      }}
    >
      <Icon name="storefront" size={25} color="#000000" />
      <Callout
        style={styles.callout}
        onPress={() =>
          router.push({
            pathname: "/road-agency",
            params: { store: JSON.stringify(agency) },
          })
        }
      >
        <ThemedView style={styles.callOutView}>
          <ThemedText type="default" darkColor="black">
            {agency.name}
          </ThemedText>
          <ThemedText type="link">Consultez</ThemedText>
        </ThemedView>
      </Callout>
    </Marker>
  );
};

const styles = StyleSheet.create({
  callOutView: {
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "transparent",
    flex: 1,
  },
  marker: {
    width: 43,
    height: 43,
  },
  callout: {
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 150,
    backgroundColor: "transparent",
  },
});

export default memo(AgencyMarker);
