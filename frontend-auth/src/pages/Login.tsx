import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { CircleAlertIcon } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "../components/auth/AuthLayout";
import { FormField } from "../components/forms/FormField";
import { PasswordInput } from "../components/forms/PasswordInput";
import { PillButton } from "../components/PillButton";
import { useAuth } from "../contexts/AuthContext";
import { homeFor } from "../utils/auth";
import { describedBy, fieldClass } from "../utils/fieldStyles";

const demoAccounts = [
{ role: "Staff", username: "staff", password: "staff123" },
{ role: "Client", username: "client", password: "client123" }];


interface LoginErrors {
  identifier?: string;
  password?: string;
  form?: string;
}

export function Login() {
  const { login, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as {from?: string;} | null)?.from;
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});

  if (session) return <Navigate to={homeFor(session.role)} replace />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: LoginErrors = {};
    if (!identifier.trim()) next.identifier = "Enter your username or email.";
    if (!password) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const result = await login(identifier, password);
    if (!result.ok) {
      setErrors({ form: result.error });
      return;
    }
    const home = homeFor(result.role);
    toast.success(`Welcome back, ${result.name.split(" ")[0]}`);
    navigate(from && from.startsWith(home) ? from : home, { replace: true });
  }

  return (
    <AuthLayout
      eyebrow="Members & Staff"
      title="Log In"
      footer={
      <div className="rounded-2xl border border-ink/10 bg-paper/60 p-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink/60">Demo accounts</p>
          <ul className="mt-3 divide-y divide-ink/10">
            {demoAccounts.map((a) =>
          <li key={a.role} className="flex items-center justify-between gap-3 py-2.5">
                <p className="text-sm text-ink">
                  <span className="font-medium">{a.role}</span>
                  <span className="ml-2 font-mono text-xs text-ink/55">
                    {a.username} / {a.password}
                  </span>
                </p>
                <button
              type="button"
              onClick={() => {
                setIdentifier(a.username);
                setPassword(a.password);
                setErrors({});
              }}
              className="rounded-full border border-ink/20 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-ink transition-[background-color,color,transform] duration-150 hover:bg-ink hover:text-paper active:scale-95">
              
                  Use
                </button>
              </li>
          )}
          </ul>
        </div>
      }>
      
      {from && !errors.form &&
      <p className="mb-6 rounded-xl bg-cream px-4 py-3 text-sm text-ink/75">Please log in to continue.</p>
      }
      {errors.form &&
      <div role="alert" className="mb-6 flex gap-2.5 rounded-xl border border-rust/30 bg-rust-soft px-4 py-3 text-sm text-rust">
          <CircleAlertIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {errors.form}
        </div>
      }

      <form noValidate onSubmit={handleSubmit} className="space-y-5">
        <FormField id="login-id" label="Email or Username" error={errors.identifier}>
          <input
            id="login-id"
            type="text"
            autoComplete="username"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              setErrors((er) => ({ ...er, identifier: undefined, form: undefined }));
            }}
            placeholder="you@example.rw"
            aria-invalid={!!errors.identifier}
            aria-describedby={describedBy("login-id", errors.identifier)}
            className={fieldClass(!!errors.identifier)} />
          
        </FormField>
        <FormField id="login-password" label="Password" error={errors.password}>
          <PasswordInput
            id="login-password"
            value={password}
            onChange={(v) => {
              setPassword(v);
              setErrors((er) => ({ ...er, password: undefined, form: undefined }));
            }}
            hasError={!!errors.password}
            describedBy={describedBy("login-password", errors.password)} />
          
        </FormField>
        <div className="pt-3">
          <PillButton type="submit" fullWidth>
            Log In
          </PillButton>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-ink/60">
        Don't have an account?{" "}
        <Link to="/apply" className="font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
          Apply for Membership
        </Link>
      </p>
    </AuthLayout>);

}