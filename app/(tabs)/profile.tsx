import React, { memo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Platform,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Snackbar, Avatar } from "react-native-paper";
import { userSchema } from "@/lib/schema";
import { useStoreApp } from "@/store";
import { z } from "zod";
import * as ImagePicker from "expo-image-picker";
import { useMutation } from "@tanstack/react-query";
import { updateUserProfile, uploadCldFile } from "@/api";
import useToken from "@/hooks/useToken";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import Button from "@/components/Button";
import Input from "@/components/Input";

type Inputs = z.infer<typeof userSchema>;
const PHOTO_MAX_SIZE = 10000000; // 10mb

const Profile = () => {
  useToken();
  const user = useStoreApp((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState(false);
  const updatePhoto = useStoreApp((state) => state.updatePhoto);
  const updateProfile = useStoreApp((state) => state.updateProfile);
  const token = useStoreApp((state) => state.token);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => {
    setVisible(false);
    setMessage("");
  };

  const nameLabel = () => {
    return `${user.last_name.charAt(0)}${user.first_name.charAt(0)}`.toUpperCase();
  };

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isLoading, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(userSchema),
    mode: "onChange",
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: user.phone_number,
      address: user.address,
      email: user.email,
    },
  });

  // start image library camera
  const launchImageLibrary = async (): Promise<
    ImagePicker.ImagePickerAsset | undefined
  > => {
    // request camera permissions
    const permission = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    }
    const media = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      selectionLimit: 1,
      aspect: [4, 3],
      quality: 1,
    });
    return media.assets?.[0];
  };

  // upload file
  const processFile = async () => {
    const media = await launchImageLibrary();
    if (media?.fileSize! > PHOTO_MAX_SIZE) {
      Alert.alert(
        "Image lourde",
        "Fichier volumineux. Choisissez une image en dessous de 10MB",
      );
      return;
    }
    if (media?.uri) {
      // format file data to sent to the server
      setLoading(!loading);
      let formData: FormData = new FormData();
      formData.append(
        "upload_preset",
        `${process.env.EXPO_PUBLIC_UPLOAD_PRESET}`,
      );
      formData.append("api_key", `${process.env.EXPO_PUBLIC_CLOUD_API_KEY}`);
      formData.append("file", {
        uri: media.uri,
        name: media.fileName,
        type: media.mimeType,
      } as any);

      const cldName = process.env.EXPO_PUBLIC_CLOUD_NAME as string;
      // we upload the file
      const req = await uploadCldFile(formData, cldName);
      if (req?.code !== 200) {
        setError("root", {
          message: "Impossible de telecharger la photo",
        });
        setLoading(false);
        return;
      }
      if (req.code === 200) {
        setError("root", { message: "" });
        setLoading(false);
        updatePhoto(req?.file);
        return;
      }
      return;
    }
    return;
  };

  // update profile
  const mutation = useMutation({
    mutationFn: async (input: Inputs) => {
      const obj = {
        ...input,
        picture: user?.picture,
      };
      const response = await updateUserProfile(obj, user?.id!, token);
      return response;
    },
    onSuccess: async (data) => {
      if (data?.code === 404) {
        setError("root", {
          message: data.message,
        });
        return;
      }
      onToggleSnackBar();
      updateProfile(data);
      setMessage("Profil mis à jour");
    },
    onError: async (error) => {
      setError("root", {
        message: error.message,
      });
    },
  });

  const handleForm = async (input: Inputs) => {
    await mutation.mutateAsync({ ...input });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboard}
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.ContainerStyle}
      >
        <TouchableOpacity
          disabled={loading}
          style={styles.avatar}
          onPress={processFile}
        >
          {user?.picture ? (
            <>
              <Avatar.Image
                size={70}
                source={{ uri: user.picture }}
                onLoadStart={() => setStart(true)}
                onLoadEnd={() => setStart(false)}
              />
              <ActivityIndicator
                style={styles.activityIndicator}
                animating={start}
                color={Colors.dark.text}
              />
            </>
          ) : (
            <Avatar.Text size={70} label={nameLabel()} />
          )}
          {loading ? (
            <ActivityIndicator
              animating={loading}
              color={Colors.primaryColor}
            />
          ) : null}
        </TouchableOpacity>
        <ThemedView style={styles.viewInput}>
          <Input
            value={user.registration_number}
            label="Numéro identifiant"
            editable={false}
          />
          <ThemedText type="default" style={styles.error}>
            {errors?.registration_number?.message}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.viewInput}>
          <Controller
            control={control}
            name="last_name"
            rules={{ required: true }}
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                label="Nom"
              />
            )}
          />
          <ThemedText type="default" style={styles.error}>
            {errors?.last_name?.message}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.viewInput}>
          <Controller
            control={control}
            name="first_name"
            rules={{ required: true }}
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                label="Prénoms"
              />
            )}
          />
          <ThemedText type="default" style={styles.error}>
            {errors?.first_name?.message}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.viewInput}>
          <Controller
            control={control}
            name="email"
            rules={{ required: true }}
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                keyboardType="email-address"
                label="Email"
              />
            )}
          />
          <ThemedText type="default" style={styles.error}>
            {errors?.email?.message}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.viewInput}>
          <Controller
            control={control}
            name="phone_number"
            rules={{ required: true }}
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                keyboardType="phone-pad"
                label="Numéro de téléphone"
              />
            )}
          />
          <ThemedText type="default" style={styles.error}>
            {errors?.phone_number?.message}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.viewInput}>
          <Controller
            control={control}
            name="address"
            rules={{ required: true }}
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                label="Adresse"
              />
            )}
          />
          <ThemedText type="default" style={styles.error}>
            {errors?.address?.message}
          </ThemedText>
        </ThemedView>
        <Button
          title="Mettre à jour le profil"
          onPress={handleSubmit(handleForm)}
          loading={mutation.isPending || isLoading || isSubmitting}
          disabled={mutation.isPending || isLoading || isSubmitting}
          style={styles.button}
        />
        {(mutation.isError && mutation?.error) || errors.root?.message ? (
          <ThemedText type="default" style={styles.errorupdate}>
            {mutation.error?.message || errors?.root?.message}
          </ThemedText>
        ) : null}
      </ScrollView>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: "Fermer",
          onPress: () => onDismissSnackBar(),
        }}
      >
        {message}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 55,
  },
  activityIndicator: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 20,
  },
  button: {
    marginTop: 20,
    marginBottom: 80,
  },
  ContainerStyle: {
    flexGrow: 0,
  },
  avatar: {
    marginBottom: 25,
  },
  viewInput: {
    backgroundColor: "transparent",
  },
  error: {
    color: "red",
  },
  errorupdate: {
    color: "red",
    fontSize: 15,
    marginTop: 5,
    textAlign: "center",
  },
});

export default memo(Profile);
