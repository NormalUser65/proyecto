import { createContext } from "react";

const UserContext = createContext({
  token: null,
  user: null,
  saveUser: () => {},
  clearUser: () => {},
  decodeToken: () => {},
  authorize: () => false,
  isAuthenticated: false,
});

export default UserContext;