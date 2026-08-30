import { Outlet } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../components/Sidebar";
import { useUser } from "../context/UserContext";

export default function MainLayout() {
  // Sidebar collapsed by default
  const [collapsed, setCollapsed] = useState(true);

  const { user } = useUser();

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <main
        className={`
          min-h-screen
          transition-all duration-300
          ${collapsed ? "ml-20" : "ml-64"}
        `}
      >
        {/* =========================
            TOP HEADER
        ========================== */}
        <header
          className="
            sticky top-0 z-30
            flex h-18 items-center
            justify-between
            border-b border-slate-200
            bg-white
            px-5
            shadow-sm
          "
        >
          {/* Page Information */}
          <div>
            <h2
              className="
                text-lg
                font-semibold
                tracking-tight
                text-slate-800
              "
            >
              HR Management System
            </h2>

            <p
              className="
                mt-0.5
                text-[12px]
                text-slate-500
              "
            >
              Employee management and payroll
            </p>
          </div>

          {/* User Information */}
          <div className="flex items-center gap-3">
            {/* Name + Role */}
            <div className="hidden text-right sm:block">
              <p
                className="
                  text-[12px]
                  font-medium
                  text-slate-700
                "
              >
                {user?.name || user?.username}
              </p>

              <p
                className="
                  mt-0.5
                  text-[10px]
                  capitalize
                  text-slate-500
                "
              >
                {user?.role || "User"}
              </p>
            </div>

            {/* Avatar */}
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-blue-600
                text-xs
                font-semibold
                text-white
                shadow-sm
              "
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        {/* =========================
            PAGE CONTENT
        ========================== */}
        <section className="p-5">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
