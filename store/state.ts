import { TeamUser } from "@/types/team.type";
import { User } from "@/types/user.type";

export interface IState {
  user: User;
  team: TeamUser;
  isSignout: boolean;
  token: string | null;
}

export const initialState: IState = {
  user: {
    first_name: "",
    last_name: "",
    registration_number: "",
    customer_id: "",
    email: "",
    phone_number: "",
    picture: null,
    address: "",
    roles: [
      {
        name: "",
        pivot: {
          user_id: "",
          role_id: "",
        },
      },
    ],
    status: false,
  },
  team: {
    team_user_role_id: 0,
    status: false,
    team_id: 0,
    team: {
      id: 0,
      libelle: "",
      zone_id: 0,
    },
  },
  token: null,
  isSignout: true,
};
