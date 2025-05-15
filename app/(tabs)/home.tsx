import React, { useState, memo } from "react";
import { Dimensions, Platform, StyleSheet } from "react-native";
import { Snackbar, FAB } from "react-native-paper";
import { getAllStoreByPerson } from "@/api";
import useToken from "@/hooks/useToken";
import { useStoreApp } from "@/store";
import { ThemedView } from "@/components/ThemedView";
// import { GoogleMaps, AppleMaps } from "expo-maps";
import { router } from "expo-router";
import Button from "@/components/Button";
import { Agency } from "@/types/agency.type";
import usePosition from "@/hooks/usePosition";

const ShowAgency = memo(({ agencies }: { agencies: Agency[] }) => {
  return (
    <Button
      title={`${agencies?.length} boutique(s)`}
      style={styles.agencies}
      onPress={() => router.navigate("/(rescue)/agency-list")}
      icon="greenhouse"
    />
  );
});

ShowAgency.displayName = "ShowAgency";

const Home = memo(() => {
  const token = useToken();
  const [data, setData] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const store = useStoreApp((state) => state);
  const position = usePosition();

  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  const getStoreSaved = async () => {
    setLoading(!loading);
    const response = await getAllStoreByPerson(token || store.token);
    if (response?.length) {
      setData(response);
      setLoading(false);
      onToggleSnackBar();
      return;
    }
    setLoading(false);
    onToggleSnackBar();
    return;
  };

  return (
    <ThemedView style={styles.container}>
      {/* {Platform.OS === "android" ? <GoogleMaps.View
        style={{ flex: 1 }}
        cameraPosition={{
          coordinates: {
            latitude: position?.latitude!,
            longitude: position?.longitude!,
          },
          zoom: 18,
        }}
        markers={data?.map((store) => ({
          title: store.name,
          coordinates: {
            latitude: store.latitude,
            longitude: store.longitude,
          },
          showCallout: true,
        }))}
        properties={{
          isMyLocationEnabled: true,
        }}
      /> : <AppleMaps.View
        style={{ flex: 1 }}
        cameraPosition={{
          coordinates: {
            latitude: position?.latitude!,
            longitude: position?.longitude!,
          },
          zoom: 18,
        }}
        markers={data?.map((store) => ({
          title: store.name,
          coordinates: {
            latitude: store.latitude,
            longitude: store.longitude,
          },
          showCallout: true,
        }))}
        properties={{
          selectionEnabled: true,
        }}
      />} */}
      {data?.length ? <ShowAgency agencies={data} /> : null}
      <Button
        loading={loading}
        title={loading ? "Patientez..." : "Affichage des boutiques"}
        disabled={loading}
        onPress={getStoreSaved}
        style={styles.btn}
      />
      <FAB
        icon="plus"
        size="small"
        variant="surface"
        style={styles.fab}
        onPress={() => router.navigate("/(rescue)/new-store")}
      />
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: "Fermer",
          onPress: () => onDismissSnackBar(),
        }}
      >
        {data?.length
          ? `${data?.length} boutique(s) trouvée(s)`
          : "Aucune boutique trouvée"}
      </Snackbar>
    </ThemedView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    margin: 20,
    right: 0,
    bottom: 50,
  },
  drawer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 70 : 50,
    left: 20,
    elevation: 10,
    flexGrow: 1,
  },
  agencies: {
    position: "absolute",
    top: 90,
    right: 20,
    elevation: 10,
    width: Dimensions.get("window").width / 2.5,
  },
  btn: {
    flex: 1,
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    borderColor: "transparent",
    borderWidth: 0,
    width: Dimensions.get("window").width / 1.9,
  },
  marker: {
    width: 30,
    height: 30,
  },
});

Home.displayName = "Home";
export default Home;
