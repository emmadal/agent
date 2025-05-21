import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import React from "react";
import { Alert, Dimensions, Linking, StyleSheet } from "react-native";
import { Button as BtnRN } from "react-native-paper";
import Button from "@/components/Button";
import { BackHandler } from "@/components/BackHandler";

const Support = () => {
  const handleLink = async (link: string) => {
    const canOpen = await Linking.canOpenURL(link);
    if (canOpen) {
      await Linking.openURL(link);
    } else {
      Alert.alert(
        "Centre de Relation Client",
        "Impossible d'effectuer cette action",
      );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <BackHandler title="Centre de Relation Client" />
      <ThemedView style={styles.content}>
        <Button
          icon="phone"
          style={styles.button}
          title=" +225 2523010100"
          onPress={() => handleLink("tel:+2252523010100")}
        />
        <BtnRN
          buttonColor="green"
          textColor={Colors.dark.text}
          style={styles.button}
          icon="whatsapp"
          onPress={() => handleLink("whatsapp://send?phone=+2250708992223")}
        >
          +225 0708992223
        </BtnRN>
        <Button
          icon="email"
          style={styles.button}
          title="info@bigdataci.net"
          onPress={() => handleLink("mailto:info@bigdataci.net")}
        />
        <ThemedText type="default" style={styles.day}>
          Du Lundi au Vendredi: 08h - 17h
        </ThemedText>
        <ThemedText type="subtitle" style={styles.day}>
          Samedi et Dimanche: Fermés
        </ThemedText>
        <ThemedText type="subtitle" style={styles.day}>
          Jours fériés: Fermés
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:  60
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  button: {
    width: Dimensions.get("window").width / 1.7,
    alignSelf: "center",
    marginVertical: 20,
    borderRadius: 10,
  },
  day: {
    marginTop: 20,
  },
});

export default Support;
