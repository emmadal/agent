import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  View,
} from "react-native";
import useOneVisitByDate from "@/hooks/useOneVisitByDate";
import { getPreciseDistance, convertDistance } from "geolib";
import useToken from "@/hooks/useToken";
import { ThemedText } from "@/components/ThemedText";
import { useLocalSearchParams, router } from "expo-router";
import { Colors } from "@/constants/Colors";
import usePosition from "@/hooks/usePosition";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { BackHandler } from "@/components/BackHandler";
import { LinearGradient } from "expo-linear-gradient";
import { Card } from "react-native-paper";

const RoadAgency = () => {
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
      fallbackToGeolibDistance();
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
      const result = convertDistance(route?.distanceMeters, "km");
      return `${result.toFixed(3)} km`;
    }
    return `${route?.distanceMeters || 0} m`;
  };

  return (
    <View style={styles.container}>
      <BackHandler title={agency?.name} />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.contentContainer}
      >
        <Card style={styles.headerCard}>
          <LinearGradient
            colors={[Colors.light.tint, Colors.light.background]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
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
            
            <Card.Content style={styles.headerContent}>
              <ThemedText type="bold" style={styles.agencyName}>
                {agency?.name}
              </ThemedText>
              <View style={styles.viewaddress}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={18}
                  color={Colors[colorScheme ?? "light"].text}
                />
                <ThemedText type="default" style={styles.addressText}>
                  {agency?.address}
                </ThemedText>
              </View>
            </Card.Content>
          </LinearGradient>
        </Card>
        
        <Card style={styles.infoCard}>
          <Card.Title title="Informations" titleStyle={styles.cardTitle} />
          <Card.Content>
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <MaterialCommunityIcons name="map-marker-distance" size={24} color={Colors.primaryColor} />
                <View style={styles.infoTextContainer}>
                  <ThemedText type="default" style={styles.infoLabel}>Distance</ThemedText>
                  <ThemedText type="bold" style={styles.infoValue}>{processDistance()}</ThemedText>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.actionCard}>
          <Card.Content>
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleCall(`tel:${agency?.phone_gerant}`)}
              >
                <LinearGradient
                  colors={[Colors.primaryColor, Colors.primaryColor]}
                  style={styles.buttonGradient}
                >
                  <MaterialCommunityIcons name="phone" size={24} color="white" />
                  <ThemedText type="defaultSemiBold" style={styles.buttonText}>Appeler le gestionnaire</ThemedText>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleCall(`tel:${agency?.phone_boutique}`)}
              >
                <LinearGradient
                  colors={[Colors.primaryColor, Colors.primaryColor]}
                  style={styles.buttonGradient}
                >
                  <MaterialCommunityIcons name="store" size={24} color="white" />
                  <ThemedText type="defaultSemiBold" style={styles.buttonText}>Contacter la boutique</ThemedText>
                </LinearGradient>
              </TouchableOpacity>
              
              {(!data || !data?.data?.length) && (
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={openGoogleMaps}
                >
                  <LinearGradient
                    colors={[Colors.light.tint, Colors.primaryColor]}
                    style={styles.buttonGradient}
                  >
                    <MaterialCommunityIcons name="navigation-variant" size={24} color="white" />
                    <ThemedText type="defaultSemiBold" style={styles.buttonText}>Voir le trajet</ThemedText>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </Card.Content>
        </Card>
        
        {agency?.description && (
          <Card style={styles.descriptionCard}>
            <Card.Title title="Description" titleStyle={styles.cardTitle} />
            <Card.Content>
              <ThemedText type="default" style={styles.descriptionText}>
                {agency?.description}
              </ThemedText>
            </Card.Content>
          </Card>
        )}

        {data && data?.data?.length ? (
          <Card style={[styles.statusCard, styles.visitComplete]}>
            <Card.Content style={styles.statusContent}>
              <MaterialCommunityIcons name="check-circle" size={24} color="green" />
              <ThemedText type="defaultSemiBold" style={styles.textVisit}>
                Vous avez déjà effectuée une visite aujourd&apos;hui.
              </ThemedText>
            </Card.Content>
          </Card>
        ) : !route?.distanceMeters || route?.distanceMeters > 100 ? (
          <Card style={[styles.statusCard, styles.visitError, { marginBottom: 30 }]}>
            <Card.Content style={styles.statusContent}>
              <MaterialCommunityIcons name="alert-circle" size={24} color="red" />
              <ThemedText type="defaultSemiBold" style={styles.errorVisit}>
                Vous ne pouvez pas effectuer de visite. Veuillez vous rapprocher de
                la boutique.
              </ThemedText>
            </Card.Content>
          </Card>
        ) : (
          <TouchableOpacity
            style={styles.startVisitButton}
            onPress={() =>
              router.navigate({
                pathname: "/visit",
                params: { store: JSON.stringify(agency) },
              })
            }
          >
            <LinearGradient
              colors={[Colors.primaryColor, Colors.light.tint]}
              style={styles.visitButtonGradient}
            >
              <MaterialCommunityIcons name="clipboard-check" size={24} color="white" />
              <ThemedText type="bold" style={styles.visitButtonText}>
                Commencer la visite
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    marginTop: 60
  },
  scroll: {
    flex: 1,
    padding: 16,
    backgroundColor: "transparent",
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 80,
    backgroundColor: "transparent",
  },
  headerCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
  },
  headerGradient: {
    width: "100%",
    paddingTop: 16,
  },
  headerContent: {
    padding: 16,
  },
  agencyName: {
    fontSize: 22,
    marginBottom: 8,
    textAlign: "center",
  },
  storeImg: {
    height: 200,
    borderRadius: 12,
    marginHorizontal: 16,
    alignSelf: "center",
    width: "90%",
  },
  activityIndicator: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 100,
  },
  viewaddress: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  addressText: {
    marginLeft: 6,
    fontSize: 14,
  },
  infoCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  cardTitle: {
    fontSize: 18,
    color: Colors.primaryColor,
    fontWeight: "700",
  },
  infoContainer: {
    padding: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    opacity: 0.2,
    marginVertical: 8,
  },
  actionCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  buttonGroup: {
    gap: 12,
  },
  actionButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: "white",
    marginLeft: 12,
    fontSize: 16,
  },
  descriptionCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  descriptionText: {
    lineHeight: 22,
  },
  statusCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  statusContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  visitComplete: {
    borderLeftColor: "green",
    borderLeftWidth: 4,
  },
  visitError: {
    borderLeftColor: "red",
    borderLeftWidth: 4,
  },
  textVisit: {
    color: "green",
    marginLeft: 8,
    flex: 1,
  },
  errorVisit: {
    color: "red",
    marginLeft: 8,
    flex: 1,
  },
  startVisitButton: {
    marginVertical: 16,
    borderRadius: 16,
    overflow: "hidden",
    alignSelf: "center",
    width: "80%",
  },
  visitButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  visitButtonText: {
    color: "white",
    fontSize: 18,
    marginLeft: 8,
  }
});

export default RoadAgency;
