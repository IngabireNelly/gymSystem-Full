import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AccessDenied } from "./AccessDenied";
import { useAuth } from "../../contexts/AuthContext";
import { Role } from "../../types/gym";

export function RequireRole({ role, children }: {role: Role;children: React.ReactNode;}) {
  const { session } = useAuth();
  const location = useLocation();

  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (session.role !== role) return <AccessDenied requiredRole={role} currentRole={session.role} />;
  return <>{children}</>;
}