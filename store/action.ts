import { Agency } from "@/types/agency.type";
import { TeamUser } from "@/types/team.type";
import { User } from "@/types/user.type";

export type Action = {
  updateState: ({
    user,
    team,
    token,
  }: {
    user: User;
    team: TeamUser;
    token: string;
  }) => void;
  updatePhoto: (photo: string) => void;
  updateProfile: (user: User) => void;
  updateToken: (token: string | undefined) => void;
  signOut: () => void;
};
