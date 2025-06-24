import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Agent Tracker",
  slug: "agent-tracker",
  version: "2.0.0",
  owner: "emmadal",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "agent",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  description:
    "Agent tracker vous permet de garder le contact avec vos clients malgré le départ d'un commercial. Traquer vos points de vente et la présence de vos commerciaux sur le terrain n'est plus un mythe avec Agent Tracker",
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    allowBackup: true,
    permissions: [
      "android.permission.INTERNET",
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.CAMERA",
      "android.permission.READ_MEDIA_IMAGES", // Android 13+
    ],
    package: "com.agent.tracker",
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_MAPS_API as string,
      },
    },
    edgeToEdgeEnabled: true,
  },
  ios: {
    bundleIdentifier: "com.agent.tracker",
    config: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_MAPS_API as string,
    },
    supportsTablet: true,
    infoPlist: {
      UIBackgroundModes: ["location", "fetch"],
      ITSAppUsesNonExemptEncryption: false,
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: true,
      },
    },
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    "expo-secure-store",
    "expo-web-browser",
    [
      "expo-maps",
      {
        requestLocationPermission: "true",
        locationPermission: "Allow $(PRODUCT_NAME) to use your location",
      },
    ],
    [
      "expo-location",
      {
        locationWhenInUsePermission:
          "Autoriser $(PRODUCT_NAME) à utiliser votre position",
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission: "Autoriser $(PRODUCT_NAME) à accéder à vos photos",
        cameraPermission: "Autoriser $(PRODUCT_NAME) à utiliser votre caméra",
      },
    ],
    [
      "expo-build-properties",
      {
        android: {
          usesCleartextTraffic: true,
        },
        ios: {
          deploymentTarget: "15.1",
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  extra: {
    router: {},
    eas: {
      projectId: "d07428fa-4fe0-46cf-b963-01a2c3974b54",
    },
  },
  updates: {
    url: "https://u.expo.dev/d07428fa-4fe0-46cf-b963-01a2c3974b54",
  },
});
