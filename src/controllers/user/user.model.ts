export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  birthdate?: string;
  prefixPhone?: number;
  phone?: number;
  email: string;
}