import React from "react";
import { Dimensions, StyleSheet, View, useColorScheme } from "react-native";
import { Button, Card } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Agency } from "@/types/agency.type";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { type LegendListRenderItemProps } from "@legendapp/list";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";


const RoadAgencyCard: React.FC<LegendListRenderItemProps<Agency>> = ({ item }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  return (
    <Card style={styles.card}>
      <LinearGradient
        colors={[isDark ? Colors.dark.background : Colors.light.background, isDark ? Colors.dark.background : Colors.light.background]}
        style={styles.gradient}
      >
        <Card.Content style={styles.content}>
          <View style={styles.headerContainer}>
            <Image
              source={{ uri: item?.picture }}
              style={styles.avatar}
              contentFit="cover"
              transition={1000}
              cachePolicy="disk"
              placeholder={require("@/assets/images/placeholder.png")}
            />
            <View style={styles.headerTextContainer}>
              <ThemedText type="bold" style={styles.titleText}>
                {item.name?.toLocaleUpperCase()}
              </ThemedText>
              <View style={styles.addressContainer}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={16}
                  color={Colors.primaryColor}
                  style={styles.icon}
                />
                <ThemedText type="default" style={styles.addressText}>
                  {item.address}
                </ThemedText>
              </View>
            </View>
          </View>
        </Card.Content>
        <View style={styles.divider} />
        <Card.Actions style={styles.actionsContainer}>
          <Button
            textColor="white"
            mode="contained"
            buttonColor={Colors?.primaryColor}
            onPress={() =>
              router.navigate({
                pathname: "/road-agency",
                params: { store: JSON.stringify(item) },
              })
            }
            style={styles.button}
            labelStyle={styles.buttonLabel}
            icon={({ size, color }) => (
              <MaterialCommunityIcons
                name="chevron-right"
                size={size}
                color={color}
              />
            )}
          >
            Consultez
          </Button>
        </Card.Actions>
      </LinearGradient>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 16,
    width: Dimensions.get("window").width / 1.1,
    alignSelf: "center",
    borderRadius: 12,
    elevation: 4,
    overflow: "hidden",
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gradient: {
    width: "100%",
    height: "100%",
  },
  content: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  titleText: {
    fontSize: 16,
    marginBottom: 4,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  addressText: {
    fontSize: 14,
    backgroundColor: "transparent",
    flex: 1,
  },
  icon: {
    marginRight: 4,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: "hidden",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(150, 150, 150, 0.3)",
    marginHorizontal: 16,
  },
  actionsContainer: {
    justifyContent: "flex-end",
    padding: 16,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    elevation: 2,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default RoadAgencyCard;
