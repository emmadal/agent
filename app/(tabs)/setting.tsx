import {
  StyleSheet,
  Platform,
  ScrollView,
  Pressable,
  useColorScheme,
} from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Avatar, Divider } from "react-native-paper";
import { useStoreApp } from "@/store";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";
import useToken from "@/hooks/useToken";
import { useQueryClient } from "@tanstack/react-query";

export default function Settings() {
  useToken();
  const store = useStoreApp((state) => state);
  const colorScheme = useColorScheme();
  const queryClient = useQueryClient();

  const logOut = async () => {
    store.signOut();
    await Promise.all([
      queryClient.cancelQueries(),
      SecureStore.deleteItemAsync("credentials"),
      SecureStore.deleteItemAsync("agent_str"),
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="always"
      contentContainerStyle={styles.ContainerStyle}
    >
      <ThemedView style={styles.nameContainer}>
        {store?.user?.picture ? (
          <Avatar.Image size={35} source={{ uri: store?.user?.picture }} />
        ) : (
          <Avatar.Text size={35} label="XD" />
        )}
        <Pressable onPress={() => router.navigate("/(tabs)/profile")}>
          <ThemedText type="subtitle">
            {store?.user.first_name} {store?.user?.last_name}
          </ThemedText>
          <ThemedText type="link">{store?.user.email}</ThemedText>
        </Pressable>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Pressable
          style={styles.pressable}
          onPress={() => router.navigate("/(rescue)/edit-password")}
        >
          <Ionicons
            name="lock-closed"
            size={20}
            color={Colors[colorScheme ?? "light"]?.text}
          />
          <ThemedText type="default">Modifier mot de passe</ThemedText>
        </Pressable>
        <Divider />
        {/* <Pressable style={styles.pressable}>
          <Ionicons
            name="sparkles-sharp"
            size={20}
            color={Colors[colorScheme ?? "light"]?.text}
          />
          <ThemedText type="default">Signalez un problème</ThemedText>
        </Pressable>
        <Divider /> */}
        <Pressable
          style={styles.pressable}
          onPress={() => router.navigate("/terms")}
        >
          <Ionicons
            name="book-sharp"
            size={20}
            color={Colors[colorScheme ?? "light"]?.text}
          />
          <ThemedText type="default">{`Termes & Conditions`}</ThemedText>
        </Pressable>
        <Divider />
        <Pressable
          style={styles.pressable}
          onPress={() => router.navigate("/support")}
        >
          <Ionicons
            name="help-buoy-outline"
            size={20}
            color={Colors[colorScheme ?? "light"]?.text}
          />
          <ThemedText type="default">Support</ThemedText>
        </Pressable>
        <Divider />
        <Pressable style={styles.pressable} onPress={logOut}>
          <Ionicons
            name="power"
            size={20}
            color={Colors[colorScheme ?? "light"]?.text}
          />
          <ThemedText type="default">Déconnexion</ThemedText>
        </Pressable>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    paddingTop: Platform.select({
      android: 70,
      ios: 40,
    }),
  },
  title: {
    fontWeight: "700",
    marginBottom: 50,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 15,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    marginTop: 20,
  },
  ContainerStyle: {
    flexGrow: 1,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  registration: {
    marginTop: -10,
  },
  pressable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 5,
    marginVertical: 15,
  },
});
