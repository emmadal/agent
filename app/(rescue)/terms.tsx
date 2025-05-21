import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { BackHandler } from "@/components/BackHandler";

const Terms = () => {
  return (
    <View style={{ flex: 1, marginTop: 60 }}>
      <BackHandler title="Conditions générales" />
      <ScrollView
        style={styles.Scrollcontainer}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.ContainerStyle}
      >
        <ThemedView style={styles.section}>
          <ThemedText type="bold" style={styles.title}>
            1. Collecte d&#39;information
          </ThemedText>
          <ThemedText type="default" style={styles.content}>
            AGENT TRACKER est une application qui sert répertorié les points de
            vente et suivre la performance du travail des agents sur le terrain.
            Nous recueillons des informations lorsque vous vous inscrivez sur
            notre application mais ces informations sont stockées dans l’espace
            web crée pour votre entreprise. Vous avez accès à vos données à tout
            moment
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.section}>
          <ThemedText type="bold" style={styles.title}>
            2. Utilisation des informations
          </ThemedText>
          <ThemedText type="default" style={styles.content}>
            Toutes les informations que nous recueillons auprès de vous sont
            utilisées uniquement pour suivre l’activité de vos agents sur le
            terrain. Aucun autre usage ne se fait avec ces données qui restent
            entièrement votre propriété
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.section}>
          <ThemedText type="bold" style={styles.title}>
            3. Divulgation à des tiers
          </ThemedText>
          <ThemedText type="default" style={styles.content}>
            Vous sommes les seuls propriétaires des informations recueillies via
            l’application, nous en faisons juste la conservation sur nos
            serveurs. Vos informations personnelles et commerciales ne seront ni
            vendues, ni échangées, ni transférées, ou données à une autre
            société pour n’importe quelle raison.
          </ThemedText>
          <ThemedText type="default" style={styles.content}>
            Nous pensons qu’il est nécessaire de partager ces informations
            uniquement afin d’enquêter, de prévenir ou de prendre des mesures
            concernant des activités illégales, fraudes présumées, situations
            impliquant des menaces potentielles à la sécurité physique de toute
            personne, violations de nos conditions d’utilisation, ou quand la
            loi nous y contraint. Même dans ces cas, votre accord préalable sera
            sollicité avant transmission de ces informations.
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.section}>
          <ThemedText type="bold" style={styles.title}>
            4. Protection des informations
          </ThemedText>
          <ThemedText type="default" style={styles.content}>
            Nous mettons en œuvre une variété de mesures de sécurité pour
            préserver la sécurité de vos informations personnelles. Nous
            utilisons un cryptage à la pointe de la technologie pour protéger
            les informations sensibles transmises via l’application. Nous
            protégeons également vos informations hors ligne. Pour plus de
            confidentialités nos employés opérant dans votre pays d’exercice ne
            sont pas autorisées à avoir accès à ces informations. Seuls les
            employés de nos filiales d’autres peuvent pourront en cas de besoin
            y avoir accès pour des besoins d’assistance demandées par
            vous-mêmes.
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.section}>
          <ThemedText type="bold" style={styles.title}>
            5. Se désabonner
          </ThemedText>
          <ThemedText type="default" style={styles.content}>
            L’utilisation de l’application relève à tout moment de votre action,
            aucune collecte d’informations n’est possible sans votre action
            personnelle. Le désabonnement peut se faire par vous à tout moment
            en envoyant un email à notre service commercial. La non utilisation
            de l’application sur une longue durée pourrait aussi s’apparenter à
            un désabonnement
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.section}>
          <ThemedText type="bold" style={styles.title}>
            6. Consentement
          </ThemedText>
          <ThemedText type="default" style={styles.content}>
            En utilisant notre application, vous consentez à notre politique de
            confidentialité.
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  Scrollcontainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
    backgroundColor: "transparent",
  },
  ContainerStyle: {
    flexGrow: 1,
  },
  title: {
    marginBottom: 10,
    backgroundColor: "transparent",
    fontWeight: "bold",
  },
  content: {
    backgroundColor: "transparent",
  },
  section: {
    marginVertical: 10,
    backgroundColor: "transparent",
  },
});

export default Terms;
