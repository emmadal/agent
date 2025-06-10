import {
  StyleSheet,
  Platform,
  ScrollView,
  Pressable,
  useColorScheme,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Avatar, Divider } from "react-native-paper";
import { useStoreApp } from "@/store";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";
import useToken from "@/hooks/useToken";
import { useQueryClient } from "@tanstack/react-query";
import * as Updates from "expo-updates";

export default function Settings() {
  useToken();
  const store = useStoreApp((state) => state);
  const colorScheme = useColorScheme();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const logOut = async () => {
    store.signOut();
    await Promise.all([
      queryClient.cancelQueries(),
      SecureStore.deleteItemAsync("credentials"),
      SecureStore.deleteItemAsync("agent_str"),
    ]);
  };

    // Check for updates
    const onFetchUpdateAsync = async () => {
      try {
        // Show loading indicator
        setIsLoading(true);
        
        // Check for updates
        const update = await Updates.checkForUpdateAsync();
        
        // Hide loading indicator
        setIsLoading(false);
        
        if (update.isAvailable) {
          // Update is available
          Alert.alert(
            "Mise à jour",
            "Une nouvelle version de l'application est disponible. Voulez-vous la télécharger maintenant ?",
            [
              {
                text: "Plus tard",
                style: "cancel",
              },
              {
                text: "Mettre à jour",
                style: "default",
                onPress: async () => {
                  try {
                    // Show loading indicator during update
                    setIsLoading(true);
                    setLoadingText("Téléchargement de la mise à jour...");
                    
                    // Fetch and reload with the update
                    await Updates.fetchUpdateAsync();
                    
                    // Notify user before reloading
                    Alert.alert(
                      "Mise à jour",
                      "Mise à jour téléchargée avec succès. L'application va redémarrer.",
                      [{ text: "OK", onPress: () => Updates.reloadAsync() }],
                      { cancelable: false }
                    );
                  } catch (error) {
                    // Hide loading indicator
                    setIsLoading(false);
                    setLoadingText("");
                    
                    // Show specific error message
                    const errorMessage = error instanceof Error ? 
                      error.message : 
                      "Une erreur inattendue est survenue";
                      
                    Alert.alert(
                      "Échec de la mise à jour",
                      `Impossible de télécharger la mise à jour: ${errorMessage}`,
                      [{ text: "OK", style: "default" }],
                      { cancelable: false }
                    );
                  }
                },
              },
            ],
            { cancelable: false }
          );
          return;
        }
        
        // No update available
        Alert.alert(
          "Mise à jour",
          "Vous utilisez déjà la version la plus récente de l'application.",
          [{ text: "OK", style: "default" }],
          { cancelable: false }
        );
      } catch (error) {
        // Hide loading indicator
        setIsLoading(false);
        setLoadingText("");
        
        // Show specific error based on the error type
        let errorMessage = "Une erreur est survenue lors de la vérification de la mise à jour";
        
        // Check for network errors
        if (error instanceof Error) {
          if (error.message.includes("network") || error.message.includes("internet")) {
            errorMessage = "Impossible de vérifier les mises à jour. Veuillez vérifier votre connexion Internet.";
          } else {
            errorMessage = `Erreur: ${error.message}`;
          }
        }
        
        Alert.alert(
          "Échec de la vérification",
          errorMessage,
          [{ text: "OK", style: "default" }],
          { cancelable: false }
        );
      }
    };

  return (
    <>
      {isLoading && (
        <ThemedView style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors[colorScheme ?? "light"]?.tint} />
          {loadingText ? <ThemedText style={styles.loadingText}>{loadingText}</ThemedText> : null}
        </ThemedView>
      )}
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
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
        <Pressable style={styles.pressable} onPress={onFetchUpdateAsync}>
          <Ionicons
            name="reload"
            size={20}
            color={Colors[colorScheme ?? "light"]?.text}
          />
          <ThemedText type="default">Mise à jour</ThemedText>
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
    </>
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
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 16,
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
  version: {
    textAlign: "center",
    marginTop: 15,
  },
});
