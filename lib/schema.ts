import { z } from "zod";
import { phoneRegex, amountRegex } from "./regex";

export const loginSchema = z
  .object({
    registration_number: z
      .string({ required_error: "Champ obligatoire" })
      .min(3, "min 3 caractères"),
    password: z
      .string({ required_error: "Champ obligatoire" })
      .min(8, "8 caractères minimum"),
  })
  .required();

export const userSchema = z.object({
  registration_number: z
    .string({ required_error: "Champ obligatoire" })
    .min(5, "min 5 caractères")
    .optional(),
  first_name: z
    .string({ required_error: "Champ obligatoire" })
    .min(3, "3 caractères minimum")
    .max(100, "100 caractères autorisé")
    .trim(),
  last_name: z
    .string({ required_error: "Champ obligatoire" })
    .min(3, "3 caractères minimum")
    .max(100, "100 caractères autorisé")
    .trim(),
  phone_number: z
    .string({ required_error: "Champ obligatoire" })
    .regex(phoneRegex, "Utilisez un numéro valide")
    .trim(),
  address: z
    .string({ required_error: "Champ obligatoire" })
    .min(2, "2 caractères minimum")
    .max(200, "100 caractères autorisé")
    .trim(),
  email: z.string({ required_error: "Champ obligatoire" }).email(),
});

export const storeSchema = z.object({
  name: z
    .string({ required_error: "Champ obligatoire" })
    .min(3, "min 3 caractères")
    .max(100, "100 caractères autorisé")
    .trim(),
  latitude: z.number(),
  longitude: z.number(),
  address: z
    .string({ required_error: "Champ obligatoire" })
    .min(3, "min 3 caractères")
    .trim(),
  zone_id: z.string().trim().optional(),
  quartier_id: z.string().trim().optional(),
  phone_gerant: z
    .string({ required_error: "Champ obligatoire" })
    .regex(phoneRegex, "Entrez un contact valide")
    .trim(),
  phone_boutique: z
    .string({ required_error: "Champ obligatoire" })
    .regex(phoneRegex, "Entrez un contact valide")
    .trim(),
  picture: z
    .string({ required_error: "Champ obligatoire" })
    .url({ message: "Champ obligatoire" })
    .trim(),
  name_gerant: z
    .string({ required_error: "Champ obligatoire" })
    .min(3, "min 3 caractères")
    .max(50, "50 caractères autorisé")
    .trim(),
  description: z
    .string({ required_error: "Champ obligatoire" })
    .min(5, "min 5 caractères")
    .max(220, "220 caractères autorisé")
    .trim(),
});

export const visitSchema = z.object({
  store_id: z.number().optional(),
  // team_user_id: z.number().optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
  comment: z
    .string({ required_error: "Champ obligatoire" })
    .min(3, "min 3 caractères")
    .trim(),
  type_visits_id: z.string({ required_error: "Champ obligatoire" }).trim(),
  visibility_id: z.string({ required_error: "Champ obligatoire" }).trim(),
  montant: z
    .string({ required_error: "Champ obligatoire" })
    .regex(amountRegex, "Entrez un montant valide")
    .trim(),
  products: z
    .string({ required_error: "Champ obligatoire" })
    .min(3, "min 3 caractères")
    .trim(),
});

export const editPasswordSchema = z
  .object({
    password: z
      .string({ required_error: "Champ obligatoire" })
      .min(8, "min 8 caractères")
      .trim(),
    new_password: z
      .string({ required_error: "Champ obligatoire" })
      .min(8, "min 8 caractères")
      .trim(),
    confirm_password: z
      .string({ required_error: "Champ obligatoire" })
      .min(8, "min 5 caractères")
      .trim(),
  })
  .refine(
    (values) => {
      return values.new_password === values.confirm_password;
    },
    {
      message: "Les mots de passe ne correspondent pas",
      path: ["confirm_password"],
    },
  );
