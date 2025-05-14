export type Role = {
  id?: number;
  name: string;
  pivot: {
    user_id: string;
    role_id: string;
  };
  created_at?: string;
  updated_at?: string;
};
