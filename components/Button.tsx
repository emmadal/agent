import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  ViewStyle,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

interface Props extends PressableProps {
  /**
   * The label that will be rendered inside the component
   */
  title: string;
  /**
   * icon name
   */
  icon?: any;
  /**
   * show a spinner beside the title. (optional)
   */
  loading?: boolean;
  /**
   * Styles
   */
  style?: StyleProp<ViewStyle>;
}

const Button: React.FC<Props> = ({
  title,
  loading,
  style,
  onPress,
  icon,
  ...props
}: Props) => {
  const { width } = useWindowDimensions();
  return (
    <LinearGradient
      colors={["#3796CC", "#175E87"]}
      style={[styles.gradient, { width: width / 1.11 }, style]}
    >
      <Pressable
        style={styles.button}
        android_disableSound
        testID="button"
        onPress={onPress}
        {...props}
        aria-label={title}
        role="button"
        android_ripple={{
          color: "white",
          borderless: false,
        }}
      >
        {icon && <Icon name={icon} color={Colors.dark.text} size={15} />}
        <ThemedText
          lightColor={Colors.dark.text}
          darkColor={Colors.light.text}
          type="bold"
          style={{ fontSize: 14, color: "white" }}
        >
          {" "}
          {title}{" "}
        </ThemedText>
        {loading && typeof loading === "boolean" ? (
          <ActivityIndicator
            size="small"
            color="white"
            testID="loading"
            accessibilityRole="spinbutton"
          />
        ) : null}
      </Pressable>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    textAlign: "center",
    justifyContent: "center",
    padding: 7,
    borderColor: "transparent",
    alignItems: "center",
  },
  gradient: {
    borderRadius: 10,
    borderWidth: 0,
  },
});

export default Button;
