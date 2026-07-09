import Button from "@/components/inputs/Button";
import Input from "@/components/inputs/Input";
import TextArea from "@/components/inputs/TextArea";
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
        <nav className="w-full flex items-center gap-3 justify-between">
          <div>
            <Heading>Create Role</Heading>
            <p className="text-[13px] text-[color:var(--lens-ink)]/60 font-normal mt-1">
              Define a new role with specific permissions for dashboard users.
            </p>
          </div>
          <Button route="/roles">Back to roles</Button>
        </nav>

        <section className="w-full">
          <div className="flex w-full flex-col gap-4 rounded-lg bg-[color:var(--lens-sand)]/10 p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-wide text-[color:var(--lens-ink)]/50">
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
                <label className="text-[11px] uppercase tracking-wide text-[color:var(--lens-ink)]/50">
                  Description
                </label>
                <TextArea
                  rows={4}
                  placeholder="Describe the purpose and responsibilities of this role"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => navigate("/roles")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  primary
                  isLoading={isCreating}
                  disabled={isCreating || !formData.name.trim()}
                >
                  Create role
                </Button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </UserLayout>
  );
};

export default CreateRolePage;
