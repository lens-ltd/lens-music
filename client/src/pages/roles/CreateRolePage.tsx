import Button from "@/components/inputs/Button";
import Input from "@/components/inputs/Input";
import TextArea from "@/components/inputs/TextArea";
import { BackButton, PageFooter } from "@/components/layout/PageFooter";
import { Heading } from "@/components/text/Headings";
import UserLayout from "@/containers/UserLayout";
import { useCreateRole } from "@/hooks/roles/roleMutations.hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateRolePage = () => {
  const navigate = useNavigate();
  const { createRole, isCreating } = useCreateRole();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    const success = await createRole({
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
    });

    if (success) {
      navigate("/roles");
    }
  };

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-4">
        <header className="w-full flex flex-col gap-1">
          <Heading>Create Role</Heading>
          <p className="text-[13px] text-(--slate) font-normal">
            Define a new role with specific permissions for dashboard users.
          </p>
        </header>

        <section className="w-full">
          <div className="flex w-full flex-col gap-4 rounded-lg bg-(--surface) p-5 sm:p-6">
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
          back={<BackButton route="/roles">Back to roles</BackButton>}
          actions={
            <Button
              type="submit"
              primary
              isLoading={isCreating}
              disabled={isCreating || !formData.name.trim()}
              onClick={handleSubmit}
            >
              Create role
            </Button>
          }
        />
      </main>
    </UserLayout>
  );
};

export default CreateRolePage;
