import React from "react";
import { StyleSheet, Pressable } from "react-native";
import type { Agency } from "@/types/agency.type";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "./ThemedView";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const AgencyCard = ({
  agency,
  onPress,
  setSheetData,
}: {
  agency: Agency;
  onPress: any;
  setSheetData: any;
}) => {
  const handlePress = () => {
    onPress();
    setSheetData([agency]);
  };

  return (
    <ThemedView style={styles.card}>
      {/* <ThemedView>
        <Image
          style={styles.image}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          source={{ uri: agency?.picture }}
          accessibilityLabel="Logo"
          aria-label={`${agency.name}`}
          alt={`${agency.name}`}
        />
        <ActivityIndicator
          style={styles.activityIndicator}
          color={Colors.primaryColor}
          animating={loading}
        />
      </ThemedView> */}
      <ThemedView style={styles.content}>
        <ThemedText type="bold" style={styles.text}>
          {agency.name}
        </ThemedText>
        <ThemedText type="default" style={styles.address}>
          {agency.address}
        </ThemedText>
        <Pressable onPress={handlePress} style={styles.pressable}>
          <ThemedText
            type="defaultSemiBold"
            selectionColor={Colors.primaryColor}
          >
            Voir Details{" "}
          </ThemedText>
          <Icon name="arrow-right" size={20} color={Colors.primaryColor} />
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
  card: {
    flexShrink: 1,
    flexDirection: "row",
    marginVertical: 25,
    borderRadius: 15,
    padding: 10,
    alignItems: "center",
  },
  image: {
    height: 90,
    aspectRatio: 1,
    backgroundColor: "transparent",
  },
  content: {
    flexShrink: 1,
    marginLeft: 20,
  },
  cover: {
    resizeMode: "cover",
    borderRadius: 0,
  },
  text: {
    backgroundColor: "transparent",
    marginTop: 10,
  },
  address: {
    backgroundColor: "transparent",
    marginTop: 10,
    justifyContent: "center",
    textAlign: "auto",
  },
  activityIndicator: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 50,
  },
  pressable: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default AgencyCard;
