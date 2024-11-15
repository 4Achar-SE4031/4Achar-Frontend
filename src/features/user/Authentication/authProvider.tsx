import { useContext, createContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface AuthContextType {
  token: string;
  loginAction: (data: LoginData) => Promise<string | false>;
  logOut: () => void;
}

interface LoginData {
  username: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string>(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  const loginAction = async (data: LoginData): Promise<string | false> => {
    try {
      const response = await axios.post('http://localhost:5000/Account/jwt/create', data);
      if (response.data) {
        setToken(response.data.access);
        localStorage.setItem("token", response.data.access);
        return "Data received successfully";
      } else if (response.data.message === 'username does not exist') {
        return "username does not exist";
      } else {
        return "password incorrect";
      }
    } catch (error) {
      console.log("An error occurred:", error);
      return false;
    }
  };

  const logOut = () => {
    localStorage.removeItem("userData");
    setToken("");
    localStorage.removeItem("token");
    navigate("/home");
    console.log("logout");
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
import { useContext, createContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface AuthContextType {
  token: string;
  loginAction: (data: LoginData) => Promise<string | false>;
  logOut: () => void;
}

interface LoginData {
  username: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string>(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  const loginAction = async (data: LoginData): Promise<string | false> => {
    try {
      const response = await axios.post('https://eventify.liara.run/auth/jwt/create', data);
      if (response.data) {
        setToken(response.data.access);
        localStorage.setItem("token", response.data.access);
        return "Data received successfully";
      } else if (response.data.message === 'username does not exist') {
        return "username does not exist";
      } else {
        return "password incorrect";
      }
    } catch (error) {
      console.log("An error occurred:", error);
      return false;
    }
  };

  const logOut = () => {
    localStorage.removeItem("userData");
    setToken("");
    localStorage.removeItem("token");
    navigate("/home");
    console.log("logout");
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