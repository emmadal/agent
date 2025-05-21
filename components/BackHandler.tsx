import React from "react";
import { View, Pressable, useColorScheme } from "react-native";
import { ThemedText } from "./ThemedText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";

export const BackHandler = ({ title }: { title: string }) => {
  const iconColor = Colors.primaryColor;

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
          padding: 8,
        })}
      >
        <Ionicons name="chevron-back" size={35} color={iconColor} />
      </Pressable>
      <ThemedText type="subtitle" style={{ marginLeft: 10 }}>
        {title}
      </ThemedText>
    </View>
  );
};
