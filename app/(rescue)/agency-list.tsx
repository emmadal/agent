import React, { useMemo, useRef } from "react";
import { Dimensions, StyleSheet } from "react-native";
import RoadAgencyCard from "@/components/RoadAgencyCard";
import { ThemedView } from "@/components/ThemedView";
import useToken from "@/hooks/useToken";
import useMarket from "@/hooks/useMarket";
import SuspenseView from "@/components/SuspenseView";
import { Searchbar } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { BackHandler } from "@/components/BackHandler";
import { LegendList, LegendListRef } from "@legendapp/list";
import { ThemedText } from "@/components/ThemedText";

const AgencyList = () => {
  useToken();
  const { data, error, isError, isPending, refetch } = useMarket();
  const [searchQuery, setSearchQuery] = React.useState("");
  const listRef = useRef<LegendListRef | null>(null);

  const filterResult = useMemo(() => {
    let result = data;
    if (searchQuery || searchQuery.trim() !== "") {
      const searchResult = data?.filter(
        (i: any) =>
          i?.name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
          i?.phone_gerant?.includes(searchQuery?.toLowerCase()) ||
          i?.phone_boutique?.includes(searchQuery?.toLowerCase()),
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
        <LegendList
          data={filterResult}
          renderItem={RoadAgencyCard}
          // Recommended props (Improves performance)
          keyExtractor={(item) => String(item?.id)}
          recycleItems={true}
          // Recommended if data can change
          maintainVisibleContentPosition
          ref={listRef}
          ListEmptyComponent={
            <ThemedText type="defaultSemiBold" style={styles.emptyText}>
              Aucune boutique trouvée
            </ThemedText>
          }
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
    borderRadius: 50,
    width: Dimensions.get("window").width / 1.2,
    alignSelf: "center",
  },
  emptyText: {
    marginTop: 20,
    textAlign: "center",
  },
});
export default AgencyList;
