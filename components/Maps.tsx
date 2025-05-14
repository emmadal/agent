import React, { memo, useMemo, useRef } from "react";
// import MapView from "react-native-map-clustering";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet } from "react-native";
import { Agency } from "@/types/agency.type";
import AgencyMarker from "./AgencyMarker";
import usePosition from "@/hooks/usePosition";

const Maps = ({ agencies }: { agencies: Agency[] }) => {
  const mapRef = useRef(null);
  const agencyList = useMemo(() => agencies, [agencies]);
  const position = usePosition();

  const markers = useMemo(
    () =>
      agencyList.map((agency, index) => (
        <AgencyMarker key={index} agency={agency} />
      )),
    [agencyList],
  );

  return (
    <MapView
      mapType="standard"
      ref={mapRef}
      cameraZoomRange={{
        minCenterCoordinateDistance: 18,
        maxCenterCoordinateDistance: 20,
      }}
      zoomControlEnabled
      zoomEnabled
      provider={PROVIDER_GOOGLE}
      showsUserLocation
      showsMyLocationButton
      loadingEnabled
      userLocationPriority="high"
      userLocationUpdateInterval={5000}
      style={styles.map}
      initialCamera={{
        center: {
          latitude: position?.latitude!,
          longitude: position?.longitude!,
        },
        pitch: 0,
        heading: 0,
        altitude: 0,
        zoom: 20,
      }}
    >
      <Marker
        coordinate={{
          latitude: position?.latitude!,
          longitude: position?.longitude!,
        }}
        tracksViewChanges={false}
        icon={require("@/assets/images/marker.png")}
      />
      {markers}
    </MapView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default memo(Maps);
