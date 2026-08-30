import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Eye,
  UserX,
  Users,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getEmployees } from "../services/employeeService";

function EmployeeRecord() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [department, setDepartment] = useState("All");
  const [openMenu, setOpenMenu] = useState(null);

  /*
   * ========================================
   * GET EMPLOYEES
   * ========================================
   */

  const {
    data: employees = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["employees", search],
    queryFn: () => getEmployees(search),
    staleTime: 1000 * 60 * 5,
  });

  /*
   * ========================================
   * DEPARTMENTS
   * ========================================
   */

  const departments = useMemo(() => {
    const values = employees
      .map((employee) => employee.department_name)
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [employees]);

  /*
   * ========================================
   * FILTER EMPLOYEES
   * ========================================
   */

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const employeeStatus = employee.is_active ? "Active" : "Inactive";

      const matchesStatus = status === "All" || employeeStatus === status;

      const matchesDepartment =
        department === "All" || employee.department_name === department;

      return matchesStatus && matchesDepartment;
    });
  }, [employees, status, department]);

  /*
   * ========================================
   * SUMMARY
   * ========================================
   */

  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (employee) => Number(employee.is_active) === 1,
  ).length;

  const inactiveEmployees = employees.filter(
    (employee) => Number(employee.is_active) === 0,
  ).length;

  return (
    <div className="space-y-4">
      {/* ======================================
          PAGE HEADER
      ======================================= */}

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-800">
            Employee Record
          </h1>

          <p className="mt-1 text-[12px] text-slate-500">
            Manage employee information and records.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/employee/new")}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-blue-600
            px-3
            py-2
            text-[12px]
            font-medium
            text-white
            shadow-sm
            transition
            hover:bg-blue-700
          "
        >
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      {/* ======================================
          SUMMARY
      ======================================= */}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Total */}

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500">
                Total Employees
              </p>

              <p className="mt-1 text-xl font-semibold text-slate-800">
                {totalEmployees}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Users size={18} />
            </div>
          </div>
        </div>

        {/* Active */}

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500">
                Active Employees
              </p>

              <p className="mt-1 text-xl font-semibold text-slate-800">
                {activeEmployees}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Users size={18} />
            </div>
          </div>
        </div>

        {/* Inactive */}

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500">
                Inactive Employees
              </p>

              <p className="mt-1 text-xl font-semibold text-slate-800">
                {inactiveEmployees}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <Users size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* ======================================
          TABLE CARD
      ======================================= */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* ======================================
            FILTERS
        ======================================= */}

        <div
          className="
            flex
            flex-col
            gap-3
            border-b
            border-slate-200
            p-4
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          {/* Search */}

          <div className="relative w-full lg:max-w-sm">
            <Search
              size={16}
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee..."
              className="
                w-full
                rounded-lg
                border
                border-slate-200
                bg-slate-50
                py-2
                pl-9
                pr-3
                text-[12px]
                text-slate-700
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-500
                focus:bg-white
                focus:ring-2
                focus:ring-blue-500/10
              "
            />
          </div>

          {/* Filters */}

          <div className="flex flex-wrap gap-2">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="
                rounded-lg
                border
                border-slate-200
                bg-white
                px-3
                py-2
                text-[12px]
                text-slate-600
                outline-none
                focus:border-blue-500
              "
            >
              {departments.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All Departments" : item}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="
                rounded-lg
                border
                border-slate-200
                bg-white
                px-3
                py-2
                text-[12px]
                text-slate-600
                outline-none
                focus:border-blue-500
              "
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* ======================================
            LOADING
        ======================================= */}

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-2 text-[12px] text-slate-500">
              <Loader2 size={16} className="animate-spin" />
              Loading employees...
            </div>
          </div>
        )}

        {/* ======================================
            ERROR
        ======================================= */}

        {isError && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-[12px] font-medium text-red-500">
              Failed to load employees.
            </p>

            <p className="mt-1 text-[11px] text-slate-400">
              {error?.response?.data?.message || "Something went wrong."}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="
                mt-3
                rounded-lg
                bg-blue-600
                px-3
                py-2
                text-[11px]
                font-medium
                text-white
                hover:bg-blue-700
              "
            >
              Try Again
            </button>
          </div>
        )}

        {/* ======================================
            TABLE
        ======================================= */}

        {!isLoading && !isError && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Employee
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Department
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Position
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Contact
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => {
                    const status =
                      Number(employee.is_active) === 1 ? "Active" : "Inactive";

                    const initials = employee.full_name
                      ?.split(" ")
                      .filter(Boolean)
                      .map((name) => name[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase();

                    return (
                      <tr
                        key={employee.id}
                        className="
                          border-b
                          border-slate-100
                          transition
                          hover:bg-slate-50
                        "
                      >
                        {/* Employee */}

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                overflow-hidden
                                rounded-full
                                bg-blue-50
                                text-[11px]
                                font-semibold
                                text-blue-600
                              "
                            >
                              {employee.photo ? (
                                <img
                                  src={`/uploads/${employee.photo}`}
                                  alt={employee.full_name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                initials || "NA"
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-[12px] font-medium text-slate-700">
                                {employee.full_name}
                              </p>

                              <p className="mt-0.5 text-[10px] text-slate-400">
                                {employee.employee_no}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Department */}

                        <td className="px-4 py-3 text-[12px] text-slate-600">
                          {employee.department_name || "-"}
                        </td>

                        {/* Position */}

                        <td className="px-4 py-3 text-[12px] text-slate-600">
                          {employee.job_title || "-"}
                        </td>

                        {/* Contact */}

                        <td className="px-4 py-3 text-[12px] text-slate-500">
                          {employee.mobile_phone || employee.home_phone || "-"}
                        </td>

                        {/* Status */}

                        <td className="px-4 py-3">
                          <span
                            className={`
                              inline-flex
                              rounded-full
                              px-2
                              py-1
                              text-[10px]
                              font-medium

                              ${
                                status === "Active"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-slate-100 text-slate-500"
                              }
                            `}
                          >
                            {status}
                          </span>
                        </td>

                        {/* Actions */}

                        <td className="relative px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenu(
                                openMenu === employee.id ? null : employee.id,
                              )
                            }
                            className="
                              rounded-md
                              p-1.5
                              text-slate-400
                              transition
                              hover:bg-slate-100
                              hover:text-slate-700
                            "
                          >
                            <MoreHorizontal size={17} />
                          </button>

                          {openMenu === employee.id && (
                            <div
                              className="
                                absolute
                                right-4
                                top-10
                                z-20
                                w-36
                                rounded-lg
                                border
                                border-slate-200
                                bg-white
                                p-1
                                text-left
                                shadow-lg
                              "
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(`/employee/${employee.id}`)
                                }
                                className="
                                  flex
                                  w-full
                                  items-center
                                  gap-2
                                  rounded-md
                                  px-3
                                  py-2
                                  text-[11px]
                                  text-slate-600
                                  hover:bg-slate-50
                                "
                              >
                                <Eye size={14} />
                                View Record
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  navigate(`/employee/${employee.id}/edit`)
                                }
                                className="
                                  flex
                                  w-full
                                  items-center
                                  gap-2
                                  rounded-md
                                  px-3
                                  py-2
                                  text-[11px]
                                  text-slate-600
                                  hover:bg-slate-50
                                "
                              >
                                <Pencil size={14} />
                                Edit Employee
                              </button>

                              <button
                                type="button"
                                className="
                                  flex
                                  w-full
                                  items-center
                                  gap-2
                                  rounded-md
                                  px-3
                                  py-2
                                  text-[11px]
                                  text-red-500
                                  hover:bg-red-50
                                "
                              >
                                <UserX size={14} />
                                Deactivate
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center">
                      <p className="text-[12px] font-medium text-slate-500">
                        No employees found
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        Try changing your search or filters.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ======================================
            PAGINATION
        ======================================= */}

        {!isLoading && !isError && filteredEmployees.length > 0 && (
          <div
            className="
                flex
                items-center
                justify-between
                border-t
                border-slate-200
                px-4
                py-3
              "
          >
            <p className="text-[11px] text-slate-500">
              Showing{" "}
              <span className="font-medium text-slate-700">
                {filteredEmployees.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-700">
                {employees.length}
              </span>{" "}
              employees
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled
                className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-md
                    border
                    border-slate-200
                    text-slate-400
                    disabled:opacity-50
                  "
              >
                <ChevronLeft size={14} />
              </button>

              <button
                type="button"
                className="
                    flex
                    h-7
                    min-w-7
                    items-center
                    justify-center
                    rounded-md
                    bg-blue-600
                    px-2
                    text-[11px]
                    font-medium
                    text-white
                  "
              >
                1
              </button>

              <button
                type="button"
                className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-md
                    border
                    border-slate-200
                    text-slate-500
                    transition
                    hover:bg-slate-50
                  "
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeRecord;
