import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import Button from "@/components/inputs/Button";
import Combobox from "@/components/inputs/Combobox";
import Input from "@/components/inputs/Input";
import Loader from "@/components/inputs/Loader";
import Modal from "@/components/modals/Modal";
import { Heading } from "@/components/text/Headings";
import UserLayout from "@/containers/UserLayout";
import { ROLES } from "@/constants/role.constants";
import { useFetchStores, useUpdateStore } from "@/hooks/stores/store.hooks";
import { useAppSelector } from "@/state/hooks";
import {
  Store,
  StoreDeliveryProtocol,
  UpdateStorePayload,
} from "@/types/models/store.types";

const deliveryProtocolOptions = Object.values(StoreDeliveryProtocol).map(
  (value) => ({
    label: value,
    value,
  }),
);

const StoresPage = () => {
  const user = useAppSelector((state) => state.user.user);
  const { fetchStores, data, isFetching } = useFetchStores();
  const { updateStore, isLoading: isSaving } = useUpdateStore();

  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [formState, setFormState] = useState<UpdateStorePayload>({
    ddexPartyId: "",
    deliveryProtocol: undefined,
    deliveryEndpoint: "",
  });

  useEffect(() => {
    fetchStores({});
  }, [fetchStores]);

  const stores: Store[] = useMemo(() => data?.data ?? [], [data?.data]);

  if (user?.role !== ROLES.ADMIN) {
    return <Navigate to="/dashboard" replace />;
  }

  const openEditModal = (store: Store) => {
    setEditingStore(store);
    setFormState({
      ddexPartyId: store.ddexPartyId || "",
      deliveryProtocol: store.deliveryProtocol,
      deliveryEndpoint: store.deliveryEndpoint || "",
    });
  };

  const closeEditModal = () => {
    setEditingStore(null);
    setFormState({
      ddexPartyId: "",
      deliveryProtocol: undefined,
      deliveryEndpoint: "",
    });
  };

  const handleSave = async () => {
    if (!editingStore) return;

    try {
      await updateStore({
        id: editingStore.id,
        body: {
          ddexPartyId: formState.ddexPartyId?.trim() || undefined,
          deliveryProtocol: formState.deliveryProtocol || undefined,
          deliveryEndpoint: formState.deliveryEndpoint?.trim() || undefined,
        },
      }).unwrap();
      toast.success("Store updated successfully.");
      await fetchStores({});
      closeEditModal();
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Unable to update store.";
      toast.error(message);
    }
  };

  return (
    <UserLayout>
      <main className="flex w-full flex-col gap-6">
        <header className="flex flex-col gap-1">
          <Heading>Stores</Heading>
          <p className="text-[12px] text-[color:var(--lens-ink)]/60">
            Configure the DDEX delivery metadata used during release validation
            and distribution routing.
          </p>
        </header>

        <section className="rounded-xl border border-[color:var(--lens-sand)]/70 bg-white p-4 sm:p-5">
          {isFetching ? (
            <figure className="flex min-h-[30vh] items-center justify-center">
              <Loader className="text-primary" />
            </figure>
          ) : stores.length === 0 ? (
            <p className="text-[12px] text-[color:var(--lens-ink)]/55">
              No stores available.
            </p>
          ) : (
            <div className="grid gap-3">
              {stores.map((store) => (
                <article
                  key={store.id}
                  className="grid gap-3 rounded-xl border border-[color:var(--lens-sand)]/60 p-4 lg:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,1fr))_auto] lg:items-center"
                >
                  <div>
                    <p className="text-sm font-semibold text-[color:var(--lens-ink)]">
                      {store.name}
                    </p>
                    <p className="text-[11px] text-[color:var(--lens-ink)]/50">
                      `{store.slug}`
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-[color:var(--lens-ink)]/45">
                      DDEX Party ID
                    </p>
                    <p className="text-[12px] text-[color:var(--lens-ink)]">
                      {store.ddexPartyId || "Missing"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-[color:var(--lens-ink)]/45">
                      Protocol
                    </p>
                    <p className="text-[12px] text-[color:var(--lens-ink)]">
                      {store.deliveryProtocol || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-[color:var(--lens-ink)]/45">
                      Endpoint
                    </p>
                    <p className="truncate text-[12px] text-[color:var(--lens-ink)]">
                      {store.deliveryEndpoint || "Not set"}
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <Button type="button" primary onClick={() => openEditModal(store)}>
                      Edit
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Modal
        isOpen={Boolean(editingStore)}
        onClose={closeEditModal}
        heading={`Edit Store${editingStore ? ` · ${editingStore.name}` : ""}`}
        className="min-w-[min(720px,92vw)]"
      >
        <section className="flex flex-col gap-4 p-1">
          <Input
            label="DDEX Party ID"
            value={formState.ddexPartyId || ""}
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
                deliveryProtocol: (value || undefined) as StoreDeliveryProtocol | undefined,
              }))
            }
            placeholder="Select delivery protocol"
          />
          <Input
            label="Delivery endpoint"
            value={formState.deliveryEndpoint || ""}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                deliveryEndpoint: event.target.value,
              }))
            }
            placeholder="https:// or sftp:// destination"
          />

          <footer className="flex items-center justify-between gap-3 pt-2">
            <Button type="button" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button type="button" primary onClick={() => void handleSave()} isLoading={isSaving}>
              Save
            </Button>
          </footer>
        </section>
      </Modal>
    </UserLayout>
  );
};

export default StoresPage;
