export interface User {
  first_name: string;
  email: string;
  profileImage?: string;
  portfolio?: string;
  my_service?: string[];
  rating?: number;
  review?: number;
  _id?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export interface ICreateUserRequest {
  first_name: string;
  email: string;
  password: string;
}

export interface ICreateUserResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      first_name: string;
      email: string;
    };
    token: string;
  };
}

export interface IVerifyOTPRequest {
  otp: Number;
}

export interface IVerifyOTPResponse {
  success: boolean;
  message: string;
}

interface ILoginRequest {
  email: string;
  password: string;
}

interface ILoginResponse {
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
  };
}
