import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Agent Tracker",
  slug: "agent-tracker",
  githubUrl: "https://github.com/emmadal/agent",
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    allowBackup: true,
    permissions: [
      "android.permission.INTERNET",
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.ACCESS_COARSE_LOCATION",
      "android.permission.CAMERA",
      "android.permission.CAMERA_ROLL",
      "android.permission.READ_MEDIA_IMAGES",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.FOREGROUND_SERVICE",
      "android.permission.FOREGROUND_SERVICE_LOCATION",
    ],
    package: "com.agent.tracker",
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_MAPS_API as string,
      },
    },
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
    },
  },
});
