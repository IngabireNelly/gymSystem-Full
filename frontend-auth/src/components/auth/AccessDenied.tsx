import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlertIcon } from "lucide-react";
import { PillButton } from "../PillButton";
import { useAuth } from "../../contexts/AuthContext";
import { Role } from "../../types/gym";
import { homeFor } from "../../utils/auth";

export function AccessDenied({ requiredRole, currentRole }: {requiredRole: Role;currentRole: Role;}) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-cream px-5 text-ink">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper">
          <ShieldAlertIcon className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="mt-6 font-serif text-lg font-semibold uppercase tracking-[0.2em] text-gold-deep">Error 403</p>
        <h1 className="mt-2 font-display text-5xl uppercase leading-none md:text-6xl">Access Denied</h1>
        <p className="mt-4 text-[15px] font-light leading-relaxed text-ink/70">
          This area is for {requiredRole === "STAFF" ? "staff" : "members"} only. You're signed in with a{" "}
          {currentRole === "STAFF" ? "staff" : "member"} account.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <PillButton to={homeFor(currentRole)}>Go to My Dashboard</PillButton>
          <PillButton
            variant="outline-dark"
            onClick={() => {
              logout();
              navigate("/login");
            }}>
            
            Log Out
          </PillButton>
        </div>
      </div>
    </div>);

}