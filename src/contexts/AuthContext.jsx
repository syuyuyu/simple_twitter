import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { checkPermission, login, register } from "../api/auth";

const defaultAuthContext = {
  isAuthenticated: false, // 使用者是否登入的判斷依據，預設為 false，若取得後端的有效憑證，則切換為 true
  currentMember: null, // 當前使用者相關資料，預設為 null，成功登入後就會有使用者資料
  register: null, // 註冊方法
  login: null, // 登入方法
  logout: null, // 登出方法
};

const AuthContext = createContext(defaultAuthContext);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [payload, setPayload] = useState(null);

  const { pathname } = useLocation();

  useEffect(() => {
    const checkTokenIsValid = async () => {
      const token = localStorage.getItem("authToken");
      const role = localStorage.getItem("role");
      if (!token || role === "admin") {
        setIsAuthenticated(false);
        setPayload(null);
        return;
      }
      const result = await checkPermission(token);
      if (result) {
        setIsAuthenticated(true);
        const tempPayload = jwt_decode(token);
        setPayload(tempPayload);
      } else {
        setIsAuthenticated(false);
        setPayload(null);
      }
    };

    checkTokenIsValid();
  }, [pathname]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentMember: payload && {
          id: payload.sub,
          name: payload.name,
          role: payload.role
        },
        register: async (data) => {
          try {
            const res = await register({
              account: data.account,
              name: data.name,
              email: data.email,
              password: data.password,
              checkPassword: data.checkPassword,
            });
            const { success, token, user } = { res };
            const tempPayload = jwt_decode(token);
            if (res) {
              setPayload(tempPayload);
              setIsAuthenticated(true);
              localStorage.setItem("authToken", token);
              localStorage.setItem("userId", user.id);
              localStorage.setItem("role", user.role);
            } else {
              setPayload(null);
              setIsAuthenticated(false);
            }
            return res;
          } catch (err) {
            console.log("register error :", err);
          }
        },
        login: async (data) => {
          const { success, token, user } = await login({
            account: data.account,
            password: data.password,
          });
          const tempPayload = jwt_decode(token);
          if (tempPayload) {
            setPayload(tempPayload);
            setIsAuthenticated(true);
            localStorage.setItem("authToken", token);
            localStorage.setItem("userId", user.id);
            localStorage.setItem("role", user.role);
          } else {
            setPayload(null);
            setIsAuthenticated(false);
          }
          return success;
        },
        logout: () => {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userId");
          localStorage.removeItem("role");
          setPayload(null);
          setIsAuthenticated(false);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
