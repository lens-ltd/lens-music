import Button from "@/components/inputs/Button";
import Input from "@/components/inputs/Input";
import TextArea from "@/components/inputs/TextArea";
import { BackButton, PageFooter } from "@/components/layout/PageFooter";
import { Heading } from "@/components/text/Headings";
import UserLayout from "@/containers/UserLayout";
import { useUpdateRole } from "@/hooks/roles/roleMutations.hooks";
import { useFetchRoleById } from "@/hooks/roles/roles.hooks";
import { useAppSelector } from "@/state/hooks";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "@/components/inputs/Loader";

const EditRolePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateRole, isUpdating } = useUpdateRole();
  const { fetchRoleById, isFetching: isLoadingRole } = useFetchRoleById();
  const { role } = useAppSelector((state) => state.role);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (id) {
      fetchRoleById({ id });
    }
  }, [id, fetchRoleById]);

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || "",
        description: role.description || "",
      });
    }
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !id) {
      return;
    }

    const success = await updateRole(id, {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
    });

    if (success) {
      navigate(`/roles/${id}`);
    }
  };

  if (isLoadingRole) {
    return (
      <UserLayout>
        <main className="w-full flex items-center justify-center min-h-[50vh]">
          <Loader className="text-primary" />
        </main>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-4">
        <header className="w-full flex flex-col gap-1">
          <Heading>Edit Role</Heading>
          <p className="text-[13px] text-(--slate) font-normal">
            Update role information and permissions.
          </p>
        </header>

        <section className="w-full">
          <div className="flex w-full flex-col gap-4 card-framed p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-wide text-(--slate)">
                  Role name *
                </label>
                <Input
                  placeholder="e.g. Content Manager"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-wide text-(--slate)">
                  Description
                </label>
                <TextArea
                  rows={4}
                  placeholder="Describe the purpose and responsibilities of this role"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

            </form>
          </div>
        </section>

        <PageFooter
          back={<BackButton route={`/roles/${id}`}>Back to details</BackButton>}
          actions={
            <Button
              type="submit"
              primary
              isLoading={isUpdating}
              disabled={isUpdating || !formData.name.trim()}
              onClick={handleSubmit}
            >
              Save changes
            </Button>
          }
        />
      </main>
    </UserLayout>
  );
};

export default EditRolePage;
