export interface User {
  name: string;
  email: string;
  phone: string;
  accountVerified?: true;
  code?: 0;
  created_at?: string;
  last_login?: string;
  password?: string;
  __v?: number;
  _id?: string;
  socialMedia_ID? :string;
  avatar: string;
}
