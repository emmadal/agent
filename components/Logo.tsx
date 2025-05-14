import { StyleProp, StyleSheet, Image, ImageStyle } from "react-native";

export default function Logo({ style }: { style?: StyleProp<ImageStyle> }) {
  return (
    <Image
      style={[styles.image, style]}
      source={require("@/assets/images/icon.png")}
      resizeMode="cover"
      accessibilityLabel="Logo"
      aria-label="logo"
      alt="logo"
      testID="logo"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    height: 100,
    aspectRatio: 1,
    backgroundColor: "transparent",
  },
});
