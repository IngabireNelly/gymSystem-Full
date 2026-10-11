import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { GymDataProvider } from "./contexts/GymDataContext";
import { AuthProvider } from "./contexts/AuthContext";
import { RequireRole } from "./components/auth/RequireRole";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Apply } from "./pages/Apply";
import { ClientHome } from "./pages/client/ClientHome";
import { ClientBrowse } from "./pages/client/ClientBrowse";
import { ClientRentals } from "./pages/client/ClientRentals";
import { ClientProfile } from "./pages/client/ClientProfile";
import { ClientBilling } from "./pages/client/ClientBilling";
import { StaffHome } from "./pages/staff/StaffHome";
import { StaffEquipment } from "./pages/staff/StaffEquipment";
import { StaffMembers } from "./pages/staff/StaffMembers";
import { StaffRentals } from "./pages/staff/StaffRentals";
import { StaffApplications } from "./pages/staff/StaffApplications";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GymDataProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/apply" element={<Apply />} />

            <Route
              path="/client"
              element={
              <RequireRole role="CLIENT">
                  <DashboardLayout role="CLIENT" />
                </RequireRole>
              }>
              
              <Route index element={<ClientHome />} />
              <Route path="equipment" element={<ClientBrowse />} />
              <Route path="rentals" element={<ClientRentals />} />
              <Route path="profile" element={<ClientProfile />} />
              <Route path="billing" element={<ClientBilling />} />
            </Route>

            <Route
              path="/staff"
              element={
              <RequireRole role="STAFF">
                  <DashboardLayout role="STAFF" />
                </RequireRole>
              }>
              
              <Route index element={<StaffHome />} />
              <Route path="equipment" element={<StaffEquipment />} />
              <Route path="members" element={<StaffMembers />} />
              <Route path="rentals" element={<StaffRentals />} />
              <Route path="applications" element={<StaffApplications />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#111111",
                color: "#F7F3EE",
                border: "1px solid #111111",
                borderRadius: "16px",
                fontFamily: "Inter, system-ui, sans-serif"
              }
            }} />
          
        </GymDataProvider>
      </AuthProvider>
    </BrowserRouter>);

}