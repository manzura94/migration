export interface User {
  id: number;
  login: string;
  city: string;
  street: string;
  houseNumber: number;
  paymentMethod: "cash" | "card";
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  data: {
    access_token: string;
    user: User;
  };
}

export interface UserInfo {
  city?: string;
  street?: string;
  houseNumber?: string;
  paymentMethod?: string;
}

export interface UserData {
  login: string;
  password: string;
  confirmPassword: string;
  city: string;
  street: string;
  houseNumber: number;
  paymentMethod: string;
}
