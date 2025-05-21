import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Platform,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import { editPasswordSchema } from "@/lib/schema";
import { useStoreApp } from "@/store";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { editPassword } from "@/api";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import useToken from "@/hooks/useToken";
import Input from "@/components/Input";
import Button from "@/components/Button";
import * as SecureStore from "expo-secure-store";
import { Colors } from "@/constants/Colors";
import { TextInput } from "react-native-paper";
import { BackHandler } from "@/components/BackHandler";

type Inputs = z.infer<typeof editPasswordSchema>;

const EditPassword = () => {
  const token = useToken();
  const store = useStoreApp((state) => state);
  const colorScheme = useColorScheme();
  const [hide, setHide] = useState(true);
  const [hide2, setHide2] = useState(true);

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isLoading, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(editPasswordSchema),
    mode: "onChange",
  });

  // send data to server
  const mutation = useMutation({
    mutationFn: async (input: Inputs) => {
      const data = {
        password: input.password,
        new_password: input.new_password,
      };
      const response = await editPassword(data, token || store?.token);
      return response;
    },
    onSuccess: async (data) => {
      if (!data?.success) {
        setError("root", {
          message: "Une erreur s'est produite. Veuillez ressayer plutard",
        });
        return;
      }
      Alert.alert(
        "Mot de passe",
        "Mot de passe modifié avec succès 🎉. Vous serez déconnectés dans quelques instants",
        [
          {
            onPress: async () => {
              store.signOut();
              await Promise.all([
                SecureStore.deleteItemAsync("credentials"),
                SecureStore.deleteItemAsync("agent_str"),
              ]);
            },
          },
        ],
        { cancelable: false },
      );
      return;
    },
    onError: async (error) => {
      setError("root", {
        message: error.message,
      });
    },
  });

  const handleForm = async (input: Inputs) => {
    mutation.mutate({ ...input });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboard}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, marginTop: 60 }}>
          <BackHandler title="Modifier le mot de passe" />
          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior="automatic"
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <ThemedView style={styles.viewInput}>
              <Controller
                control={control}
                name="password"
                rules={{ required: true }}
                render={({ field: { onBlur, onChange, value } }) => (
                  <Input
                    value={value}
                    onBlur={onBlur}
                    secure={hide}
                    onChangeText={onChange}
                    label="Mot de passe actuel*"
                    right={
                      <TextInput.Icon
                        icon={hide ? "eye-off-outline" : "eye-outline"}
                        onPress={() => setHide(!hide)}
                        color={Colors[colorScheme ?? "light"]?.text}
                      />
                    }
                  />
                )}
              />
              <ThemedText type="default" style={styles.error}>
                {errors?.password?.message}
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.viewInput}>
              <Controller
                control={control}
                name="new_password"
                rules={{ required: true }}
                render={({ field: { onBlur, onChange, value } }) => (
                  <Input
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    secure={hide2}
                    label="Nouveau mot de passe*"
                    right={
                      <TextInput.Icon
                        icon={hide2 ? "eye-off-outline" : "eye-outline"}
                        onPress={() => setHide2(!hide2)}
                        color={Colors[colorScheme ?? "light"]?.text}
                      />
                    }
                  />
                )}
              />
              <ThemedText type="default" style={styles.error}>
                {errors?.new_password?.message}
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.viewInput}>
              <Controller
                control={control}
                name="confirm_password"
                rules={{ required: true }}
                render={({ field: { onBlur, onChange, value } }) => (
                  <Input
                    value={value}
                    secure={hide2}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    label="Confirmez le mot de passe*"
                  />
                )}
              />
              <ThemedText type="default" style={styles.error}>
                {errors?.confirm_password?.message}
              </ThemedText>
            </ThemedView>
            <Button
              onPress={handleSubmit(handleForm)}
              title="Modifier le mot de passe"
              loading={mutation.isPending || isLoading || isSubmitting}
              disabled={mutation.isPending || isLoading || isSubmitting}
              style={styles.button}
            />
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 30,
  },

  select: {
    textAlign: "auto",
  },
  viewInput: {
    marginTop: 5,
    backgroundColor: "transparent",
  },
  error: {
    color: "red",
  },

  button: {
    marginTop: 23,
    marginBottom: Platform.select({
      android: 80,
      ios: 13,
    }),
    alignSelf: "center",
  },
  keyboard: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
    borderColor: "#DDDDE1",
    textAlign: "auto",
    fontSize: 17,
    lineHeight: 23,
    paddingHorizontal: 10,
  },
  row: {
    backgroundColor: "transparent",
  },
  label: {
    marginLeft: 7,
    marginBottom: 2,
  },
});

export default EditPassword;
