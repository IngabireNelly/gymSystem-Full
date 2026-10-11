import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api, errorMessage } from "../api/client";
import { useAuth } from "./AuthContext";
import {
  Application,
  Client,
  ClientUpdate,
  Equipment,
  EquipmentUpdate,
  MembershipType,
  NewEquipment,
  NewRental,
  Payment,
  PaymentDetails,
  Rental } from
"../types/gym";

type ApplicationResult = {ok: true;client: Client;} | {ok: false;error: string;};
type RenewalResult = {expiry: string;payment: Payment;};

interface GymDataValue {
  equipment: Equipment[];
  clients: Client[];
  rentals: Rental[];
  payments: Payment[];
  refresh: () => Promise<void>;
  addEquipment: (input: NewEquipment) => Promise<Equipment | null>;
  updateEquipment: (id: string, update: EquipmentUpdate) => Promise<boolean>;
  deleteEquipment: (id: string) => Promise<void>;
  submitApplication: (input: Application) => Promise<ApplicationResult>;
  approveClient: (id: string) => Promise<void>;
  rejectClient: (id: string) => Promise<void>;
  updateClient: (id: string, update: ClientUpdate) => Promise<void>;
  setClientActive: (id: string, active: boolean) => Promise<void>;
  createRental: (input: NewRental) => Promise<Rental | null>;
  returnRental: (id: string) => Promise<void>;
  renewMembership: (clientId: string, type: MembershipType, details: PaymentDetails) => Promise<RenewalResult | null>;
  changePlan: (clientId: string, type: MembershipType) => Promise<void>;
}

const GymDataContext = createContext<GymDataValue | null>(null);

type Outcome<T> = {ok: true;value: T;} | {ok: false;error: string;};

async function call<T>(fn: () => Promise<T>): Promise<Outcome<T>> {
  try {
    return {ok: true, value: await fn()};
  } catch (e) {
    return {ok: false, error: errorMessage(e)};
  }
}

