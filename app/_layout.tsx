import "expo-dev-client";
import { useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import type { AppStateStatus } from "react-native";
import { PaperProvider } from "react-native-paper";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import * as SplashScreen from "expo-splash-screen";
import { Alert, AppState, Platform, StatusBar } from "react-native";
import "react-native-reanimated";
import * as Updates from "expo-updates";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";
import { useStoreApp } from "@/store";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as SecureStore from "expo-secure-store";
import { login } from "@/api";
import NoConnection from "@/components/NoConnection";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create a client
const client = new QueryClient();

export default function RootLayout() {
  const { isConnected } = useNetInfo();
  const dark = useColorScheme() === "dark";
  const session = useStoreApp((state) => state);
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    MaximaNouva: require("../assets/fonts/MaximaNouva-Regular.otf"),
    MaximaNouvaBold: require("../assets/fonts/MaximaNouva-Bold.otf"),
    MaximaNouvaSemiBold: require("../assets/fonts/MaximaNouva-SemiBold.otf"),
  });

  const onAppStateChange = (status: AppStateStatus) => {
    if (Platform.OS !== "web") {
      focusManager.setFocused(status === "active");
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => subscription.remove();
  }, []);

  onlineManager.setEventListener((setOnline) => {
    return NetInfo.addEventListener((state) => {
      setOnline(!!state.isConnected);
    });
  });

  // Check for updates
  const onFetchUpdateAsync = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        Alert.alert(
          "Mise a jour",
          "Une mise à jour est disponible",
          [
            {
              text: "Annuler",
              style: "destructive",
            },
            {
              text: "Mettre à jour",
              style: "default",
              onPress: async () => {
                try {
                  await Updates.fetchUpdateAsync();
                  await Updates.reloadAsync();
                } catch (error) {
                  console.error("Error updating:", error);
                }
              },
            },
          ],
          { cancelable: false },
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Mise à jour",
        "Une erreur est survenue lors de la vérification de la mise à jour",
        [
          {
            text: "OK",
            style: "default",
          },
        ],
        { cancelable: false },
      );
    }
  };

  useEffect(() => {
    const bootstrapAsync = async () => {
      if (loaded) {
        setTimeout(async () => {
          SplashScreen.hideAsync();
        }, 1500);
        if (!session.isSignout) {
          const value = SecureStore.getItem("credentials");
          const user = JSON.parse(value as string);
          const data = await login(user.registration, user.password);
          session.updateToken(data?.token);
          router.replace("/(tabs)/home");
        }
      }
    };
    bootstrapAsync();
  }, [loaded]);

  useEffect(() => {
    onFetchUpdateAsync();
  }, []);

  if (!loaded) {
    return null;
  }

  return !isConnected ? (
    <NoConnection text="Vous n'êtes pas connecté à internet. Veuillez vérifier votre connexion internet pour continuer." />
  ) : (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={client}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <PaperProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </PaperProvider>
        </ThemeProvider>
      </QueryClientProvider>
      <StatusBar
        networkActivityIndicatorVisible
        backgroundColor={dark ? "black" : "white"}
        translucent
      />
    </GestureHandlerRootView>
  );
}
