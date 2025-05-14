import React, { useState, useEffect } from "react";
import { StyleSheet, useColorScheme, BackHandler } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import Logo from "@/components/Logo";
import * as SecureStore from "expo-secure-store";
import { TextInput } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/schema";
import { login } from "@/api";
import { useStoreApp } from "@/store";
import { ThemedText } from "@/components/ThemedText";
import { useMutation } from "@tanstack/react-query";
import { router, usePathname } from "expo-router";
import Button from "@/components/Button";
import * as Location from "expo-location";

type Inputs = z.infer<typeof loginSchema>;

const Login = () => {
  const updateState = useStoreApp((state) => state.updateState);
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const [hide, setHide] = useState(true);
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isLoading, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: async (input: Inputs) => {
      const [response] = await Promise.all([
        login(input.registration_number.trim(), input.password.trim()),
        SecureStore.setItemAsync(
          "credentials",
          JSON.stringify({
            registration: input.registration_number.trim(),
            password: input.password.trim(),
          }),
        ),
      ]);
      return response;
    },
    onSuccess: async (data) => {
      if (data?.code === 401 || data?.code === 403) {
        setError("root", {
          message: data?.message,
        });
        await SecureStore.deleteItemAsync("credentials");
        return;
      }
      reset();
      updateState({
        user: data?.data?.user,
        team: data?.data?.teams[0],
        token: data?.token,
      });
      router.replace("/(tabs)/home");
    },
    onError: async () => {
      await SecureStore.deleteItemAsync("credentials");
    },
  });

  const handleForm = async (input: Inputs) => {
    await mutation.mutateAsync({ ...input });
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (pathname === "/") {
          BackHandler.exitApp();
          return true;
        }
      },
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    (async () => {
      const permission = await Location.getForegroundPermissionsAsync();
      if (!permission.granted) {
        await Location.requestForegroundPermissionsAsync();
      }
    })();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <Logo style={styles.logo} />

      <ThemedView style={styles.viewHeadline}>
        <ThemedText type="defaultSemiBold"> Démarrez avec </ThemedText>
        <ThemedText type="subtitle" style={styles.desc}>
          Agent Tracker
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.subView}>
        <ThemedText type="subtitle">Connectez vous</ThemedText>
        <ThemedText type="default">Bienvenue, vous nous avez manqué</ThemedText>
      </ThemedView>

      <ThemedView>
        <Controller
          name="registration_number"
          control={control}
          rules={{ required: true }}
          render={({ field: { onBlur, onChange, value } }) => (
            <TextInput
              value={value?.trim()}
              onBlur={onBlur}
              onChangeText={onChange}
              keyboardType="default"
              mode="flat"
              inputMode="text"
              textColor={Colors[colorScheme ?? "light"].text}
              label="Numéro identifiant*"
              style={styles.textInput}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              selectionColor={Colors.primaryColor}
              theme={{
                colors: {
                  primary: Colors.primaryColor,
                },
              }}
            />
          )}
        />
        <ThemedText type="default" style={styles.error}>
          {errors.registration_number?.message}
        </ThemedText>
      </ThemedView>

      <ThemedView>
        <Controller
          name="password"
          control={control}
          rules={{ required: true, maxLength: 10, max: 10 }}
          render={({ field: { onBlur, onChange, value } }) => (
            <TextInput
              value={value?.trim()}
              onBlur={onBlur}
              onChangeText={onChange}
              secureTextEntry={hide}
              mode="flat"
              textColor={Colors[colorScheme ?? "light"].text}
              inputMode="text"
              label="Mot de passe*"
              style={styles.textInput}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              selectionColor={Colors.primaryColor}
              left={
                <TextInput.Icon
                  icon="lock-outline"
                  color={Colors[colorScheme ?? "light"]?.text}
                  style={{ marginBottom: -10 }}
                />
              }
              right={
                <TextInput.Icon
                  icon={hide ? "eye-off-outline" : "eye-outline"}
                  onPress={() => setHide(!hide)}
                  color={Colors[colorScheme ?? "light"]?.text}
                  style={{ marginBottom: -10 }}
                />
              }
              theme={{
                colors: {
                  primary: Colors.primaryColor,
                },
              }}
            />
          )}
        />
        <ThemedText type="default" style={styles.error}>
          {errors.password?.message}
        </ThemedText>
      </ThemedView>

      <Button
        title="Se connecter"
        style={styles.button}
        loading={mutation.isPending || isSubmitting || isLoading}
        disabled={mutation.isPending || isSubmitting || isLoading}
        onPress={handleSubmit(handleForm)}
      />
      {(mutation.isError && mutation?.error) || errors.root?.message ? (
        <ThemedText type="default" style={styles.errorlogin}>
          {mutation.error?.message || errors?.root?.message}
        </ThemedText>
      ) : null}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
  textInput: {
    textAlign: "auto",
    backgroundColor: "transparent",
    fontSize: 17,
    marginTop: 10,
  },
  subView: {
    marginBottom: 10,
    backgroundColor: "transparent",
  },
  viewHeadline: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    backgroundColor: "transparent",
    marginTop: 10,
  },
  logo: {
    alignSelf: "center",
  },
  desc: {
    fontWeight: "500",
  },
  title: {
    fontWeight: "800",
  },
  inputWrap: {
    flex: 1,
    marginLeft: 5,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  error: {
    color: "red",
    marginVertical: 3,
  },
  button: {
    alignSelf: "center",
    marginTop: 20,
  },
  errorlogin: {
    color: "red",
    fontSize: 15,
    marginTop: 10,
    textAlign: "center",
  },
});

export default Login;
