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
import { AppState, Platform, StatusBar } from "react-native";
import "react-native-reanimated";
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
