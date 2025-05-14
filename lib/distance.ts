import { getDistanceMatrix } from "@/api";
import { LatLng } from "react-native-maps";

export const processFixedDistance = (distanceMeters: number) => {
  if (distanceMeters > 300) {
    return true;
  }
  return false;
};

export const fetchDistanceMatrix = async (position: LatLng, dest: LatLng) => {
  try {
    const origin = {
      location: {
        latLng: {
          latitude: position?.latitude,
          longitude: position?.longitude,
        },
      },
    };
    const destination = {
      location: {
        latLng: {
          latitude: dest?.latitude,
          longitude: dest?.longitude,
        },
      },
    };
    const res = await getDistanceMatrix(origin, destination);
    const distanceMeters = res?.routes?.[0]?.distanceMeters;
    return distanceMeters;
  } catch (e) {
    // Handle error
    console.error("fetchDistanceMatrix: ", e);
  }
};
