import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { Eye, EyeOff, LockKeyhole, User } from "lucide-react";

import { useUser } from "../context/UserContext";

export default function Login() {
  const { login, isAuthenticated } = useUser();

  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  /*
   * If already logged in,
   * don't show the login page.
   */
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    /*
     * Basic validation
     */
    if (!username.trim()) {
      setError("Please enter your username.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      /*
       * UserContext login() will:
       *
       * 1. POST /api/auth/login
       * 2. GET /api/auth/profile
       * 3. setUser()
       * 4. refresh the page after successful validation
       */
      await login(username.trim(), password);

      /*
       * If the user was redirected to login
       * from a protected page, send them back
       * there after successful login.
       */
      const from = location.state?.from?.pathname || "/";

      navigate(from, {
        replace: true,
      });
    } catch (error) {
      /*
       * Don't console.error() expected login
       * failures.
       */

      if (error.response?.status === 401) {
        setError(
          error.response?.data?.message || "Invalid username or password.",
        );
      } else if (error.response?.status === 403) {
        setError(
          error.response?.data?.message || "Your account does not have access.",
        );
      } else {
        setError("Unable to connect to the server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* =========================
          LEFT BRANDING
      ========================== */}
      <div
        className="
          hidden
          w-1/2
          bg-slate-950
          p-12
          text-white
          lg:flex
          lg:flex-col
          lg:justify-between
        "
      >
        {/* Logo */}
        <div>
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-blue-600
              "
            >
              <User size={24} />
            </div>

            <div>
              <h1 className="text-xl font-bold">SUFIA HR Management</h1>

              <p className="text-sm text-slate-400">
                Workforce Management System
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h2
            className="
              max-w-lg
              text-4xl
              font-bold
              leading-tight
            "
          ></h2>

          <p
            className="
              mt-5
              max-w-lg
              text-slate-400
            "
          ></p>
        </div>

        {/* Footer */}
        <p className="text-sm text-slate-500">
          © 2026 HR Management System - FRP
        </p>
      </div>

      {/* =========================
          LOGIN AREA
      ========================== */}
      <div
        className="
          flex
          flex-1
          items-center
          justify-center
          p-6
        "
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 lg:hidden">
            <h1
              className="
                text-2xl
                font-bold
                text-slate-900
              "
            >
              HR Management System
            </h1>

            <p className="text-sm text-slate-500">
              Workforce Management System
            </p>
          </div>

          {/* Login Card */}
          <div
            className="
              rounded-2xl
              bg-white
              p-8
              shadow-xl
              shadow-slate-200/50
            "
          >
            {/* Header */}
            <div className="mb-8">
              <h2
                className="
                  text-2xl
                  font-bold
                  text-slate-900
                "
              >
                Welcome back
              </h2>

              <p
                className="
                  mt-2
                  text-sm
                  text-slate-500
                "
              >
                Sign in to access the HR management system.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                className="
                  mb-5
                  rounded-lg
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  text-red-600
                "
              >
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-slate-700
                  "
                >
                  Username
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    autoComplete="username"
                    autoFocus
                    disabled={loading}
                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-300
                      bg-white
                      py-3
                      pl-10
                      pr-4
                      text-sm
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-500/10
                      disabled:bg-slate-100
                    "
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-slate-700
                  "
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    disabled={loading}
                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-300
                      bg-white
                      py-3
                      pl-10
                      pr-12
                      text-sm
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-500/10
                      disabled:bg-slate-100
                    "
                  />

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => setShowPassword(!showPassword)}
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                      transition
                      hover:text-slate-600
                    "
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  rounded-lg
                  bg-blue-600
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-blue-600/20
                  transition
                  hover:bg-blue-700
                  focus:outline-none
                  focus:ring-4
                  focus:ring-blue-500/20
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Footer */}
            <p
              className="
                mt-6
                text-center
                text-xs
                text-slate-400
              "
            >
              Authorized personnel only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
