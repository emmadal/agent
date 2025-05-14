import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";

const usePosition = () => {
  const [location, setLocation] = useState<Location.LocationObjectCoords>();

  useEffect(() => {
    (async () => {
      try {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (!permission.granted) {
          await Location.requestBackgroundPermissionsAsync();
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 100,
          timeInterval: 500,
        });
        setLocation(location.coords);
      } catch (error: any) {
        Alert.alert(
          "Erreur lors de la récupération de la position",
          error?.message,
        );
      }
    })();
  }, []);
  return location;
};

export default usePosition;
