import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { ErrorResponse, Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
import Input from "@/components/inputs/Input";
import Button from "@/components/inputs/Button";
import PublicNavbar from "@/components/layout/PublicNavbar";
import PublicFooter from "@/components/layout/PublicFooter";
import { useRequestInvitationMutation } from "@/state/api/apiMutationSlice";
import { useAppSelector } from "@/state/hooks";
import { validateInputs } from "@/utils/validations.helper";

type RequestInvitationForm = {
  name: string;
  email: string;
  phoneNumber: string;
};

const RequestInvitation = () => {
  const authToken = useAppSelector((state) => state.auth.token);
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

  if (authToken) {
    return <Navigate to="/dashboard" />;
  }

  const onSubmit = (formData: RequestInvitationForm) => {
    requestInvitation({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phoneNumber: formData.phoneNumber.trim() || undefined,
    });
  };

  return (
    <main
      className="min-h-screen bg-[color:var(--lens-sand)]/35 flex flex-col"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <PublicNavbar scrolled variant="auth" />

      <section className="flex-1 flex items-center justify-center px-6 py-12 pt-[calc(64px+2.5rem)]">
        <article className="w-full max-w-md rounded-2xl border border-[color:var(--lens-sand)] bg-white p-8 md:p-10 shadow-sm">
          <p
            className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--lens-blue)]"
            style={{ fontWeight: 400 }}
          >
            Invite only
          </p>
          <h1
            className="mt-4 text-[clamp(28px,4vw,38px)] leading-tight tracking-[-0.02em] text-[color:var(--lens-ink)]"
            style={{ fontFamily: "var(--font-serif)", fontWeight: 700 }}
          >
            Request an invitation
          </h1>
          <p className="mt-3 text-[13px] leading-6 text-[color:var(--lens-ink)]/60 font-normal">
            Share your details and an admin can review your request before
            sending you a Lens Music invitation email.
          </p>

          <form
            className="mt-7 flex flex-col gap-5"
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
              className="w-full py-3 text-[12px] tracking-[0.04em] shadow-none mt-1 font-normal"
            >
              Submit request
            </Button>
          </form>

          <p className="mt-5 text-center text-[color:var(--lens-ink)]/45 font-normal">
            Already have an invitation?{" "}
            <Link
              to="/auth/login"
              className="text-[12px] text-[color:var(--lens-blue)] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </article>
      </section>

      <PublicFooter />
    </main>
  );
};

export default RequestInvitation;
