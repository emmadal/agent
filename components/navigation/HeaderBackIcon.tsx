// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { type IconProps } from "@expo/vector-icons/build/createIconSet";
import { router } from "expo-router";
import { type ComponentProps } from "react";
import { Pressable } from "react-native";

export function HeaderBackIcon({
  style,
  ...rest
}: IconProps<ComponentProps<typeof Ionicons>["name"]>) {
  return (
    <Pressable onPress={() => router.back()}>
      <Ionicons size={27} {...rest} color={Colors.primaryColor} />
    </Pressable>
  );
}
