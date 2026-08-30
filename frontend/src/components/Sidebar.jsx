import { NavLink } from "react-router-dom";
import {
  Building2,
  Users,
  IdCard,
  Clock3,
  CalendarDays,
  UserX,
  WalletCards,
  CalendarCheck,
  FileText,
  Settings,
  ChevronLeft,
  Menu,
  LogOut,
} from "lucide-react";

import { useUser } from "../context/UserContext";

const menuItems = [
  {
    label: "Company Setup",
    path: "/company-setup",
    icon: Building2,
  },
  {
    label: "Employee Record",
    path: "/employee",
    icon: Users,
  },
  {
    label: "ID Maker",
    path: "/id-maker",
    icon: IdCard,
  },
  {
    label: "Time Sheet",
    path: "/time-sheet",
    icon: Clock3,
  },
  {
    label: "Vacation & Other Leaves",
    path: "/leaves",
    icon: CalendarDays,
  },
  {
    label: "Absence & Tardiness",
    path: "/absence-tardiness",
    icon: UserX,
  },
  {
    label: "Payroll Cutoff",
    path: "/payroll-cutoff",
    icon: WalletCards,
  },
  {
    label: "Holidays",
    path: "/holidays",
    icon: CalendarCheck,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: FileText,
  },
  {
    label: "System",
    path: "/system",
    icon: Settings,
  },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useUser();

  return (
    <aside
      className={`
        fixed left-0 top-0 z-40
        flex h-screen flex-col
        border-r border-slate-800
        bg-slate-950
        text-white
        transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* =========================
          HEADER
      ========================== */}
      <div
        className={`
          flex h-20 shrink-0 items-center
          border-b border-slate-800
          ${collapsed ? "justify-center" : "justify-between px-5"}
        `}
      >
        {!collapsed && (
          <div>
            <h1 className="text-base font-bold tracking-wide">SUFIA</h1>

            <p className="mt-0.5 text-[11px] text-slate-500">
              Employee Management
            </p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="
            flex h-9 w-9
            items-center justify-center
            rounded-lg
            text-slate-400
            transition
            hover:bg-slate-800
            hover:text-white
          "
        >
          {collapsed ? <Menu size={19} /> : <ChevronLeft size={19} />}
        </button>
      </div>

      {/* =========================
          NAVIGATION
      ========================== */}
      <nav
        className="
          min-h-0
          flex-1
          overflow-y-auto
          overflow-x-hidden
          p-3
          scrollbar-hide
        "
      >
        <div className="space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  group relative
                  flex items-center
                  rounded-lg
                  px-3 py-2.5
                  text-[13px]
                  font-medium
                  transition-all duration-200

                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }

                  ${collapsed ? "justify-center" : "gap-3"}
                `}
              >
                <Icon size={18} strokeWidth={1.8} className="shrink-0" />

                {!collapsed && <span className="truncate">{item.label}</span>}

                {/* Tooltip */}
                {collapsed && (
                  <span
                    className="
                      pointer-events-none
                      absolute left-full ml-3
                      z-50
                      whitespace-nowrap
                      rounded-md
                      bg-slate-900
                      px-3 py-2
                      text-[12px]
                      font-medium
                      text-white
                      opacity-0
                      shadow-xl
                      transition-opacity
                      duration-150
                      group-hover:opacity-100
                    "
                  >
                    {item.label}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* =========================
          USER AREA
      ========================== */}
      <div
        className="
          shrink-0
          border-t border-slate-800
          p-3
        "
      >
        <div
          className={`
            group relative
            flex items-center
            rounded-lg
            bg-slate-900
            p-2.5
            ${collapsed ? "justify-center" : "gap-3"}
          `}
        >
          {/* Avatar */}
          <div
            className="
              flex h-8 w-8
              shrink-0
              items-center justify-center
              rounded-full
              bg-blue-600
              text-xs
              font-bold
              text-white
            "
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          {/* User Information */}
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-medium text-slate-200">
                  {user?.name || user?.username}
                </p>

                <p className="mt-0.5 truncate text-[10px] capitalize text-slate-500">
                  {user?.role || "User"}
                </p>
              </div>

              <button
                onClick={logout}
                title="Logout"
                className="
                  rounded-md
                  p-1.5
                  text-slate-500
                  transition
                  hover:bg-slate-800
                  hover:text-red-400
                "
              >
                <LogOut size={16} />
              </button>
            </>
          )}

          {/* Collapsed Logout */}
          {collapsed && (
            <button
              onClick={logout}
              title="Logout"
              className="
                absolute
                -top-11
                left-1/2
                flex h-9 w-9
                -translate-x-1/2
                items-center justify-center
                rounded-lg
                border border-slate-800
                bg-slate-900
                text-slate-400
                opacity-0
                shadow-lg
                transition
                group-hover:opacity-100
                hover:bg-slate-800
                hover:text-red-400
              "
            >
              <LogOut size={17} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
