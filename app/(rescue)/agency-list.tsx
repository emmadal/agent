import React, { useMemo } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import RoadAgencyCard from "@/components/RoadAgencyCard";
import { ThemedView } from "@/components/ThemedView";
import useToken from "@/hooks/useToken";
import useMarket from "@/hooks/useMarket";
import SuspenseView from "@/components/SuspenseView";
import { Searchbar } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { BackHandler } from "@/components/BackHandler";

const AgencyList = () => {
  useToken();
  const { data, error, isError, isPending, refetch } = useMarket();
  const [searchQuery, setSearchQuery] = React.useState("");

  const filterResult = useMemo(() => {
    let result = data;
    if (searchQuery || searchQuery.trim() !== "") {
      const searchResult = data?.filter((i: any) =>
        i?.name.toLowerCase().includes(searchQuery?.toLowerCase()),
      );
      result = searchResult?.reverse();
    }
    return result;
  }, [data, searchQuery]);

  return (
    <ThemedView style={styles.container}>
      <BackHandler title="Boutiques trouvées" />
      <Searchbar
        placeholder="Rechercher une boutique"
        onChangeText={setSearchQuery}
        value={searchQuery}
        icon={undefined}
        style={styles.inputSearch}
        iconColor={Colors.primaryColor}
        selectionColor={Colors.primaryColor}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
      />
      <SuspenseView
        isError={isError}
        isPending={isPending}
        error={error}
        refetch={refetch}
      >
        <Animated.FlatList
          refreshing={isPending}
          onRefresh={refetch}
          data={filterResult}
          keyExtractor={(data) => String(data?.id!)}
          renderItem={({ item }) => <RoadAgencyCard agency={item} />}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.ContainerStyle}
        />
      </SuspenseView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  ContainerStyle: {
    flexGrow: 1,
  },
  inputSearch: {
    marginTop: 20,
    backgroundColor: "transparent",
    borderColor: "#808080",
    borderWidth: 1,
    borderRadius: 5,
    width: Dimensions.get("window").width / 1.2,
    alignSelf: "center",
  },
});
export default AgencyList;
