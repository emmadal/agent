import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import useOneVisitByDate from "@/hooks/useOneVisitByDate";
import { getPreciseDistance } from "geolib";
import useToken from "@/hooks/useToken";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useLocalSearchParams, router } from "expo-router";
import useHeaderRouter from "@/hooks/useHeaderRoute";
import { Colors } from "@/constants/Colors";
import usePosition from "@/hooks/usePosition";
import Button from "@/components/Button";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";

const RoadAgency = () => {
  useHeaderRouter({ title: "" });
  const colorScheme = useColorScheme();
  useToken();
  const params = useLocalSearchParams();
  const agency = JSON.parse(params?.store as any);
  const { data } = useOneVisitByDate(agency && agency?.id);
  const position = usePosition();
  const [route, setRoute] = useState({ distanceMeters: 0, duration: "" });
  const [loading, setLoading] = useState(false);

  const handleCall = async (phone: string) => {
    const canOpen = await Linking.canOpenURL(phone);
    if (canOpen) {
      await Linking.openURL(phone);
    } else {
      Alert.alert("Appel téléphonique", "Impossible d'effectuer cette action");
    }
  };

  useEffect(() => {
    const calculateDistance = async () => {
      if (
        !position?.latitude ||
        !position?.longitude ||
        !agency?.latitude ||
        !agency?.longitude
      )
        return;

      setLoading(true);
      try {
        const apiKey = process.env.EXPO_PUBLIC_MAPS_API;

        if (!apiKey) {
          console.error("Google Maps API key is missing");
          fallbackToGeolibDistance();
          return;
        }

        // Using Routes API v2 instead of the legacy Distance Matrix API
        const url = `https://routes.googleapis.com/directions/v2:computeRoutes`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask":
              "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline",
          },
          body: JSON.stringify({
            origin: {
              location: {
                latLng: {
                  latitude: position.latitude,
                  longitude: position.longitude,
                },
              },
            },
            destination: {
              location: {
                latLng: {
                  latitude: agency.latitude,
                  longitude: agency.longitude,
                },
              },
            },
            travelMode: "DRIVE",
          }),
        });

        const data = await response.json();

        if (response.ok && data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          // Format duration from seconds to human-readable text
          const durationInSeconds = route.duration.replace("s", "");
          const minutes = Math.floor(durationInSeconds / 60);
          const hours = Math.floor(minutes / 60);
          const remainingMinutes = minutes % 60;

          const durationText =
            hours > 0
              ? `${hours} hr ${remainingMinutes} min`
              : `${minutes} min`;
         
          setRoute({
            distanceMeters: route.distanceMeters,
            duration: durationText,
          });
        } else {
          console.error("Routes API error:", data.error || "Unknown error");
          fallbackToGeolibDistance();
        }
      } catch (error) {
        console.error("Error fetching route data:", error);
        fallbackToGeolibDistance();
      } finally {
        setLoading(false);
      }
    };

    const fallbackToGeolibDistance = () => {
      const point1 = {
        latitude: position?.latitude!,
        longitude: position?.longitude!,
      };
      const point2 = {
        latitude: agency?.latitude,
        longitude: agency?.longitude,
      };
      const distance = getPreciseDistance(point1, point2, 1);

      setRoute({
        distanceMeters: distance,
        duration: "",
      });
    };

    if (
      position?.latitude &&
      position?.longitude &&
      agency?.latitude &&
      agency?.longitude
    ) {
      calculateDistance();
    }
  }, [
    agency?.latitude,
    agency?.longitude,
    position?.latitude,
    position?.longitude,
  ]);

  const openGoogleMaps = async () => {
    const scheme = Platform.select({
      ios: `maps://app?saddr=${position?.latitude}+${position?.longitude}&daddr=${agency?.latitude}+${agency?.longitude}`,
      android: `google.navigation:q=${agency?.latitude}+${agency?.longitude}`,
    });
    const canOpen = await Linking.canOpenURL(scheme!);
    if (canOpen) {
      await Linking.openURL(scheme!);
    } else {
      Alert.alert("Distance de la boutique", "Impossible de voir le trajet");
    }
  };

  const processDistance = () => {
    if (route?.distanceMeters >= 1000) {
      const result = Number(route?.distanceMeters / 1000).toFixed(3);
      return `${result} km`;
    }
    return `${route?.distanceMeters || 0} m`;
  };

  return (
    <ScrollView
      style={styles.scroll}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.contentContainer}
    >
      <ThemedView style={styles.header}>
        <ThemedText type="bold">{agency?.name}</ThemedText>
        <Button
          title="Appeler le gestionnaire"
          style={styles.call}
          onPress={() => handleCall(`tel:${agency?.phone_gerant}`)}
          icon="phone"
        />
      </ThemedView>
      <ThemedView
        style={[
          styles.info,
          {
            backgroundColor: colorScheme === "light" ? "white" : "transparent",
          },
        ]}
      >
        <ThemedView style={styles.viewaddress}>
          <Icon
            name="map-marker"
            size={17}
            color={Colors[colorScheme ?? "light"].text}
          />
          <ThemedText type="default">{agency?.address}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.data}>
          <ThemedView style={styles.row}>
            <ThemedText type="default">Distance</ThemedText>
            <ThemedText type="bold">{processDistance()}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.row}>
            <ThemedText type="default">Durée du trajet</ThemedText>
            <ThemedText type="bold">{route?.duration}</ThemedText>
          </ThemedView>
          <Button
            title="Contacter la boutique"
            style={[styles.call, { marginTop: 20 }]}
            onPress={() => handleCall(`tel:${agency?.phone_boutique}`)}
            icon="phone"
          />
        </ThemedView>
      </ThemedView>

      {data && data?.data?.length ? null : (
        <Pressable style={styles.distance}>
          <ThemedText
            lightColor={Colors.primaryColor}
            darkColor={Colors.primaryColor}
            type="defaultSemiBold"
            onPress={openGoogleMaps}
          >
            Commencez le trajet
          </ThemedText>
        </Pressable>
      )}
      <Image
        source={{ uri: agency?.picture }}
        accessibilityLabel="logo-agency"
        aria-label="logo-agency"
        alt="logo-agency"
        testID="logo-agency"
        style={styles.storeImg}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
      <ActivityIndicator
        style={styles.activityIndicator}
        color={Colors.primaryColor}
        animating={loading}
      />

      <ThemedText type="default" style={{ marginTop: 10 }}>
        {agency?.description}
      </ThemedText>
      {data && data?.data?.length ? (
        <ThemedText type="defaultSemiBold" style={styles.textVisit}>
          Vous avez déjà effectuée une visite aujourd&apos;hui.
        </ThemedText>
      ) : !route?.distanceMeters || Number(route?.distanceMeters) > 200 ? (
        <ThemedText type="defaultSemiBold" style={styles.errorVisit}>
          Vous ne pouvez pas effectuer de visite. Veuillez vous rapprochez de la
          boutique.
        </ThemedText>
      ) : (
        <Button
          style={styles.Viewbtn}
          title="Commencer la visite"
          onPress={() =>
            router.navigate({
              pathname: "/visit",
              params: { store: JSON.stringify(agency) },
            })
          }
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  distance: {
    alignSelf: "center",
    borderColor: "transparent",
    borderWidth: 0,
    marginTop: 20,
  },
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 5,
    backgroundColor: "transparent",
  },
  scroll: {
    flex: 1,
    padding: 20,
    backgroundColor: "transparent",
  },
  contentContainer: {
    flexGrow: 1,
    backgroundColor: "transparent",
  },
  row: {
    backgroundColor: "transparent",
    marginVertical: 5,
  },
  Viewbtn: {
    marginTop: 30,
    marginBottom: Platform.OS === "android" ? 80 : 45,
    alignSelf: "center",
    borderColor: "transparent",
    borderWidth: 0,
  },
  info: {
    borderWidth: 1,
    padding: 10,
    marginTop: 25,
    borderColor: "#DDDDE1",
  },
  data: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "transparent",
    marginLeft: 5,
    flexWrap: "wrap",
    marginTop: 5,
    marginBottom: 10,
  },
  textVisit: {
    color: "green",
    fontWeight: "600",
    marginTop: 30,
    marginBottom: 50,
  },
  errorVisit: {
    color: "red",
    fontWeight: "600",
    marginTop: 30,
    marginBottom: 50,
  },
  call: {
    borderColor: "transparent",
    alignSelf: "flex-end",
    width: Dimensions.get("screen").width / 2,
    marginVertical: 10,
  },
  viewaddress: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 10,
    alignItems: "center",
    flexWrap: "wrap",
  },
  activityIndicator: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 50,
    bottom: 50,
  },
  storeImg: {
    height: 270,
    borderRadius: 15,
    marginBottom: 20,
    marginTop: 30,
    alignSelf: "center",
    aspectRatio: 1,
  },
});

export default RoadAgency;
