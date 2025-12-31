import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import config from "../lib/config";

const AuthContext = createContext({
  user: {},
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false,
});

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const checkAuthUser = async () => {
    try {
      setIsLoading(true);

      const resUser = await axios.get(`${config.BACKEND_URL}/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      const userAccount = await axios.get(
        `${config.BACKEND_URL}/account/balance`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );

      if (resUser?.data) {
        setUser({
          ...resUser.data?.user,
          balance: userAccount?.data.balance,
        });
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      navigate("/login");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      localStorage.getItem("token") === "[]" ||
      localStorage.getItem("token") === "{}" ||
      localStorage.getItem("token") === null ||
      !localStorage.getItem("token")
    ) {
      navigate("/login");
    } else {
      checkAuthUser();
    }
  }, []);

  const values = {
    user,
    isLoading,
    isAuthenticated,
    setUser,
    setIsAuthenticated,
    checkAuthUser,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
