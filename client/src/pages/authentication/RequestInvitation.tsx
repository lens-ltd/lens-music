import { useEffect } from "react";
import AuthLayout from '@/components/layout/AuthLayout';
import { Controller, useForm } from "react-hook-form";
import { ErrorResponse, Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
import Input from "@/components/inputs/Input";
import Button from "@/components/inputs/Button";
import { useRequestInvitationMutation } from "@/state/api/apiMutationSlice";
import { useAppSelector } from "@/state/hooks";
import { validateInputs } from "@/utils/validations.helper";

type RequestInvitationForm = {
  name: string;
  email: string;
  phoneNumber: string;
};

const RequestInvitation = () => {
  const { token: authToken, user: authUser } = useAppSelector((state) => state.auth);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RequestInvitationForm>({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
    },
  });

  const [requestInvitation, requestState] = useRequestInvitationMutation();

  useEffect(() => {
    if (requestState.isSuccess) {
      toast.success(
        requestState.data?.message ||
          "If your request can be approved, you will receive an invitation email shortly.",
      );
      reset();
    }

    if (requestState.isError) {
      toast.error(
        (requestState.error as ErrorResponse)?.data?.message ||
          "Unable to submit your invitation request.",
      );
    }
  }, [
    requestState.data?.message,
    requestState.error,
    requestState.isError,
    requestState.isSuccess,
    reset,
  ]);

  if (authToken && authUser?.id) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = (formData: RequestInvitationForm) => {
    requestInvitation({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phoneNumber: formData.phoneNumber.trim() || undefined,
    });
  };

  return (
    <AuthLayout widthClassName="max-w-[440px]">
          <h1 className="type-page-title text-2xl">
            Request an invitation
          </h1>
          <p className="mt-2 text-[13px] leading-5 text-(--muted)">
            Share your details and an admin can review your request before
            sending you a Lens Music invitation email.
          </p>

          <form
            className="mt-6 flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              control={control}
              name="name"
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <Input
                  label="Full name"
                  required
                  placeholder="Your full name"
                  {...field}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              rules={{
                required: "Email is required",
                validate: (value) =>
                  validateInputs(value, "email") || "Invalid email",
              }}
              render={({ field }) => (
                <Input
                  label="Email"
                  required
                  placeholder="you@example.com"
                  {...field}
                  errorMessage={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="phoneNumber"
              render={({ field }) => (
                <Input
                  label="Phone number"
                  placeholder="Optional"
                  {...field}
                  errorMessage={errors.phoneNumber?.message}
                />
              )}
            />

            <Button
              primary
              submit
              isLoading={requestState.isLoading}
              className="w-full py-3 text-[13px] shadow-none mt-1"
            >
              Submit request
            </Button>
          </form>

          <p className="mt-5 text-center text-(--muted) font-normal">
            Already have an invitation?{" "}
            <Link
              to="/auth/login"
              className="link-sweep type-body-sm text-(--signal)"
            >
              Sign in
            </Link>
          </p>
    </AuthLayout>
  );
};

export default RequestInvitation;
