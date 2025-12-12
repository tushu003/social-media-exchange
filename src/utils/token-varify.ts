import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  email: string;
  role: string;
  userId: string;
  exp: number;
  iat: number;
}

export const verifiedUser = () => {
  if (typeof window === "undefined") {
    // Return null during SSR to avoid hydration issues
    return null;
  }

  const accessToken = localStorage.getItem("accessToken");
  let userData: DecodedToken | null = null;

  if (accessToken) {
    userData = jwtDecode<DecodedToken>(accessToken);
    // Check if token is expired
    if (userData.exp * 1000 < Date.now()) {
      localStorage.removeItem("accessToken");
      return null;
    }
  }

  return userData;
};

export const isAdmin = () => {
  const user = verifiedUser();
  return user?.role === "admin";
};

export const isAuthenticated = () => {
  return !!verifiedUser();
};