export function GymDataProvider({ children }: {children: React.ReactNode;}) {
  const { currentUser } = useAuth();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Staff load everything. Members load only what the server lets them see: equipment,
  // their own profile, their own rentals, and their own payments.
  const refresh = useCallback(async () => {
    if (!currentUser) return;
    if (currentUser.role === "STAFF") {
      const [eq, cl, rn, pm] = await Promise.all([
      api<Equipment[]>("/equipment"),
      api<Client[]>("/members"),
      api<Rental[]>("/rentals"),
      api<Payment[]>("/payments")]
      );
      setEquipment(eq);
      setClients(cl);
      setRentals(rn);
      setPayments(pm);
    } else {
      const [eq, me, rn, pm] = await Promise.all([
      api<Equipment[]>("/equipment"),
      api<Client>("/me"),
      api<Rental[]>("/me/rentals"),
      api<Payment[]>("/me/payments")]
      );
      setEquipment(eq);
      setClients([me]);
      setRentals(rn);
      setPayments(pm);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      setEquipment([]);
      setClients([]);
      setRentals([]);
      setPayments([]);
      setLoadError(null);
      setReady(true);
      return;
    }
    let cancelled = false;
    setReady(false);
    setLoadError(null);
    refresh().
    then(() => {if (!cancelled) setReady(true);}).
    catch((e) => {if (!cancelled) setLoadError(errorMessage(e));});
    return () => {cancelled = true;};
  }, [currentUser, refresh]);

  // Runs a change on the server, reloads all data on success, and shows failures as a toast.
  const write = useCallback(
    async function <T,>(fn: () => Promise<T>): Promise<T | null> {
      const result = await call(fn);
      if (!result.ok) {
        toast.error(result.error);
        return null;
      }
      await refresh();
      return result.value;
    },
    [refresh]
  );

  const addEquipment = useCallback(
    (input: NewEquipment) =>
    write(() => api<Equipment>("/equipment", { method: "POST", body: input })),
    [write]
  );

  const updateEquipment = useCallback(
    async (id: string, update: EquipmentUpdate) => {
      const current = equipment.find((e) => e.id === id);
      if (!current) return false;
      const merged = { ...current, ...update };
      const result = await write(() =>
      api<Equipment>(`/equipment/${id}`, {
        method: "PUT",
        body: {
          name: merged.name,
          category: merged.category,
          dailyRate: merged.dailyRate,
          purchaseDate: merged.purchaseDate,
          status: update.status
        }
      })
      );
      return result !== null;
    },
    [equipment, write]
  );

  const deleteEquipment = useCallback(
    async (id: string) => {
      await write(() => api<void>(`/equipment/${id}`, { method: "DELETE" }));
    },
    [write]
  );

  const submitApplication = useCallback(
    async (input: Application): Promise<ApplicationResult> => {
      const result = await call(() => api<Client>("/applications", { method: "POST", body: input }));
      if (!result.ok) return { ok: false, error: result.error };
      await refresh();
      return { ok: true, client: result.value };
    },
    [refresh]
  );

  const approveClient = useCallback(
    async (id: string) => {
      await write(() => api<Client>(`/members/${id}/approve`, { method: "PUT" }));
    },
    [write]
  );

  const rejectClient = useCallback(
    async (id: string) => {
      await write(() => api<Client>(`/members/${id}/reject`, { method: "PUT" }));
    },
    [write]
  );

  const updateClient = useCallback(
    async (id: string, update: ClientUpdate) => {
      await write(() => api<Client>(`/members/${id}`, { method: "PUT", body: update }));
    },
    [write]
  );

  const setClientActive = useCallback(
    async (id: string, active: boolean) => {
      await write(() => api<Client>(`/members/${id}/status`, { method: "PUT", body: { active } }));
    },
    [write]
  );

  const createRental = useCallback(
    (input: NewRental) =>
    write(() =>
    api<Rental>("/rentals", {
      method: "POST",
      body: { equipmentId: input.equipmentId, clientId: input.clientId, dueDate: input.dueDate }
    })
    ),
    [write]
  );

  const returnRental = useCallback(
    async (id: string) => {
      await write(() => api<Rental>(`/rentals/${id}/return`, { method: "PUT" }));
    },
    [write]
  );

  const renewMembership = useCallback(
    (clientId: string, type: MembershipType, details: PaymentDetails) =>
    write(() =>
    api<RenewalResult>(`/members/${clientId}/renewals`, {
      method: "POST",
      body: { membershipType: type, method: details.method, methodDetail: details.methodDetail }
    })
    ),
    [write]
  );

  const changePlan = useCallback(
    async (clientId: string, type: MembershipType) => {
      await write(() => api<Client>(`/members/${clientId}/plan`, { method: "PUT", body: { membershipType: type } }));
    },
    [write]
  );

  const value = useMemo<GymDataValue>(
    () => ({
      equipment,
      clients,
      rentals,
      payments,
      refresh,
      addEquipment,
      updateEquipment,
      deleteEquipment,
      submitApplication,
      approveClient,
      rejectClient,
      updateClient,
      setClientActive,
      createRental,
      returnRental,
      renewMembership,
      changePlan
    }),
    [
    equipment,
    clients,
    rentals,
    payments,
    refresh,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    submitApplication,
    approveClient,
    rejectClient,
    updateClient,
    setClientActive,
    createRental,
    returnRental,
    renewMembership,
    changePlan]
  );

  if (currentUser && !ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-6 text-center">
        {loadError ?
        <div>
            <p className="text-sm text-ink/80">{loadError}</p>
            <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-full border border-ink px-5 py-2 text-sm text-ink">
            
              Try again
            </button>
          </div> :

        <p className="text-sm text-ink/60">Loading…</p>
        }
      </div>);

  }

  return <GymDataContext.Provider value={value}>{children}</GymDataContext.Provider>;
}

export function useGymData(): GymDataValue {
  const ctx = useContext(GymDataContext);
  if (!ctx) throw new Error("useGymData must be used inside GymDataProvider");
  return ctx;
}
