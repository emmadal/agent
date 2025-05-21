import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Platform,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  useColorScheme,
  Pressable,
  View,
} from "react-native";
import { PaperSelect } from "react-native-paper-select";
import { useTheme } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { storeSchema } from "@/lib/schema";
import { useStoreApp } from "@/store";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { addStore, uploadCldFile } from "@/api";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import useToken from "@/hooks/useToken";
import Input from "@/components/Input";
import Button from "@/components/Button";
import useCommunes from "@/hooks/useCommunes";
import useQuartier from "@/hooks/useQuartier";
import CustomGooglePlacesInput from "@/components/GooglePlace";
import { BackHandler } from "@/components/BackHandler";

type Inputs = z.infer<typeof storeSchema>;
const PHOTO_MAX_SIZE = 10000000; // 10mb

const NewStore = () => {
  const token = useToken();
  const { error, list, selectedList, value } = useCommunes();
  const {
    error: errorQuartier,
    list: listQuartier,
    selectedList: selectedListQuartier,
    value: valueQuartier,
  } = useQuartier();
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const store = useStoreApp((state) => state);
  const colorScheme = useColorScheme();
  const [zone, setZone] = useState({
    value,
    list,
    selectedList,
    error,
  });
  const [town, setTown] = useState({
    value: valueQuartier,
    list: listQuartier,
    selectedList: selectedListQuartier,
    error: errorQuartier,
  });

  const {
    handleSubmit,
    setValue,
    control,
    trigger,
    reset,
    watch,
    setError,
    formState: { errors, isLoading, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(storeSchema),
    mode: "onChange",
  });

  // start phone camera
  const launchCamera = async (): Promise<
    ImagePicker.ImagePickerAsset | undefined
  > => {
    // request camera permissions
    const permission = await ImagePicker.getCameraPermissionsAsync();
    if (permission.status !== "granted") {
      await ImagePicker.requestCameraPermissionsAsync();
    }
    const camera = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.back,
      aspect: [4, 3],
      quality: 1,
    });
    return camera.assets?.[0];
  };

  // upload file
  const processFile = async () => {
    const camera = await launchCamera();
    let formData: FormData = new FormData();
    formData.append(
      "upload_preset",
      `${process.env.EXPO_PUBLIC_UPLOAD_PRESET}`,
    );
    formData.append("api_key", `${process.env.EXPO_PUBLIC_CLOUD_API_KEY}`);

    if (camera?.fileSize! > PHOTO_MAX_SIZE) {
      Alert.alert(
        "Fichier volumineux",
        "Veuillez choisir une image en dessous de 10MB",
      );
      return;
    }

    if (camera?.uri) {
      setLoading(!loading);
      formData.append("file", {
        uri: camera?.uri!,
        type: camera?.mimeType!,
        name: camera?.fileName!,
      } as any);

      const cldName = process.env.EXPO_PUBLIC_CLOUD_NAME as string;

      // send data file to the server
      const response = await uploadCldFile(formData, cldName);
      if (response?.code !== 200) {
        setError("root", {
          message: "Impossible de télécharger la photo",
        });
        setLoading(false);
        return;
      }
      if (response?.code === 200) {
        setValue("picture", response?.file);
        setLoading(false);
        trigger("picture");
        return;
      }
      setLoading(false);
      return;
    }
    return;
  };

  const returnData = (input: Inputs) => {
    if (!input.zone_id) {
      delete input?.zone_id;
      return input;
    }
    if (!input?.quartier_id) {
      delete input?.quartier_id;
      return input;
    }
    return {
      ...input,
      zone_id: Number(input?.zone_id),
      quartier_id: Number(input?.quartier_id),
    };
  };

  // send data to server
  const mutation = useMutation({
    mutationFn: async (input: Inputs) => {
      const data = returnData(input);
      const response = await addStore(data, token || store?.token);
      return response;
    },
    onSuccess: async (data) => {
      if (data?.status !== 201) {
        setError("root", {
          message: "Une erreur s'est produite",
        });
        return;
      }
      Alert.alert(
        "Nouvelle boutique 🎉",
        "Vous avez ajouté la boutique avec succès",
        [
          {
            onPress: () => {
              reset({
                name: "",
                address: "",
                zone_id: "",
                quartier_id: "",
                phone_gerant: "",
                phone_boutique: "",
                picture: "",
                name_gerant: "",
                description: "",
              });
              setZone({
                ...zone,
                value: "",
              });
              setTown({
                ...town,
                value: "",
              });
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
    <View style={styles.container}>
      <BackHandler title="Ajouter une nouvelle boutique" />
      <ScrollView
        style={styles.Scrollcontainer}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.ContainerStyle}
      >
        <ThemedView style={styles.viewInput}>
          <Controller
            control={control}
            name="address"
            render={({ field: { onBlur, onChange, value } }) => (
              <CustomGooglePlacesInput
                setValue={setValue}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                trigger={trigger}
              />
            )}
          />
          <ThemedText type="default" style={styles.error}>
            {errors.address?.message}
          </ThemedText>
        </ThemedView>
        <ThemedView style={[styles.viewInput, { marginTop: 15 }]}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Choisissez la commune
          </ThemedText>
          <Controller
            control={control}
            name="zone_id"
            render={() => (
              <PaperSelect
                dialogStyle={{
                  backgroundColor: "white",
                }}
                dialogDoneButtonStyle={{
                  color: Colors.light.text,
                }}
                dialogCloseButtonStyle={{
                  color: Colors.light.text,
                }}
                textInputOutlineStyle={{
                  backgroundColor:
                    colorScheme === "dark" ? "transparent" : "white",
                  borderColor: "#DDDDE1",
                  height: 53,
                  // borderRadius: 10,
                }}
                label=""
                value={zone.value}
                textColor={Colors[colorScheme ?? "light"].text}
                textInputMode="outlined"
                textInputProps={{
                  activeOutlineColor: Colors.primaryColor,
                  outlineColor: theme.colors.outline,
                  underlineColor: "transparent",
                }}
                checkboxProps={{
                  checkboxMode: "ios",
                  checkboxColor: Colors.primaryColor,
                  checkboxLabelStyle: {
                    color: Colors.light.text,
                  },
                }}
                onSelection={async (value: any) => {
                  setZone({
                    ...zone,
                    value: value.text,
                    selectedList: value.selectedList,
                    error: "",
                  });
                  setValue("zone_id", value.selectedList[0]?._id);
                  await trigger("zone_id");
                }}
                arrayList={list}
                dialogTitleStyle={styles.dialogTitleStyle}
                selectedArrayList={selectedList}
                errorText={error}
                dialogDoneButtonText="Choisir"
                dialogCloseButtonText="Fermer"
                dialogTitle="Choisissez la commune"
                multiEnable={false}
                searchText="Rechercher une commune"
                searchStyle={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  textAlign: "auto",
                }}
                searchbarProps={{
                  iconColor: Colors.light.text,
                  placeholderTextColor: "black",
                  textAlign: "auto",
                  underlineColor: "transparent",
                  activeUnderlineColor: "transparent",
                }}
              />
            )}
          />
          <ThemedText type="default" style={styles.error}>
            {errors.zone_id?.message}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.viewInput}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Choisissez le quartier
          </ThemedText>
          <Controller
            control={control}
            name="quartier_id"
            render={() => (
              <PaperSelect
                label=""
                value={town.value}
                textColor={Colors[colorScheme ?? "light"].text}
                dialogStyle={{
                  backgroundColor: "white",
                }}
                dialogDoneButtonStyle={{
                  color: Colors.light.text,
                }}
                dialogCloseButtonStyle={{
                  color: Colors.light.text,
                }}
                textInputOutlineStyle={{
                  backgroundColor:
                    colorScheme === "dark" ? "transparent" : "white",
                  borderColor: "#DDDDE1",
                  height: 53,
                  // borderRadius: 10,
                }}
                textInputProps={{
                  activeOutlineColor: Colors.primaryColor,
                  outlineColor: theme.colors.outline,
                  underlineColor: "transparent",
                }}
                checkboxProps={{
                  checkboxMode: "ios",
                  checkboxColor: Colors.primaryColor,
                  checkboxLabelStyle: {
                    color: Colors.light.text,
                  },
                }}
                textInputMode="outlined"
                onSelection={async (value: any) => {
                  setTown({
                    ...town,
                    value: value.text,
                    selectedList: value.selectedList,
                    error: "",
                  });
                  setValue("quartier_id", value?.selectedList[0]?._id);
                  await trigger("quartier_id");
                }}
                arrayList={listQuartier}
                dialogTitleStyle={styles.dialogTitleStyle}
                selectedArrayList={selectedListQuartier}
                errorText={errorQuartier}
                dialogDoneButtonText="Choisir"
                dialogTitle="Choisissez le quartier"
                dialogCloseButtonText="Fermer"
                multiEnable={false}
                searchText="Rechercher un quartier"
                searchStyle={{
                  backgroundColor: "transparent",
                  borderColor: Colors.light.text,
                  borderWidth: 1,
                  borderRadius: 8,
                  textAlign: "auto",
                }}
                searchbarProps={{
                  iconColor: Colors.light.text,
                  placeholderTextColor: "black",
                  textAlign: "auto",
                  underlineColor: "transparent",
                  activeUnderlineColor: "transparent",
                }}
              />
            )}
          />
          <ThemedText type="default" style={styles.error}>
            {errors.quartier_id?.message}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.viewInput}>
          <Controller
            control={control}
            name="name"
            rules={{ required: true }}
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                label="Entrez le nom de la boutique*"
              />
            )}
          />
          <ThemedText type="default" style={styles.error}>
            {errors?.name?.message}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.viewInput}>
          <Controller
            control={control}
            name="phone_boutique"
            rules={{ required: true }}
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                label="Entrez le contact de la boutique*"
              />
            )}
          />
          <ThemedText type="default" style={styles.error}>
            {errors?.phone_boutique?.message}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.viewInput}>
          <Controller
            control={control}
            name="name_gerant"
            rules={{ required: true }}
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                label="Entrez le nom du gestionnaire*"
              />
            )}
          />
          <ThemedText type="default" style={styles.error}>
            {errors?.name_gerant?.message}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.viewInput}>
          <Controller
            control={control}
            name="phone_gerant"
            rules={{ required: true }}
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                label="Entrez le contact du gestionnaire*"
                keyboardType="phone-pad"
              />
            )}
          />
          <ThemedText type="default" style={styles.error}>
            {errors?.phone_gerant?.message}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.viewInput}>
          <Controller
            control={control}
            name="description"
            rules={{ required: true }}
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                label="Entrez la description de la boutique*"
                style={styles.descInput}
                maxLength={250}
                multiline
              />
            )}
          />
          <ThemedText type="default" style={styles.error}>
            {errors?.description?.message}
          </ThemedText>
          <ThemedText type="default" style={styles.count}>
            {watch("description")?.length ?? 0}/250
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.viewInput}>
          {watch("picture") ? (
            <ThemedView style={styles.row}>
              <Image
                source={{ uri: watch("picture") }}
                style={styles.preview}
                resizeMode="cover"
              />

              <Pressable
                style={styles.button}
                onPress={() => {
                  setValue("picture", "");
                  trigger("picture");
                }}
              >
                <ThemedText type="defaultSemiBold">
                  Supprimez la photo
                </ThemedText>
              </Pressable>
            </ThemedView>
          ) : (
            <TouchableOpacity
              style={[
                styles.upload,
                {
                  backgroundColor: "transparent",
                  borderColor: Colors[colorScheme ?? "light"]?.icon,
                },
              ]}
              onPress={processFile}
              disabled={loading}
            >
              <ThemedText
                type="default"
                style={{
                  color: Colors[colorScheme ?? "light"]?.text,
                }}
              >
                Télécharger la photo de la boutique*
              </ThemedText>
              {loading ? (
                <ActivityIndicator
                  animating={loading}
                  color={Colors.primaryColor}
                />
              ) : null}
            </TouchableOpacity>
          )}

          <ThemedText type="default" style={styles.error}>
            {errors.picture?.message}
          </ThemedText>
        </ThemedView>
        {(mutation.isError && mutation?.error) || errors.root?.message ? (
          <ThemedText type="default" style={styles.errorupdate}>
            {mutation.error?.message || errors?.root?.message}
          </ThemedText>
        ) : null}
        <Button
          onPress={handleSubmit(handleForm)}
          title="Ajouter une nouvelle boutique"
          loading={mutation.isPending || isLoading || isSubmitting}
          disabled={mutation.isPending || isLoading || isSubmitting}
          style={styles.button}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  Scrollcontainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 20,
  },
  ContainerStyle: {
    flexGrow: 1,
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
  descInput: {
    minHeight: 80,
    textAlign: "auto",
  },
  count: {
    alignSelf: "flex-end",
    marginTop: -15,
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
  upload: {
    // borderRadius: 5,
    padding: 5,
    borderStyle: "dashed",
    borderWidth: 1,
    backgroundColor: "transparent",
    marginTop: 15,
    height: 135,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Platform.select({
      android: 10,
      ios: 5,
    }),
  },
  dialogTitleStyle: {
    fontSize: 17,
    color: "black",
  },
  errorupdate: {
    color: "red",
    fontSize: 15,
    textAlign: "center",
  },
  preview: {
    height: 150,
    width: "100%",
    aspectRatio: 1,
    alignSelf: "center",
  },
  row: {
    backgroundColor: "transparent",
  },
  label: {
    marginLeft: 7,
    marginBottom: 2,
  },
});

export default NewStore;
