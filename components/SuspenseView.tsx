import React from "react";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { ThemedView } from "./ThemedView";
import { StyleSheet, ActivityIndicator } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";
import { Button } from "react-native-paper";

type Props = {
  children: React.ReactNode;
  error: Error | null;
  isError: boolean;
  isPending: boolean;
  refetch: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<any, Error>>;
};

const SuspenseView = ({
  children,
  error,
  isError,
  isPending,
  refetch,
}: Props) => {
  const handleRefetch = async () => await refetch();

  if (isPending) {
    return (
      <ActivityIndicator
        size="large"
        color={Colors?.primaryColor}
        style={styles.spinner}
      />
    );
  }

  if (isError) {
    return (
      <ThemedView style={styles.viewError}>
        <ThemedText type="subtitle" style={styles.textError}>
          {error?.message || "Une erreur s'est produite."}
        </ThemedText>
        <Button
          onPress={handleRefetch}
          mode="contained"
          textColor={Colors.dark.text}
          buttonColor={Colors.primaryColor}
          style={styles.button}
        >
          Ressayer
        </Button>
      </ThemedView>
    );
  }

  return <ThemedView style={styles.container}>{children}</ThemedView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  ContainerStyle: {
    flexGrow: 1,
  },
  spinner: {
    alignSelf: "center",
    marginTop: 50,
  },
  viewError: {
    backgroundColor: "transparent",
    alignItems: "center",
    marginTop: 50,
  },
  textError: {
    color: "red",
    textAlign: "center",
  },
  button: {
    borderWidth: 0,
    borderColor: "transparent",
    marginTop: 20,
  },
});

export default SuspenseView;
