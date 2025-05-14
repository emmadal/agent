import React, { useCallback, useMemo, useRef, useState } from "react";

import {
  Dimensions,
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  useColorScheme,
  ColorSchemeName,
  Image,
} from "react-native";
import { Searchbar } from "react-native-paper";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Colors } from "@/constants/Colors";
import SuspenseView from "@/components/SuspenseView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AgencyCard from "@/components/AgencyCard";
import useAgency from "@/hooks/useAgency";
import useToken from "@/hooks/useToken";
import { Agency } from "@/types/agency.type";
import Button from "@/components/Button";

// component to show when flatList data is empty
const ListEmptyStore = ({ colorScheme }: { colorScheme: ColorSchemeName }) => (
  <ThemedView style={styles.emptyView}>
    <Image
      source={require("@/assets/images/store_slash.png")}
      style={styles.emptyImg}
      resizeMode="cover"
      tintColor={Colors[colorScheme ?? "light"]?.text}
    />
    <ThemedText type="default">Aucune boutique trouvée</ThemedText>
  </ThemedView>
);

// render
const SheetRenderItem = ({
  item,
  handleClosePress,
}: {
  item: Agency;
  handleClosePress: any;
}) => (
  <ThemedView style={styles.itemContainer}>
    <ThemedText type="subtitle">{item.name}</ThemedText>
    <Image
      source={{ uri: item.picture }}
      style={styles.logo}
      alt="logo"
      resizeMode="cover"
    />
    <ThemedText type="default" style={styles.text}>
      {item.description}
    </ThemedText>
    {item?.phone_boutique && (
      <ThemedText type="default" style={styles.text}>
        Contact de la boutique : {item?.phone_boutique}
      </ThemedText>
    )}
    <ThemedText type="default" style={styles.text}>
      Adresse Géographique : {item.address}
    </ThemedText>
    <ThemedText type="default" style={styles.text}>
      Gestionnaire : {item.name_gerant}
    </ThemedText>
    <ThemedText type="default" style={styles.text}>
      Contact du gestionnaire : {item.phone_gerant}
    </ThemedText>
    <Button title="Fermez" onPress={handleClosePress} style={styles.close} />
  </ThemedView>
);

const Store = () => {
  useToken();
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sheetData, setSheetData] = useState([]);
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["50%", "90%"], []);
  const {
    data,
    error,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isFetching,
  } = useAgency();

  const handleSnapPress = useCallback((index: number) => {
    sheetRef.current?.expand();
  }, []);

  const handleClosePress = useCallback(() => {
    sheetRef.current?.forceClose();
  }, []);

  const filterResult = () => {
    const results = data?.pages.flatMap((page) => page.data);
    if (searchQuery || searchQuery.trim() !== "") {
      const searchResult = results?.filter((i) =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      return searchResult?.reverse();
    }
    return results?.reverse();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        Mes boutiques enregistrées
      </ThemedText>
      <Searchbar
        placeholder="Recherchez une boutique"
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
        isPending={isFetching}
        error={error}
        refetch={refetch}
      >
        <FlatList
          data={filterResult()}
          style={styles.flat}
          keyExtractor={(item) => String(item?.id)}
          contentContainerStyle={styles.ContainerStyle}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          renderItem={({ item }) => (
            <AgencyCard
              agency={item}
              onPress={handleSnapPress}
              setSheetData={setSheetData}
            />
          )}
          onEndReached={() => !isFetching && fetchNextPage()}
          onEndReachedThreshold={0.5}
          refreshing={true}
          ListEmptyComponent={<ListEmptyStore colorScheme={colorScheme} />}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator size="large" color={Colors?.primaryColor} />
            ) : null
          }
        />
      </SuspenseView>
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
      >
        <BottomSheetFlatList
          data={sheetData}
          keyExtractor={(i: Agency) => String(i?.id)}
          renderItem={({ item }) => (
            <SheetRenderItem item={item} handleClosePress={handleClosePress} />
          )}
          contentContainerStyle={[
            styles.contentContainer,
            {
              backgroundColor: Colors[colorScheme ?? "light"].background,
            },
          ]}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
        />
      </BottomSheet>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "transparent",
  },
  flat: {
    paddingTop: 20,
  },
  view: {
    flex: 1,
    backgroundColor: "transparent",
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
  text: {
    marginVertical: 10,
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
  inputSearch: {
    marginTop: 20,
    backgroundColor: "transparent",
    borderColor: "#DDDDE1",
    borderWidth: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  itemContainer: {
    padding: 10,
    margin: 6,
    backgroundColor: "transparent",
  },
  logo: {
    height: 250,
    aspectRatio: 1,
    marginVertical: 20,
    alignSelf: "center",
  },
  close: {
    marginTop: 20,
  },
});

export default Store;
