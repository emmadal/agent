import React from "react";
import { Colors } from "@/constants/Colors";
import {
  StyleProp,
  ViewStyle,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { TextInput, type TextInputProps } from "react-native-paper";

interface Props extends TextInputProps {
  /**
   * text label
   */
  label: string;
  /**
   * The value of the input component
   */
  value?: string;
  /**
   * Convert the input text into password input
   */
  secure?: boolean;

  /**
   * input placeholder
   */
  placeholder?: string;

  /**
   * Styles
   */
  style?: StyleProp<ViewStyle>;
}

export default function Input({
  label,
  value,
  secure,
  placeholder,
  style,
  ...rest
}: Props) {
  const colorScheme = useColorScheme();
  return (
    <View style={styles.container}>
      <ThemedText type="defaultSemiBold" style={styles.label}>
        {label}
      </ThemedText>
      <TextInput
        mode="outlined"
        style={[
          styles.input,
          {
            color: Colors[colorScheme ?? "light"]?.text,
            backgroundColor: colorScheme === "dark" ? "transparent" : "white",
          },
          style,
        ]}
        // placeholder={placeholder || label}
        value={value}
        secureTextEntry={secure ? true : false} // make this a prop for password input
        underlineColorAndroid="transparent"
        autoCapitalize="none"
        outlineColor="#DDDDE1"
        activeOutlineColor={Colors.primaryColor}
        activeUnderlineColor="transparent"
        underlineColor="transparent"
        selectionColor={Colors.primaryColor}
        textColor={Colors[colorScheme ?? "light"]?.text}
        aria-label={label}
        theme={{
          colors: {
            primary: Colors.primaryColor,
          },
        }}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    marginLeft: 7,
    marginBottom: 5,
  },
  input: {
    borderRadius: 10,
    borderColor: "#DDDDE1",
    textAlign: "auto",
    fontSize: 17,
  },
});
