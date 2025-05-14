import React, { useState } from "react";
import {
  StyleSheet,
  FlatList,
  Platform,
  Dimensions,
  ActivityIndicator,
  ColorSchemeName,
  Image,
  useColorScheme,
} from "react-native";
import { Button } from "react-native-paper";
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import useAllVisitByDate from "@/hooks/useVisitByDate";
import VisitCard from "@/components/VisitCard";
import { Colors } from "@/constants/Colors";
import { useQueryClient } from "@tanstack/react-query";
import useToken from "@/hooks/useToken";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import SuspenseView from "@/components/SuspenseView";

// component to show when flatList data is empty
const EmptyVisit = ({
  date,
  colorScheme,
}: {
  date: string;
  colorScheme: ColorSchemeName;
}) => (
  <ThemedView style={styles.emptyView}>
    <Image
      source={require("@/assets/images/book.png")}
      style={styles.emptyImg}
      tintColor={Colors[colorScheme ?? "light"]?.text}
    />
    <ThemedText type="default" style={styles.emptyTitle}>
      Aucune visite enregistrée le {date}
    </ThemedText>
  </ThemedView>
);

const Statistic = () => {
  useToken();
  const colorScheme = useColorScheme();
  const [date, setDate] = useState(new Date());
  const queryClient = useQueryClient();
  const {
    data,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    isError,
    refetch,
    error,
  } = useAllVisitByDate(date);

  const onChange = async (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined,
  ) => {
    const currentDate = selectedDate;
    setDate(currentDate!);
    await queryClient.invalidateQueries({
      queryKey: ["visit_date", date?.toISOString().split("T")[0]],
    });
  };

  const showMode = () => {
    DateTimePickerAndroid.open({
      testID: "datePicker",
      display: "default",
      value: date,
      onChange,
      mode: "date",
      is24Hour: true,
      maximumDate: new Date(),
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        Affichez les statistiques des visites en fonction d'une date
      </ThemedText>
      <ThemedText type="default" style={styles.desc}>
        Veuillez choisir une date ci-dessous :
      </ThemedText>
      {Platform.select({
        ios: (
          <DateTimePicker
            testID="datePicker"
            value={date}
            mode="date"
            is24Hour={true}
            onChange={onChange}
            style={styles.datePicker}
            locale="fr"
          />
        ),
        android: (
          <Button
            onPress={showMode}
            mode="contained"
            style={styles.selection}
            buttonColor={Colors.primaryColor}
            textColor={Colors.dark.text}
          >
            Sélectionnez la date ici
          </Button>
        ),
      })}
      {Platform.OS === "android" && (
        <ThemedText type="subtitle" style={styles.date}>
          Date: {date.toLocaleDateString("fr")}
        </ThemedText>
      )}
      {data && data?.pages.flatMap((page) => page)?.length ? (
        <ThemedText type="default" style={styles.result}>
          {data?.pages.flatMap((page) => page)?.length} visite trouvée(s)
        </ThemedText>
      ) : null}
      <SuspenseView
        isError={isError}
        isPending={isFetching}
        error={error}
        refetch={refetch}
      >
        <FlatList
          data={data?.pages.flatMap((page) => page)}
          style={styles.flatList}
          contentContainerStyle={styles.contentContainerStyle}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          keyExtractor={(item) => String(item?.id)}
          renderItem={({ item }) => <VisitCard data={item} />}
          onEndReached={() => !isFetching && fetchNextPage()}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <EmptyVisit
              date={date.toLocaleDateString("fr")}
              colorScheme={colorScheme}
            />
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator size="large" color={Colors?.primaryColor} />
            ) : null
          }
        />
      </SuspenseView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 30,
    backgroundColor: "transparent",
  },
  flatList: {
    paddingTop: 10,
  },
  title: {
    fontWeight: "700",
    marginTop: Platform.select({
      ios: 50,
      android: 30,
    }),
  },
  spin: {
    marginTop: 20,
  },
  desc: {
    marginTop: 5,
  },
  datePicker: {
    alignSelf: "center",
    marginTop: 25,
  },
  contentContainerStyle: {
    flexGrow: 1,
  },
  emptyView: {
    backgroundColor: "transparent",
    alignItems: "center",
    marginTop: Platform.select({
      android: 10,
      ios: 20,
    }),
  },
  emptyImg: {
    height: 30,
    aspectRatio: 1,
    justifyContent: "center",
  },
  emptyTitle: {
    fontWeight: "600",
    marginTop: 20,
  },
  result: {
    fontWeight: "600",
    color: "green",
    marginTop: Platform.select({
      ios: 10,
      android: -10,
    }),
    alignSelf: "center",
  },
  date: {
    fontWeight: "700",
    marginVertical: 20,
    alignSelf: "center",
  },
  selection: {
    width: Dimensions.get("window").width / 1.8,
    alignSelf: "center",
    marginTop: 30,
    borderColor: "transparent",
    borderWidth: 0,
  },
});

export default Statistic;
