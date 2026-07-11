import { useEffect, useMemo } from "react";
import { Navigate } from "react-router-dom";
import Table from "@/components/table/Table";
import { Heading } from "@/components/text/Headings";
import UserLayout from "@/containers/UserLayout";
import { PERMISSIONS } from "@/constants/permission.constants";
import { useStoreColumns } from "@/hooks/stores/columns.stores";
import { useFetchStores } from "@/hooks/stores/store.hooks";
import { useAppSelector } from "@/state/hooks";
import { Store } from "@/types/models/store.types";

const StoresPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { fetchStores, data, isFetching } = useFetchStores();
  const { storeColumns } = useStoreColumns();

  const canAccessStores =
    user?.permissions?.includes(PERMISSIONS.UPDATE_STORE) ||
    user?.permissions?.includes(PERMISSIONS.READ_STORE);

  useEffect(() => {
    if (canAccessStores) {
      fetchStores({});
    }
  }, [fetchStores, canAccessStores]);

  const stores: Store[] = useMemo(() => data?.data ?? [], [data?.data]);

  if (!canAccessStores) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-4">
        <nav className="w-full flex items-center gap-3 justify-between">
          <div>
            <Heading>Stores</Heading>
            <p className="text-[13px] text-[color:var(--lens-ink)]/60 font-normal mt-1">
              Review distribution stores and open a store to configure DDEX
              delivery metadata.
            </p>
          </div>
        </nav>

        <Table
          data={stores}
          columns={storeColumns}
          isLoading={isFetching}
          showPagination={stores.length > 10}
          page={0}
          size={Math.max(stores.length, 10)}
          totalCount={stores.length}
          totalPages={1}
          noDataMessage="No stores found."
          containerClassName="border-0 rounded-none"
        />
      </main>
    </UserLayout>
  );
};

export default StoresPage;
