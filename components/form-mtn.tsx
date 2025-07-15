import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import { PaperSelect } from "react-native-paper-select";
import { Alert, Platform, StyleSheet, useColorScheme } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Snackbar, useTheme } from "react-native-paper";
import { visitMTNSchema } from "@/lib/schema";
import { z } from "zod";
import { useStoreApp } from "@/store";
import { useLocalSearchParams } from "expo-router";
import { addVisit, getActivityConcurent } from "@/api";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import usePosition from "@/hooks/usePosition";
import { Colors } from "@/constants/Colors";
import Button from "@/components/Button";
import Input from "@/components/Input";

type Inputs = z.infer<typeof visitMTNSchema>;
const visibility_vs_concurrence = [
  {
    _id: "1",
    value: "MTN meilleur",
  },
  {
    _id: "2",
    value: "MTN aligné",
  },
  {
    _id: "3",
    value: "MTN faible",
  },
];
const registre_note = [
  {
    _id: "1",
    value: "Oui",
  },
  {
    _id: "2",
    value: "Non",
  },
];
const dispo_float = [
  {
    _id: "1",
    value: "Oui",
  },
  {
    _id: "2",
    value: "Non",
  },
];
const dispo_cash = [
  {
    _id: "1",
    value: "Oui",
  },
  {
    _id: "2",
    value: "Non",
  },
];
const branding = [
  {
    _id: "1",
    value: "Grille tarifaire",
  },
  {
    _id: "2",
    value: "Poster éducatifs",
  },
  {
    _id: "3",
    value: "Autocollants MoMo",
  },
  {
    _id: "4",
    value: "Aucun branding Interne",
  },
];
const carte_commercant = [
  {
    _id: "1",
    value: "Oui",
  },
  {
    _id: "2",
    value: "Non",
  },
];

type Props = {
  token: string;
  visibility_id: number;
  type_visits_id: number;
};

