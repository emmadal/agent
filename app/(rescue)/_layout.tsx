import React from "react";
import { Redirect, Stack } from "expo-router";
import { useStoreApp } from "@/store";
export default function RescueLayout() {
  const session = useStoreApp((state) => state);

  if (session.isSignout || !session.token) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect key="login" href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
