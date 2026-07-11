import Button from "@/components/inputs/Button";
import Input from "@/components/inputs/Input";
import { Heading } from "@/components/text/Headings";
import UserLayout from "@/containers/UserLayout";
import { useAppSelector } from "@/state/hooks";
import { faUser, faEnvelope, faPhone, faGlobe, faCalendar, faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const UserProfilePage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    country: user?.country || "",
  });

  const handleSave = () => {
    // TODO: Implement profile update API call
    console.log("Saving profile:", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      country: user?.country || "",
    });
    setIsEditing(false);
  };

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-6">
        <nav className="w-full flex items-center gap-3 justify-between">
          <div>
            <Heading>Profile</Heading>
            <p className="text-[13px] text-[color:var(--lens-ink)]/60 font-normal mt-1">
              Manage your account information and preferences.
            </p>
          </div>
        </nav>

        <section className="flex w-full flex-col gap-5">
          {/* Profile Header */}
          <div className="flex w-full flex-col items-start gap-4 rounded-lg bg-[color:var(--lens-sand)]/10 p-5 sm:flex-row sm:items-center">
            <div className="relative h-20 w-20 overflow-hidden rounded-full bg-white">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Profile avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[color:var(--lens-blue)] text-white text-2xl font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-[20px] font-semibold text-[color:var(--lens-ink)]">
                {user?.name || 'User'}
              </h2>
              <p className="text-[13px] text-[color:var(--lens-ink)]/60 mt-1">
                {user?.email || 'No email provided'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-[color:var(--lens-sand)]/30 text-[11px] text-[color:var(--lens-ink)]">
                  <FontAwesomeIcon icon={faShieldAlt} className="mr-1.5 text-[10px]" />
                  {user?.roleName || 'No role assigned'}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-[color:var(--lens-blue)]/10 text-[11px] text-[color:var(--lens-blue)]">
                  {user?.status || 'Active'}
                </span>
              </div>
            </div>
            {!isEditing && (
              <Button primary onClick={() => setIsEditing(true)}>
                Edit profile
              </Button>
            )}
          </div>

          {/* Profile Information */}
          <div className="flex w-full flex-col gap-4 rounded-lg bg-[color:var(--lens-sand)]/10 p-5 sm:p-6">
            <h3 className="text-[14px] font-medium text-[color:var(--lens-ink)] mb-2">
              Account Information
            </h3>

            {isEditing ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] uppercase tracking-wide text-[color:var(--lens-ink)]/50">
                    Full name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] uppercase tracking-wide text-[color:var(--lens-ink)]/50">
                    Email address
                  </label>
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    type="email"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] uppercase tracking-wide text-[color:var(--lens-ink)]/50">
                    Phone number
                  </label>
                  <Input
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="+1 234 567 890"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] uppercase tracking-wide text-[color:var(--lens-ink)]/50">
                    Country
                  </label>
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Your country"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button primary onClick={handleSave}>
                    Save changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-md bg-white p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[color:var(--lens-sand)]/30">
                    <FontAwesomeIcon icon={faUser} className="text-[12px] text-[color:var(--lens-ink)]/60" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] uppercase tracking-wide text-[color:var(--lens-ink)]/45">
                      Full name
                    </p>
                    <p className="text-[13px] text-[color:var(--lens-ink)] mt-0.5">
                      {user?.name || '—'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-md bg-white p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[color:var(--lens-sand)]/30">
                    <FontAwesomeIcon icon={faEnvelope} className="text-[12px] text-[color:var(--lens-ink)]/60" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] uppercase tracking-wide text-[color:var(--lens-ink)]/45">
                      Email address
                    </p>
                    <p className="text-[13px] text-[color:var(--lens-ink)] mt-0.5">
                      {user?.email || '—'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-md bg-white p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[color:var(--lens-sand)]/30">
                    <FontAwesomeIcon icon={faPhone} className="text-[12px] text-[color:var(--lens-ink)]/60" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] uppercase tracking-wide text-[color:var(--lens-ink)]/45">
                      Phone number
                    </p>
                    <p className="text-[13px] text-[color:var(--lens-ink)] mt-0.5">
                      {user?.phoneNumber || '—'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-md bg-white p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[color:var(--lens-sand)]/30">
                    <FontAwesomeIcon icon={faGlobe} className="text-[12px] text-[color:var(--lens-ink)]/60" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] uppercase tracking-wide text-[color:var(--lens-ink)]/45">
                      Country
                    </p>
                    <p className="text-[13px] text-[color:var(--lens-ink)] mt-0.5">
                      {user?.country || '—'}
                    </p>
                  </div>
                </div>

                {user?.dateOfBirth && (
                  <div className="flex items-start gap-3 rounded-md bg-white p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[color:var(--lens-sand)]/30">
                      <FontAwesomeIcon icon={faCalendar} className="text-[12px] text-[color:var(--lens-ink)]/60" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] uppercase tracking-wide text-[color:var(--lens-ink)]/45">
                        Date of birth
                      </p>
                      <p className="text-[13px] text-[color:var(--lens-ink)] mt-0.5">
                        {new Date(user.dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {user?.gender && (
                  <div className="flex items-start gap-3 rounded-md bg-white p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[color:var(--lens-sand)]/30">
                      <FontAwesomeIcon icon={faUser} className="text-[12px] text-[color:var(--lens-ink)]/60" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] uppercase tracking-wide text-[color:var(--lens-ink)]/45">
                        Gender
                      </p>
                      <p className="text-[13px] text-[color:var(--lens-ink)] mt-0.5">
                        {user.gender}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Permissions Section */}
          {user?.permissions && user.permissions.length > 0 && (
            <div className="flex w-full flex-col gap-4 rounded-lg bg-[color:var(--lens-sand)]/10 p-5 sm:p-6">
              <h3 className="text-[14px] font-medium text-[color:var(--lens-ink)] mb-2">
                Your Permissions
              </h3>
              <div className="flex flex-wrap gap-2">
                {user?.permissions?.map((permission: string) => (
                  <span
                    key={permission}
                    className="inline-flex items-center px-2 py-1 rounded-md bg-[color:var(--lens-blue)]/10 text-[11px] text-[color:var(--lens-blue)]"
                  >
                    {permission.replace(/_/g, ' ').toLowerCase()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </UserLayout>
  );
};

export default UserProfilePage;
