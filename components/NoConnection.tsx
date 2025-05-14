import { StyleSheet, useColorScheme } from "react-native";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import Icon from "react-native-vector-icons/Feather";
import { ThemedView } from "./ThemedView";

export default function NoConnection({ text }: { text: string }) {
  const colorScheme = useColorScheme();
  return (
    <ThemedView style={styles.container}>
      <Icon
        name="wifi-off"
        size={24}
        color={Colors[colorScheme ?? "light"].text}
      />
      <ThemedText type="subtitle" style={styles.text}>
        {text || "Vous n'êtes pas connecté à internet"}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 10,
  },
});
