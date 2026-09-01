import { createContext, useContext, useEffect, useState } from "react";

import api from "../services/api";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
   * Load currently authenticated user
   */
  async function loadUser() {
    try {
      const response = await api.get("/auth/profile");

      setUser(response.data.user);
    } catch (error) {
      // if (error.response?.status === 401) {
      //   // Not authenticated
      //   setUser(null);
      // } else {
      //   console.error("Failed to load user:", error);
      // }

      // const message = error.response?.data?.message;

      // console.log("Status:", error.response?.data?.success);
      // console.log("Message:", message);

      if (error.response?.status === 401) {
        setUser(null);
        return;
      }
    } finally {
      setLoading(false);
    }
  }

  /*
   * Check authentication when app starts
   */
  useEffect(() => {
    loadUser();
  }, []);

  /*
   * Automatically logout when token expires
   */
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,

      async (error) => {
        const status = error.response?.status;
        const url = error.config?.url || "";

        const isAuthRequest =
          url.includes("/auth/login") ||
          url.includes("/auth/profile") ||
          url.includes("/auth/logout");

        if (status === 401 && !isAuthRequest) {
          setUser(null);

          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  /*
   * Login
   */
  async function login(username, password) {
    const response = await api.post("/auth/login", {
      username,
      password,
    });

    const profileResponse = await api.get("/auth/profile");

    setUser(profileResponse.data.user);

    return response.data;
  }

  /*
   * Logout
   */
  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("Unable to logout:", error);
      }
    } finally {
      setUser(null);
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }

  return context;
}
