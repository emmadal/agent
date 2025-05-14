export type TeamUser = {
  team_user_role_id: number;
  status: boolean;
  team_id: number;
  team: {
    id: number;
    libelle: string;
    zone_id: number;
  };
};
