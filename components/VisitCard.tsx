import React from "react";
import { Platform, StyleSheet, useColorScheme, Image } from "react-native";
import { Avatar } from "react-native-paper";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Colors } from "@/constants/Colors";

const VisitCard = ({ data }: { data: any }) => {
  const colorScheme = useColorScheme();
  return (
    <ThemedView
      style={[
        styles.card,
        { borderColor: Colors[colorScheme ?? "light"]?.text },
      ]}
    >
      {/* {!data?.store?.picture ? (
        <Avatar.Text
          size={47}
          label={data?.store?.name}
          color={Colors[colorScheme ?? "light"]?.text}
          style={styles.avatar}
        />
      ) : (
        <Avatar.Image
          source={{ uri: data?.store?.picture }}
          size={47}
          style={styles.avatar}
        />
      )} */}
      <Avatar.Text
        size={47}
        label={data?.store?.name}
        color={Colors[colorScheme ?? "light"]?.text}
        style={styles.avatar}
      />
      <ThemedView style={styles.body}>
        <ThemedView style={styles.rows}>
          <ThemedText type="bold">Boutique</ThemedText>
          <ThemedText type="default">{data?.store?.name}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.rows}>
          <ThemedText type="bold">Montant</ThemedText>
          <ThemedText type="default">{data?.montant || 0} FCFA</ThemedText>
        </ThemedView>
        <ThemedView style={styles.rows}>
          <ThemedText type="bold">Produits</ThemedText>
          <ThemedText type="default">
            {data?.products?.length ? `${data?.products}` : "Aucun produit"}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.rows}>
          <ThemedText type="bold">Type de visite</ThemedText>
          <ThemedText type="default">{data?.typevisit?.libelle}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.rows}>
          <ThemedText type="bold">Emplacement</ThemedText>
          <ThemedText type="default">{data?.visibility?.libelle}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.rows}>
          <Image
            source={require("@/assets/images/pin.png")}
            style={styles.pin}
          />
          <ThemedText type="default">{data?.store?.address}</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "transparent",
    marginVertical: Platform.select({
      android: 30,
      ios: 15,
    }),
    borderWidth: 0.3,
  },
  body: {
    marginTop: 30,
    backgroundColor: "transparent",
  },
  rows: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 7,
    borderRadius: 5,
    marginVertical: 5,
  },
  title: {
    fontWeight: "700",
  },
  pin: {
    height: 20,
    width: 20,
    marginLeft: -5,
  },
  avatar: {
    alignSelf: "center",
    position: "absolute",
    marginTop: -20,
  },
});
export default VisitCard;
