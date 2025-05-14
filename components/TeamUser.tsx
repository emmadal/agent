import React from "react";
import {
  StyleSheet,
  useColorScheme,
  Linking,
  Alert,
  Pressable,
} from "react-native";
import { Avatar } from "react-native-paper";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const TeamUser = ({ data }: { data: any }) => {
  const colorScheme = useColorScheme();

  const getLabelName = () => {
    return `${data?.userrole?.user?.first_name
      .trim()
      .charAt(0)} ${data?.userrole?.user?.last_name.trim().charAt(0)}`;
  };

  const handleCall = async () => {
    const canOpen = await Linking.canOpenURL(
      `tel:${data?.userrole?.user?.phone_number}`,
    );
    if (canOpen) {
      await Linking.openURL(`tel:${data?.userrole?.user?.phone_number}`);
    } else {
      Alert.alert("Appel téléphonique", "Impossible d'effectuer cette action");
    }
  };

  return (
    <ThemedView
      style={[
        styles.container,
        { borderColor: Colors[colorScheme ?? "light"]?.text },
      ]}
    >
      <ThemedView style={styles.info}>
        {!data?.userrole?.user?.picture ? (
          <Avatar.Text
            size={48}
            label={getLabelName()}
            color={Colors[colorScheme ?? "light"]?.text}
          />
        ) : (
          <Avatar.Image
            source={{ uri: data?.userrole?.user?.picture }}
            size={48}
          />
        )}
        <ThemedView style={styles.viewName}>
          <ThemedText type="bold">
            {data?.userrole?.user?.first_name} {data?.userrole?.user?.last_name}
          </ThemedText>
          <ThemedView style={styles.email}>
            <Icon
              name="email"
              size={20}
              color={Colors[colorScheme ?? "light"]?.text}
            />
            <ThemedText type="link">{data?.userrole?.user?.email}</ThemedText>
          </ThemedView>
          <Pressable style={styles.icon} onPress={handleCall}>
            <Icon name="phone-outgoing" size={20} color={Colors.primaryColor} />
          </Pressable>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: "transparent",
    marginVertical: 15,
    borderWidth: 0.3,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  icon: {
    borderRadius: 50,
    height: 30,
    width: 30,
  },
  nameView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  email: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  info: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "transparent",
  },
  viewName: {
    marginLeft: 10,
    backgroundColor: "transparent",
    gap: 5,
  },
  avatar: {
    borderWidth: 2,
    borderColor: "rgba(0,0,0,.3)",
  },
  location: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginLeft: 10,
    marginTop: 15,
    backgroundColor: "transparent",
  },
  pin: {
    height: 20,
    width: 20,
  },
  call: {
    borderColor: "transparent",
    borderWidth: 0,
    alignSelf: "flex-start",
    marginTop: 10,
    marginLeft: 50,
  },
});
export default TeamUser;
