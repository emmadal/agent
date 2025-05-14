import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Button, Card } from "react-native-paper";
import type { Agency } from "@/types/agency.type";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";

const RoadAgencyCard = ({ agency }: { agency: Agency }) => {
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <ThemedText type="bold" style={styles.text}>
          {agency.name?.toLocaleUpperCase()}
        </ThemedText>
        <ThemedText type="default" style={styles.text}>
          {agency.address}
        </ThemedText>
      </Card.Content>
      <Card.Actions style={styles.content}>
        <Button
          textColor={Colors?.dark?.text}
          mode="contained"
          buttonColor={Colors?.primaryColor}
          onPress={() =>
            router.navigate({
              pathname: "/road-agency",
              params: { store: JSON.stringify(agency) },
            })
          }
          style={{ marginTop: 18 }}
        >
          Consultez
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 25,
    width: Dimensions.get("window").width / 1.2,
    alignSelf: "center",
    borderRadius: 0,
    elevation: 10,
    backgroundColor: "#fff",
    minHeight: 150,
  },
  content: {
    paddingTop: 5,
  },
  cover: {
    resizeMode: "cover",
    borderRadius: 0,
  },
  text: {
    backgroundColor: "transparent",
    marginTop: 10,
  },
  activityIndicator: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 50,
  },
});

export default RoadAgencyCard;
