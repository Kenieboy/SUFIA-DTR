import { createContext, useContext, useEffect, useState } from "react";

import api from "../services/api";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
   * Check the currently logged-in user.
   *
   * GET /api/auth/profile
   */
  async function loadUser() {
    try {
      const response = await api.get("/auth/profile");

      setUser(response.data.user);
    } catch (error) {
      /*
       * 401 is expected when there is no
       * authenticated session.
       */
      if (error.response?.status === 401) {
        setUser(null);
        return;
      }

      /*
       * Only log unexpected errors.
       */
      console.error("Unable to load user profile:", error);

      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  /*
   * Check authentication when the app starts.
   */
  useEffect(() => {
    loadUser();
  }, []);

  /*
   * Login
   *
   * POST /api/auth/login
   */
  async function login(username, password) {
    const response = await api.post("/auth/login", {
      username,
      password,
    });

    /*
     * The backend should set the authentication
     * cookie during login.
     *
     * After that, retrieve the authenticated
     * user's profile.
     */
    await loadUser();

    return response.data;
  }

  /*
   * Logout
   */
  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      /*
       * A 401 during logout is not a problem.
       * The session is already unauthenticated.
       */
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
