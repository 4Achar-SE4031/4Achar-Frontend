import { useContext, createContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import agent from "../../../app/api/agent";
import { UserForgetFormValues } from "../../../app/models/user";

interface AuthContextType {
  token: string;
  loginAction: (data: any) => Promise<string | boolean>;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  const loginAction = async (data: UserForgetFormValues): Promise<string | boolean> => {
    try {
      const response = await agent.Account.login(data);
      if (response.token) {
        setToken(response.token);
        localStorage.setItem("token", response.token);
        return "Data received successfully";
      } else if (response.message === 'username does not exist') {
        return "username does not exist";
      } else {
        return "password incorrect";
      }
    } catch (error) {
      return false;
    }
  };

  const logOut = () => {
    localStorage.removeItem("userData");
    setToken("");
    localStorage.removeItem("token");
    navigate("/home");
  };

  return (
    <AuthContext.Provider value={{ token, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
