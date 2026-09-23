import Button from "@/components/inputs/Button";
import Input from "@/components/inputs/Input";
import { Heading } from "@/components/text/Headings";
import UserLayout from "@/containers/UserLayout";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { useUpdateProfileMutation } from "@/state/api/apiMutationSlice";
import { setSession } from "@/state/features/authSlice";
import { useState } from "react";
import { toast } from "sonner";

import { LuCalendar, LuGlobe, LuMail, LuPhone, LuShield, LuUser } from 'react-icons/lu';

import StatusBadge from '@/components/feedbacks/StatusBadge';
import PhoneField from '@/components/inputs/PhoneField';
import { capitalizeString } from '@/utils/strings.helper';
import { PHONE_INVALID_MESSAGE, formatPhone, isPhoneValid } from '@/utils/phone.helper';
const UserProfilePage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [phoneError, setPhoneError] = useState<string | undefined>(undefined);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    country: user?.country || "",
    currentPassword: "",
  });

  const emailChanged = formData.email.trim().toLowerCase() !== user?.email?.toLowerCase();

  const handleSave = async () => {
    if (!isPhoneValid(formData.phoneNumber)) {
      setPhoneError(PHONE_INVALID_MESSAGE);
      return;
    }

    if (emailChanged && !formData.currentPassword) {
      toast.error("Enter your current password to change your email.");
      return;
    }

    try {
      const response = await updateProfile({
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        country: formData.country,
        currentPassword: emailChanged ? formData.currentPassword : undefined,
      }).unwrap();
      dispatch(setSession(response.data));
      setFormData((current) => ({ ...current, currentPassword: "" }));
      setIsEditing(false);
      toast.success(response.message || "Profile updated successfully.");
    } catch (error) {
      toast.error(
        (error as { data?: { message?: string } })?.data?.message ||
          "Unable to update your profile.",
      );
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      country: user?.country || "",
      currentPassword: "",
    });
    setPhoneError(undefined);
    setIsEditing(false);
  };

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-6">
        <nav className="w-full flex items-center gap-3 justify-between">
          <div>
            <Heading>Profile</Heading>
            <p className="text-[13px] text-(--muted) font-normal mt-1">
              Manage your account information and preferences.
            </p>
          </div>
        </nav>

        <section className="flex w-full flex-col gap-5">
          {/* Profile Header */}
          <div className="flex w-full flex-col items-start gap-4 card-framed p-5 sm:flex-row sm:items-center">
            <div className="relative h-20 w-20 overflow-hidden rounded-full bg-(--surface)">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Profile avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-(--signal) text-white text-2xl font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-[20px] text-(--ink)">
                {user?.name || 'User'}
              </h2>
              <p className="text-[13px] text-(--muted) mt-1">
                {user?.email || 'No email provided'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex h-6 items-center gap-1.5 rounded-(--radius-pill) bg-(--paper) px-2.5 text-xs text-(--ink)">
                  <LuShield className="size-3.5" aria-hidden="true" />
                  {capitalizeString(user?.roleName) || 'No role assigned'}
                </span>
                <StatusBadge status={user?.status || 'ACTIVE'} />
              </div>
            </div>
            {!isEditing && (
              <Button primary onClick={() => setIsEditing(true)}>
                Edit profile
              </Button>
            )}
          </div>

          {/* Profile Information */}
          <div className="flex w-full flex-col gap-4 card-framed p-5 sm:p-6">
            <h3 className="text-[14px] text-(--ink) mb-2">
              Account information
            </h3>

            {isEditing ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-(--muted)">
                    Full name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs text-(--muted)">
                    Email address
                  </label>
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    type="email"
                  />
                </div>

                {emailChanged && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-(--muted)">
                      Current password
                    </label>
                    <Input
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      placeholder="Confirm your current password"
                      type="password"
                    />
                    <p className="text-xs text-(--muted)">
                      Required because you are changing your login email.
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label htmlFor="profile-phone-number" className="text-xs text-(--muted)">
                    Phone number
                  </label>
                  {/* An empty value is sent as "", which the API stores as no number. */}
                  <PhoneField
                    name="profile-phone-number"
                    value={formData.phoneNumber}
                    onChange={(phoneNumber) => {
                      setPhoneError(undefined);
                      setFormData((current) => ({ ...current, phoneNumber }));
                    }}
                    errorMessage={phoneError}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs text-(--muted)">
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
                  <Button primary onClick={handleSave} disabled={isLoading} isLoading={isLoading}>
                    Save changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-md bg-(--surface) p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-(--paper)">
                    <LuUser className="text-[13px] text-(--muted)" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-(--muted)">
                      Full name
                    </p>
                    <p className="text-[13px] text-(--ink) mt-0.5">
                      {user?.name || '—'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-md bg-(--surface) p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-(--paper)">
                    <LuMail className="text-[13px] text-(--muted)" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-(--muted)">
                      Email address
                    </p>
                    <p className="text-[13px] text-(--ink) mt-0.5">
                      {user?.email || '—'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-md bg-(--surface) p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-(--paper)">
                    <LuPhone className="text-[13px] text-(--muted)" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-(--muted)">
                      Phone number
                    </p>
                    <p className="text-[13px] text-(--ink) mt-0.5">
                      {formatPhone(user?.phoneNumber) || '—'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-md bg-(--surface) p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-(--paper)">
                    <LuGlobe className="text-[13px] text-(--muted)" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-(--muted)">
                      Country
                    </p>
                    <p className="text-[13px] text-(--ink) mt-0.5">
                      {user?.country || '—'}
                    </p>
                  </div>
                </div>

                {user?.dateOfBirth && (
                  <div className="flex items-start gap-3 rounded-md bg-(--surface) p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-(--paper)">
                      <LuCalendar className="text-[13px] text-(--muted)" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-(--muted)">
                        Date of birth
                      </p>
                      <p className="text-[13px] text-(--ink) mt-0.5">
                        {new Date(user.dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {user?.gender && (
                  <div className="flex items-start gap-3 rounded-md bg-(--surface) p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-(--paper)">
                      <LuUser className="text-[13px] text-(--muted)" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-(--muted)">
                        Gender
                      </p>
                      <p className="text-[13px] text-(--ink) mt-0.5">
                        {capitalizeString(user.gender)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Permissions Section */}
          {user?.permissions && user.permissions.length > 0 && (
            <div className="flex w-full flex-col gap-4 card-framed p-5 sm:p-6">
              <h3 className="text-[14px] text-(--ink) mb-2">
                Your Permissions
              </h3>
              <div className="flex flex-wrap gap-2">
                {user?.permissions?.map((permission: string) => (
                  <span
                    key={permission}
                    className="inline-flex items-center px-2 py-1 rounded-md bg-(--signal-soft) text-xs text-(--signal)"
                  >
                    {capitalizeString(permission)}
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
