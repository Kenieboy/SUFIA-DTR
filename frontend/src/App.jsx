import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { UserProvider } from "./context/UserContext";

import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import EmployeeRecord from "./pages/EmployeeRecord";
import EmployeeForm from "./components/EmployeeForm";

function Page({ title }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      {" "}
      <h1 className="text-lg font-semibold tracking-tight text-slate-800">
        {" "}
        {title}{" "}
      </h1>{" "}
      <p className="mt-1 text-[12px] text-slate-500"> {title} module </p>{" "}
    </div>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Page title="Dashboard" />} />

              <Route
                path="/company-setup"
                element={<Page title="Company Setup" />}
              />

              <Route path="/employee" element={<EmployeeRecord />} />
              <Route path="/employee/new" element={<EmployeeForm />} />
              <Route path="/employee/:id/edit" element={<EmployeeForm />} />

              <Route path="/id-maker" element={<Page title="ID Maker" />} />

              <Route path="/time-sheet" element={<Page title="Time Sheet" />} />

              <Route
                path="/leaves"
                element={<Page title="Vacation & Other Leaves" />}
              />

              <Route
                path="/absence-tardiness"
                element={<Page title="Absence & Tardiness" />}
              />

              <Route
                path="/payroll-cutoff"
                element={<Page title="Payroll Cutoff" />}
              />

              <Route path="/holidays" element={<Page title="Holidays" />} />

              <Route path="/reports" element={<Page title="Reports" />} />

              <Route path="/system" element={<Page title="System" />} />
            </Route>
          </Route>

          {/* Unknown route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}
