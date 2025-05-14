import React, { useCallback, useState } from "react";
import {
  Dimensions,
  RefreshControl,
  FlatList,
  Platform,
  StyleSheet,
  useColorScheme,
  Image,
  ColorSchemeName,
} from "react-native";
import { Colors } from "@/constants/Colors";
import SuspenseView from "@/components/SuspenseView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import useTeam from "@/hooks/useTeam";
import TeamUser from "@/components/TeamUser";
import useToken from "@/hooks/useToken";

// component to show when flatList data is empty
const EmptyCoworker = ({ colorScheme }: { colorScheme: ColorSchemeName }) => (
  <ThemedView style={styles.emptyView}>
    <Image
      source={require("@/assets/images/user_slash.png")}
      style={styles.emptyImg}
      tintColor={Colors[colorScheme ?? "light"]?.text}
    />
    <ThemedText type="default">Aucun coéquipier trouvé.</ThemedText>
  </ThemedView>
);

const Team = () => {
  useToken();
  const colorScheme = useColorScheme();
  const { data, error, isError, isPending, refetch } = useTeam();
  const [refreshing, setRefreshing] = useState(false);

  // function which trigger the pull refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    refetch()
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  }, [refetch]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        Mon équipe
      </ThemedText>
      <SuspenseView
        isError={isError}
        isPending={isPending}
        error={error}
        refetch={refetch}
      >
        <FlatList
          data={data?.data}
          style={styles.flat}
          contentContainerStyle={styles.ContainerStyle}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          keyExtractor={(item) => String(item?.id)}
          renderItem={({ item }) => <TeamUser data={item} />}
          ListEmptyComponent={<EmptyCoworker colorScheme={colorScheme} />}
          refreshing={true}
          refreshControl={
            <RefreshControl
              progressBackgroundColor={Colors?.primaryColor}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      </SuspenseView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "transparent",
  },
  flat: {
    paddingTop: 30,
  },
  ContainerStyle: {
    flexGrow: 1,
  },
  title: {
    fontWeight: "700",
    marginTop: Platform.select({
      ios: 50,
      android: 30,
    }),
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  button: {
    width: Dimensions.get("window").width / 1.7,
    alignSelf: "center",
    marginVertical: 20,
  },
  emptyView: {
    backgroundColor: "transparent",
    alignItems: "center",
    marginTop: 30,
  },
  emptyImg: {
    height: 50,
    aspectRatio: 1,
    alignSelf: "center",
    marginBottom: 10,
  },
});

export default Team;
