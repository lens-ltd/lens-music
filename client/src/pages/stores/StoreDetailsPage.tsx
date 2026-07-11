import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Button from "@/components/inputs/Button";
import Combobox from "@/components/inputs/Combobox";
import Input from "@/components/inputs/Input";
import { KeyValuePair } from "@/components/inputs/KeyValuePair";
import Loader from "@/components/inputs/Loader";
import { Heading } from "@/components/text/Headings";
import UserLayout from "@/containers/UserLayout";
import { PERMISSIONS } from "@/constants/permission.constants";
import { useGetStore, useUpdateStore } from "@/hooks/stores/store.hooks";
import { useAppSelector } from "@/state/hooks";
import {
  StoreDeliveryProtocol,
  UpdateStorePayload,
} from "@/types/models/store.types";
import {
  capitalizeString,
  formatDate,
  getStatusBackgroundColor,
} from "@/utils/strings.helper";

const deliveryProtocolOptions = Object.values(StoreDeliveryProtocol).map(
  (value) => ({
    label: value,
    value,
  }),
);

const StoreDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const canRead =
    user?.permissions?.includes(PERMISSIONS.READ_STORE) ||
    user?.permissions?.includes(PERMISSIONS.UPDATE_STORE);
  const canUpdate = user?.permissions?.includes(PERMISSIONS.UPDATE_STORE);

  const {
    getStore,
    data: store,
    isFetching,
    isError,
    error,
    isSuccess,
    isUninitialized,
  } = useGetStore();
  const { updateStore, isLoading: isSaving } = useUpdateStore();

  const [formState, setFormState] = useState<UpdateStorePayload>({
    ddexPartyId: "",
    deliveryProtocol: undefined,
    deliveryEndpoint: "",
  });

  useEffect(() => {
    if (id && canRead) {
      void getStore({ id });
    }
  }, [getStore, id, canRead]);

  useEffect(() => {
    if (store) {
      setFormState({
        ddexPartyId: store.ddexPartyId || "",
        deliveryProtocol: store.deliveryProtocol,
        deliveryEndpoint: store.deliveryEndpoint || "",
      });
    }
  }, [store]);

  if (!canRead) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isUninitialized || isFetching) {
    return (
      <UserLayout>
        <main className="flex min-h-[50vh] w-full items-center justify-center">
          <Loader className="text-primary" />
        </main>
      </UserLayout>
    );
  }

  if (isError) {
    const message =
      (error as { data?: { message?: string } })?.data?.message ||
      "Failed to load store details.";
    return (
      <UserLayout>
        <main className="flex w-full flex-col gap-4">
          <nav className="flex w-full items-center justify-between gap-3">
            <Heading>Store Details</Heading>
            <Button route="/stores">Back to stores</Button>
          </nav>
          <section className="w-full rounded-lg bg-[color:var(--lens-sand)]/10 p-8 text-center">
            <p className="text-[13px] text-[color:var(--lens-ink)]/60">{message}</p>
          </section>
        </main>
      </UserLayout>
    );
  }

  if (isSuccess && (!store || store.id !== id)) {
    return (
      <UserLayout>
        <main className="flex w-full flex-col gap-4">
          <nav className="flex w-full items-center justify-between gap-3">
            <Heading>Store Details</Heading>
            <Button route="/stores">Back to stores</Button>
          </nav>
          <section className="w-full rounded-lg bg-[color:var(--lens-sand)]/10 p-8 text-center">
            <p className="text-[13px] text-[color:var(--lens-ink)]/60">
              Store not found.
            </p>
          </section>
        </main>
      </UserLayout>
    );
  }

  const handleSave = async () => {
    if (!id || !canUpdate) return;

    try {
      await updateStore({
        id,
        body: {
          ddexPartyId: formState.ddexPartyId?.trim() || undefined,
          deliveryProtocol: formState.deliveryProtocol || undefined,
          deliveryEndpoint: formState.deliveryEndpoint?.trim() || undefined,
        },
      }).unwrap();
      toast.success("Store updated successfully.");
      await getStore({ id });
    } catch (err) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Unable to update store.";
      toast.error(message);
    }
  };

  const statusLabel = store?.isActive ? "ACTIVE" : "INACTIVE";

  return (
    <UserLayout>
      <main className="flex w-full flex-col gap-5">
        <nav className="flex w-full items-center justify-between gap-3">
          <div>
            <Heading>Store Details</Heading>
            <p className="mt-1 text-[13px] font-normal text-[color:var(--lens-ink)]/60">
              Review store identity and configure DDEX delivery metadata.
            </p>
          </div>
          <Button route="/stores">Back to stores</Button>
        </nav>

        <section className="flex w-full flex-col gap-5 rounded-lg bg-[color:var(--lens-sand)]/10 p-5 sm:p-6">
          <div className="flex flex-col gap-3 border-b border-[color:var(--lens-sand)]/70 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-[20px] font-semibold text-[color:var(--lens-ink)]">
                {store?.name || "Store"}
              </h2>
              <p className="mt-1 font-mono text-[12px] text-[color:var(--lens-ink)]/55">
                {store?.slug || "—"}
              </p>
            </div>
            <span className={getStatusBackgroundColor(statusLabel)}>
              {capitalizeString(statusLabel)}
            </span>
          </div>

          <div>
            <Heading type="h3" className="!text-[15px]">
              Overview
            </Heading>
            <p className="mt-1 text-[12px] text-[color:var(--lens-ink)]/50">
              Identity fields are managed by seeds and are read-only here.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <KeyValuePair
                keyText="Name"
                valueText={store?.name || "—"}
                className="h-full border border-[color:var(--lens-sand)]/50 bg-white p-3"
              />
              <KeyValuePair
                keyText="Slug"
                valueText={store?.slug || "—"}
                className="h-full border border-[color:var(--lens-sand)]/50 bg-white p-3"
              />
              <KeyValuePair
                keyText="Sort order"
                valueText={String(store?.sortOrder ?? "—")}
                className="h-full border border-[color:var(--lens-sand)]/50 bg-white p-3"
              />
              <KeyValuePair
                keyText="Last updated"
                valueText={
                  store?.updatedAt
                    ? formatDate(store.updatedAt, "DD/MM/YYYY HH:mm")
                    : "—"
                }
                className="h-full border border-[color:var(--lens-sand)]/50 bg-white p-3"
              />
            </div>
          </div>

          <div>
            <Heading type="h3" className="!text-[15px]">
              Delivery
            </Heading>
            <p className="mt-1 text-[12px] text-[color:var(--lens-ink)]/50">
              Used during release validation and distribution routing.
            </p>

            <div className="mt-4 flex flex-col gap-4 rounded-md border border-[color:var(--lens-sand)]/50 bg-white p-4">
              <Input
                label="DDEX Party ID"
                value={formState.ddexPartyId || ""}
                readOnly={!canUpdate}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    ddexPartyId: event.target.value,
                  }))
                }
                placeholder="e.g. DSP_APPLE_MUSIC"
              />
              <Combobox
                label="Delivery protocol"
                options={deliveryProtocolOptions}
                value={formState.deliveryProtocol || ""}
                onChange={(value) =>
                  setFormState((current) => ({
                    ...current,
                    deliveryProtocol: (value ||
                      undefined) as StoreDeliveryProtocol | undefined,
                  }))
                }
                placeholder="Select delivery protocol"
                readOnly={!canUpdate}
              />
              <Input
                label="Delivery endpoint"
                value={formState.deliveryEndpoint || ""}
                readOnly={!canUpdate}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    deliveryEndpoint: event.target.value,
                  }))
                }
                placeholder="https:// or sftp:// destination"
              />

              {canUpdate && (
                <footer className="flex items-center justify-end gap-3 pt-1">
                  <Button
                    type="button"
                    onClick={() => {
                      navigate("/stores");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    primary
                    isLoading={isSaving}
                    onClick={() => void handleSave()}
                  >
                    Save delivery settings
                  </Button>
                </footer>
              )}
            </div>
          </div>
        </section>
      </main>
    </UserLayout>
  );
};

export default StoreDetailsPage;
