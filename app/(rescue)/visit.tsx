import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import { PaperSelect } from "react-native-paper-select";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  useColorScheme,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import { Snackbar, useTheme } from "react-native-paper";
import { visitSchema } from "@/lib/schema";
import { z } from "zod";
import { useStoreApp } from "@/store";
import { useLocalSearchParams } from "expo-router";
import { addVisit, getTypeVisitList, getVisibilityList } from "@/api";
import { useQueryClient } from "@tanstack/react-query";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import usePosition from "@/hooks/usePosition";
import useToken from "@/hooks/useToken";
import useHeaderRouter from "@/hooks/useHeaderRoute";
import { Colors } from "@/constants/Colors";
import { today } from "@/lib/today";
import Button from "@/components/Button";
import Input from "@/components/Input";

type Inputs = z.infer<typeof visitSchema>;

const Visit = () => {
  const token = useToken();
  useHeaderRouter({ title: "" });
  const position = usePosition();
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const store = useStoreApp((state) => state);
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const colorScheme = useColorScheme();
  const params = useLocalSearchParams();
  const agency = JSON.parse(params?.store as any);
  const [message, setMessage] = useState("");

  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  const [visit, setVisit] = useState({
    value: "",
    list: [],
    selectedList: [],
    error: "",
  });
  const [visibility, setVisibility] = useState({
    value: "",
    list: [],
    selectedList: [],
    error: "",
  });

  const fetchVisitType = async () => {
    const arr: any = [];
    const visits = await getTypeVisitList(token || store?.token);
    if (visits?.length) {
      for (const i of visits) {
        arr.push({ _id: String(i?.id), value: i?.libelle });
      }
      setVisit({
        value: "",
        list: arr,
        selectedList: [],
        error: "",
      });
    }
  };

  const fetchVisibility = async () => {
    const arr: any = [];
    const visibilities = await getVisibilityList(token || store?.token);
    if (visibilities?.length) {
      for (const i of visibilities) {
        arr.push({ _id: String(i?.id), value: i?.libelle });
      }
      setVisibility({
        value: "",
        list: arr,
        selectedList: [],
        error: "",
      });
    }
  };

  const {
    handleSubmit,
    setValue,
    control,
    trigger,
    reset,
    formState: { errors, isLoading, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(visitSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    (async () => {
      await Promise.all([fetchVisitType(), fetchVisibility()]);
    })();
  }, []);

  const mutation = useMutation({
    mutationFn: async (input: Inputs) => {
      const data = {
        ...input,
        store_id: agency?.id,
        team_user_id: Number(store?.team?.team_id),
        latitude: position?.latitude,
        longitude: position?.longitude,
        montant: input.montant ? parseFloat(String(input.montant)) : 0,
        type_visits_id: Number(input?.type_visits_id),
        visibility_id: Number(input?.visibility_id),
      };
      const response = await addVisit(data, token || store?.token);
      return response;
    },
    onSuccess: async (data: any) => {
      if (data?.code === 409) {
        setMessage(data.message);
        onToggleSnackBar();
        return;
      }
      Alert.alert(
        "Nouvelle Visite",
        "Félicitations 🎉. Votre visite a été prise en compte",
        [
          {
            text: "Terminer",
            onPress: () => {
              const date = today();
              queryClient
                .invalidateQueries({
                  queryKey: ["one_visit_date", date],
                })
                .then(() => {
                  setVisit({
                    ...visit,
                    value: "",
                  });
                  setVisibility({
                    ...visibility,
                    value: "",
                  });
                  reset({
                    products: "",
                    comment: "",
                    montant: "",
                  });
                  navigation.goBack();
                });
            },
          },
        ],
        { cancelable: false },
      );
    },
    onError: async (error) => {
      setMessage(error.message);
    },
  });

  const handleForm = (input: Inputs) => {
    mutation.mutate({ ...input });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboard}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="always"
          contentContainerStyle={styles.ContainerStyle}
        >
          <ThemedView style={styles.viewInput}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Type de visite*
            </ThemedText>
            <Controller
              control={control}
              name="type_visits_id"
              rules={{ required: true }}
              render={() => (
                <PaperSelect
                  label=""
                  value={visit.value}
                  onSelection={async (value: any) => {
                    setVisit({
                      ...visit,
                      value: value.text,
                      selectedList: value.selectedList,
                      error: "",
                    });
                    setValue("type_visits_id", value?.selectedList[0]?._id);
                    await trigger("type_visits_id");
                  }}
                  arrayList={[...visit.list]}
                  hideSearchBox
                  selectedArrayList={visit.selectedList}
                  errorText={visit.error}
                  dialogDoneButtonText="Choisir"
                  dialogCloseButtonText="Fermer"
                  multiEnable={false}
                  textColor={Colors[colorScheme ?? "light"].text}
                  dialogTitleStyle={styles.dialogTitleStyle}
                  dialogTitle="Type de visite"
                  textInputOutlineStyle={{
                    backgroundColor:
                      colorScheme === "dark" ? "transparent" : "white",
                    borderColor: "#DDDDE1",
                    height: 53,
                    // borderRadius: 10,
                  }}
                  dialogStyle={{
                    backgroundColor: "white",
                  }}
                  dialogDoneButtonStyle={{
                    color: Colors.light.text,
                  }}
                  dialogCloseButtonStyle={{
                    color: Colors.light.text,
                  }}
                  textInputMode="outlined"
                  checkboxProps={{
                    checkboxMode: "ios",
                    checkboxColor: Colors.primaryColor,
                    checkboxLabelStyle: {
                      color: Colors.light.text,
                    },
                  }}
                  textInputProps={{
                    activeOutlineColor: Colors.primaryColor,
                    outlineColor: theme.colors.outline,
                    underlineColor: "transparent",
                  }}
                />
              )}
            />
            <ThemedText type="default" style={styles.error}>
              {errors.type_visits_id?.message}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.viewInput}>
            <Controller
              control={control}
              name="montant"
              rules={{ required: true }}
              render={({ field: { onBlur, onChange, value } }) => (
                <Input
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  label="Montant vente réalisé (FCFA)*"
                  inputMode="numeric"
                  keyboardType="number-pad"
                />
              )}
            />
            <ThemedText type="default" style={styles.error}>
              {errors.montant?.message}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.viewInput}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Niveau de la visibilité*
            </ThemedText>
            <Controller
              control={control}
              name="visibility_id"
              rules={{ required: true }}
              render={() => (
                <PaperSelect
                  // label="Niveau de la visibilité"
                  label=""
                  value={visibility.value}
                  textInputMode="outlined"
                  onSelection={async (value: any) => {
                    setVisibility({
                      ...visibility,
                      value: value.text,
                      selectedList: value.selectedList,
                      error: "",
                    });
                    setValue("visibility_id", value?.selectedList[0]?._id);
                    await trigger("visibility_id");
                  }}
                  arrayList={[...visibility.list]}
                  hideSearchBox
                  selectedArrayList={visibility.selectedList}
                  errorText={visibility.error}
                  dialogDoneButtonText="Choisir"
                  dialogCloseButtonText="Fermer"
                  multiEnable={false}
                  textColor={Colors[colorScheme ?? "light"].text}
                  dialogTitleStyle={styles.dialogTitleStyle}
                  dialogTitle="Niveau de la visibilité"
                  textInputOutlineStyle={{
                    backgroundColor:
                      colorScheme === "dark" ? "transparent" : "white",
                    borderColor: "#DDDDE1",
                    height: 53,
                  }}
                  dialogStyle={{
                    backgroundColor: "white",
                  }}
                  dialogDoneButtonStyle={{
                    color: Colors.light.text,
                  }}
                  dialogCloseButtonStyle={{
                    color: Colors.light.text,
                  }}
                  textInputStyle={{
                    marginBottom: -9,
                  }}
                  checkboxProps={{
                    checkboxMode: "ios",
                    checkboxColor: Colors.primaryColor,
                    checkboxLabelStyle: {
                      color: Colors.light.text,
                    },
                  }}
                  textInputProps={{
                    activeOutlineColor: Colors.primaryColor,
                    outlineColor: theme.colors.outline,
                    underlineColor: "transparent",
                  }}
                />
              )}
            />
            <ThemedText type="default" style={styles.error}>
              {errors.visibility_id?.message}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.viewInput}>
            <Controller
              control={control}
              name="products"
              rules={{ required: true }}
              render={({ field: { onBlur, onChange, value } }) => (
                <Input
                  value={value}
                  onBlur={onBlur}
                  multiline
                  onChangeText={onChange}
                  label="Produits vendus*"
                  style={styles.descInput}
                />
              )}
            />
            <ThemedText type="default" style={styles.error}>
              {errors.products?.message}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.viewInput}>
            <Controller
              control={control}
              name="comment"
              rules={{ required: true }}
              render={({ field: { onBlur, onChange, value } }) => (
                <Input
                  value={value}
                  onBlur={onBlur}
                  multiline
                  onChangeText={onChange}
                  label="Difficultés ou problèmes à regler*"
                  style={styles.descInput}
                />
              )}
            />
            <ThemedText type="default" style={styles.error}>
              {errors.comment?.message}
            </ThemedText>
          </ThemedView>
          <Button
            onPress={handleSubmit(handleForm)}
            title="Enregister la visite"
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
      </TouchableWithoutFeedback>
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
  label: {
    marginLeft: 7,
    marginBottom: 2,
  },
  ContainerStyle: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    marginTop: 20,
  },
  viewInput: {
    marginTop: 5,
    backgroundColor: "transparent",
  },
  textInput: {
    textAlign: "auto",
    fontSize: 17,
    backgroundColor: "transparent",
  },
  error: {
    color: "red",
  },
  descInput: {
    height: 100,
  },
  button: {
    marginTop: 23,
    borderColor: "transparent",
    borderWidth: 0,
    marginBottom: 90,
  },
  dialogTitleStyle: {
    fontSize: 17,
    color: "black",
  },
  warningContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  warning: {
    fontWeight: "600",
  },
  errorupdate: {
    color: "red",
    fontSize: 15,
    marginTop: 5,
    textAlign: "center",
    marginBottom: Platform.select({
      android: 20,
      ios: 10,
    }),
  },
});

export default Visit;
