import { Role } from "./role.type";

export interface User {
  id?: number;
  first_name: string;
  last_name: string;
  registration_number: string;
  customer_id: number;
  supervisor_id?: number;
  email: string;
  phone_number: string;
  picture?: string | null;
  address: string;
  roles: Role[];
  status: boolean;
  created_at?: string;
  updated_at?: string;
}