const FormMTN = (props: Props) => {
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
  const [visibilityMTN, setVisibilityMTN] = useState({
    value: "",
    list: visibility_vs_concurrence,
    selectedList: [],
    error: "",
  });
  const [brandingMTN, setBrandingMTN] = useState({
    value: "",
    list: branding,
    selectedList: [],
    error: "",
  });
  const [registreMTN, setRegistreMTN] = useState({
    value: "",
    list: registre_note,
    selectedList: [],
    error: "",
  });
  const [dispoFloatMTN, setDispoFloatMTN] = useState({
    value: "",
    list: dispo_float,
    selectedList: [],
    error: "",
  });
  const [dispoCashMTN, setDispoCashMTN] = useState({
    value: "",
    list: dispo_cash,
    selectedList: [],
    error: "",
  });
  const [carteCommercantMTN, setCarteCommercantMTN] = useState({
    value: "",
    list: carte_commercant,
    selectedList: [],
    error: "",
  });
  const [activityConcurrent, setActivityConcurrent] = useState({
    value: "",
    list: [],
    selectedList: [],
    error: "",
  });

  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const fetchActiviteConcurrente = async () => {
    const arr: any = [];
    const activities = await getActivityConcurent(props.token);
    if (activities?.length) {
      for (const i of activities) {
        arr.push({ _id: String(i?.id), value: i?.libelle });
      }
      setActivityConcurrent({
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
    resolver: zodResolver(visitMTNSchema),
    mode: "onChange",
  });

  useEffect(() => {
    (async () => {
      await Promise.all([fetchActiviteConcurrente()]);
    })();
  }, []);

  const mutation = useMutation({
    mutationFn: async (input: Inputs) => {
      const data = {
        store_id: agency?.id,
        team_user_id: Number(store?.team?.team_id),
        latitude: position?.latitude,
        longitude: position?.longitude,
        comment: input.comment,
        type_visits_id: Number(input?.type_visits_id),
        visibility_id: Number(input?.visibility_id),
        montant: Number(input.montant) || 0,
        products: "",
        branding_interne: input.branding_interne,
        visibilite_mtn_vs_concurrence: input.visibility_concurence,
        registre_de_note: input.registre_de_note,
        disponibilite_du_float: input.disponibilite_du_float,
        disponibilite_du_cash: input.disponibilite_du_float,
        activite_concurrence: input.activite_concurrence,
        carte_commercant: input.carte_commercant,
        appreciation_du_point_de_vente: input.appreciation,
      };
      const response = await addVisit(data, props.token || store?.token);
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
            onPress: async () => {
              await queryClient.invalidateQueries();
              reset();
              navigation.goBack();
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

  const handleForm = (input: Inputs) => mutation.mutate({ ...input });

  return (
    <>
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
              label="Montant vente (FCFA)*"
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
          Branding interne*
        </ThemedText>
        <Controller
          control={control}
          name="branding_interne"
          rules={{ required: true }}
          render={() => (
            <PaperSelect
              label=""
              value={brandingMTN.value}
              onSelection={async (value: any) => {
                setBrandingMTN({
                  ...brandingMTN,
                  value: value.text,
                  selectedList: value.selectedList,
                  error: "",
                });
                setValue("branding_interne", value?.selectedList[0]?.value);
                await trigger("branding_interne");
              }}
              arrayList={[...brandingMTN.list]}
              hideSearchBox
              selectedArrayList={brandingMTN.selectedList}
              errorText={brandingMTN.error}
              dialogDoneButtonText="Choisir"
              dialogCloseButtonText="Fermer"
              multiEnable={false}
              textColor={Colors[colorScheme ?? "light"].text}
              dialogTitleStyle={styles.dialogTitleStyle}
              dialogTitle="Branding interne"
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
          {errors.branding_interne?.message}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.viewInput}>
        <ThemedText type="defaultSemiBold" style={styles.label}>
          Visibilité MTN vs Concurrence*
        </ThemedText>
        <Controller
          control={control}
          name="activite_concurrence"
          rules={{ required: true }}
          render={() => (
            <PaperSelect
              label=""
              value={visibilityMTN.value}
              onSelection={async (value: any) => {
                setVisibilityMTN({
                  ...visibilityMTN,
                  value: value.text,
                  selectedList: value.selectedList,
                  error: "",
                });
                setValue(
                  "visibility_concurence",
                  value?.selectedList[0]?.value,
                );
                await trigger("visibility_concurence");
              }}
              arrayList={[...visibilityMTN.list]}
              hideSearchBox
              selectedArrayList={visibilityMTN.selectedList}
              errorText={visibilityMTN.error}
              dialogDoneButtonText="Choisir"
              dialogCloseButtonText="Fermer"
              multiEnable={false}
              textColor={Colors[colorScheme ?? "light"].text}
              dialogTitleStyle={styles.dialogTitleStyle}
              dialogTitle="Visibilité MTN vs Concurrence"
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
          {errors.visibility_concurence?.message}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.viewInput}>
        <ThemedText type="defaultSemiBold" style={styles.label}>
          Registre de note*
        </ThemedText>
        <Controller
          control={control}
          name="registre_de_note"
          rules={{ required: true }}
          render={() => (
            <PaperSelect
              label=""
              value={registreMTN.value}
              onSelection={async (value: any) => {
                setRegistreMTN({
                  ...registreMTN,
                  value: value.text,
                  selectedList: value.selectedList,
                  error: "",
                });
                const selected =
                  value?.selectedList[0]?.value === "Oui" ? true : false;
                setValue("registre_de_note", selected);
                await trigger("registre_de_note");
              }}
              arrayList={[...registreMTN.list]}
              hideSearchBox
              selectedArrayList={registreMTN.selectedList}
              errorText={registreMTN.error}
              dialogDoneButtonText="Choisir"
              dialogCloseButtonText="Fermer"
              multiEnable={false}
              textColor={Colors[colorScheme ?? "light"].text}
              dialogTitleStyle={styles.dialogTitleStyle}
              dialogTitle="Registre de note"
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
          {errors.registre_de_note?.message}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.viewInput}>
        <ThemedText type="defaultSemiBold" style={styles.label}>
          Disponibilité du float*
        </ThemedText>
        <Controller
          control={control}
          name="disponibilite_du_float"
          rules={{ required: true }}
          render={() => (
            <PaperSelect
              label=""
              value={dispoFloatMTN.value}
              onSelection={async (value: any) => {
                setDispoFloatMTN({
                  ...dispoFloatMTN,
                  value: value.text,
                  selectedList: value.selectedList,
                  error: "",
                });
                const selected =
                  value?.selectedList[0]?.value === "Oui" ? true : false;
                setValue("disponibilite_du_float", selected);
                await trigger("disponibilite_du_float");
              }}
              arrayList={[...dispoFloatMTN.list]}
              hideSearchBox
              selectedArrayList={dispoFloatMTN.selectedList}
              errorText={dispoFloatMTN.error}
              dialogDoneButtonText="Choisir"
              dialogCloseButtonText="Fermer"
              multiEnable={false}
              textColor={Colors[colorScheme ?? "light"].text}
              dialogTitleStyle={styles.dialogTitleStyle}
              dialogTitle="Disponibilité du float"
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
          {errors.disponibilite_du_float?.message}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.viewInput}>
        <ThemedText type="defaultSemiBold" style={styles.label}>
          Disponibilité du cash*
        </ThemedText>
        <Controller
          control={control}
          name="disponibilite_du_cash"
          rules={{ required: true }}
          render={() => (
            <PaperSelect
              label=""
              value={dispoCashMTN.value}
              onSelection={async (value: any) => {
                setDispoCashMTN({
                  ...dispoCashMTN,
                  value: value.text,
                  selectedList: value.selectedList,
                  error: "",
                });
                const selected =
                  value?.selectedList[0]?.value === "Oui" ? true : false;
                setValue("disponibilite_du_cash", selected);
                await trigger("disponibilite_du_cash");
              }}
              arrayList={[...dispoCashMTN.list]}
              hideSearchBox
              selectedArrayList={dispoCashMTN.selectedList}
              errorText={dispoCashMTN.error}
              dialogDoneButtonText="Choisir"
              dialogCloseButtonText="Fermer"
              multiEnable={false}
              textColor={Colors[colorScheme ?? "light"].text}
              dialogTitleStyle={styles.dialogTitleStyle}
              dialogTitle="Disponibilité du cash"
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
          {errors.disponibilite_du_cash?.message}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.viewInput}>
        <ThemedText type="defaultSemiBold" style={styles.label}>
          Activité concurrente*
        </ThemedText>
        <Controller
          control={control}
          name="activite_concurrence"
          rules={{ required: true }}
          render={() => (
            <PaperSelect
              label=""
              value={activityConcurrent.value}
              onSelection={async (value: any) => {
                setActivityConcurrent({
                  ...activityConcurrent,
                  value: value.text,
                  selectedList: value.selectedList,
                  error: "",
                });
                setValue("activite_concurrence", value?.selectedList[0]?.value);
                await trigger("activite_concurrence");
              }}
              arrayList={[...activityConcurrent.list]}
              hideSearchBox
              selectedArrayList={activityConcurrent.selectedList}
              errorText={activityConcurrent.error}
              dialogDoneButtonText="Choisir"
              dialogCloseButtonText="Fermer"
              multiEnable={false}
              textColor={Colors[colorScheme ?? "light"].text}
              dialogTitleStyle={styles.dialogTitleStyle}
              dialogTitle="Activité concurrente"
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
          {errors.activite_concurrence?.message}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.viewInput}>
        <ThemedText type="defaultSemiBold" style={styles.label}>
          Carte Commercant*
        </ThemedText>
        <Controller
          control={control}
          name="carte_commercant"
          rules={{ required: true }}
          render={() => (
            <PaperSelect
              label=""
              value={carteCommercantMTN.value}
              onSelection={async (value: any) => {
                setCarteCommercantMTN({
                  ...carteCommercantMTN,
                  value: value.text,
                  selectedList: value.selectedList,
                  error: "",
                });
                const selected =
                  value?.selectedList[0]?.value === "Oui" ? true : false;
                setValue("carte_commercant", selected);
                await trigger("carte_commercant");
              }}
              arrayList={[...carteCommercantMTN.list]}
              hideSearchBox
              selectedArrayList={carteCommercantMTN.selectedList}
              errorText={carteCommercantMTN.error}
              dialogDoneButtonText="Choisir"
              dialogCloseButtonText="Fermer"
              multiEnable={false}
              textColor={Colors[colorScheme ?? "light"].text}
              dialogTitleStyle={styles.dialogTitleStyle}
              dialogTitle="Carte commercant"
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
          {errors.carte_commercant?.message}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.viewInput}>
        <Controller
          control={control}
          name="appreciation"
          rules={{ required: true }}
          render={({ field: { onBlur, onChange, value } }) => (
            <Input
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              label="Appréciation du PDV*"
              inputMode="numeric"
              keyboardType="number-pad"
            />
          )}
        />
        <ThemedText type="default" style={styles.error}>
          {errors.appreciation?.message}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.viewInput}>
        <Controller
          control={control}
          name="activite_realisee"
          rules={{ required: true }}
          render={({ field: { onBlur, onChange, value } }) => (
            <Input
              value={value}
              onBlur={onBlur}
              multiline
              onChangeText={onChange}
              label="Activités realisées*"
              style={styles.descInput}
            />
          )}
        />
        <ThemedText type="default" style={styles.error}>
          {errors.activite_realisee?.message}
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
        title={`Enregister la visite de ${agency?.name}`}
        loading={mutation.isPending || isLoading || isSubmitting}
        disabled={mutation.isPending || isLoading || isSubmitting}
        style={styles.button}
      />

      {(mutation.isError && mutation?.error) || errors.root?.message ? (
        <ThemedText type="default" style={styles.errorupdate}>
          {mutation.error?.message || errors?.root?.message}
        </ThemedText>
      ) : null}
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
    </>
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

export default FormMTN;
