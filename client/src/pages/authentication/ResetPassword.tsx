import { useEffect, useState } from "react";
import AuthLayout from '@/components/layout/AuthLayout';
import { Controller, useForm } from "react-hook-form";
import { ErrorResponse, Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Input from "@/components/inputs/Input";
import Button from "@/components/inputs/Button";
import Loader from "@/components/inputs/Loader";
import {
  useConfirmPasswordResetMutation,
  useValidatePasswordResetTokenMutation,
} from "@/state/api/apiMutationSlice";

import { LuEye, LuEyeOff } from 'react-icons/lu';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { password: "", confirmPassword: "" } });

  const [validateToken, validationState] =
    useValidatePasswordResetTokenMutation();
  const [confirmReset, confirmationState] = useConfirmPasswordResetMutation();

  useEffect(() => {
    if (token) {
      validateToken({ token });
    }
  }, [token, validateToken]);

  useEffect(() => {
    if (validationState.isError) {
      toast.error(
        (validationState.error as ErrorResponse)?.data?.message ||
          "This password reset link is invalid or has expired.",
      );
    }
  }, [validationState.error, validationState.isError]);

  useEffect(() => {
    if (confirmationState.isSuccess) {
      toast.success("Password updated successfully. Please sign in.");
      navigate("/auth/login");
    }

    if (confirmationState.isError) {
      toast.error(
        (confirmationState.error as ErrorResponse)?.data?.message ||
          "Unable to reset your password.",
      );
    }
  }, [
    confirmationState.error,
    confirmationState.isError,
    confirmationState.isSuccess,
    navigate,
  ]);

  const unavailable =
    validationState.isError || (!token && !validationState.isLoading);

  return (
    <AuthLayout widthClassName="max-w-[440px]">
          <h1 className="type-page-title text-2xl">
            Choose a new password
          </h1>
          <p className="mt-2 text-[13px] leading-5 text-(--muted)">
            Create a new password for your Lens Music account.
          </p>

          {validationState.isLoading ? (
            <div className="mt-8 flex justify-center">
              <Loader />
            </div>
          ) : unavailable ? (
            <div className="mt-8 rounded-xl bg-(--danger-soft) p-4 text-[13px] text-(--danger)">
              This password reset link is invalid or has expired.
            </div>
          ) : (
            <form
              className="mt-6 flex flex-col gap-4"
              onSubmit={handleSubmit(
                (data) =>
                  token && confirmReset({ token, password: data.password }),
              )}
            >
              <Controller
                control={control}
                name="password"
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                }}
                render={({ field }) => (
                  <Input
                    label="New password"
                    required
                    placeholder="Enter a new password"
                    type={showPassword ? "text" : "password"}
                    suffixIcon={showPassword ? LuEyeOff : LuEye}
                    suffixIconHandler={(event) => {
                      event.preventDefault();
                      setShowPassword(!showPassword);
                    }}
                    {...field}
                    errorMessage={errors.password?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                rules={{
                  required: "Please confirm your password",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                }}
                render={({ field }) => (
                  <Input
                    label="Confirm new password"
                    required
                    placeholder="Re-enter your new password"
                    type={showPassword ? "text" : "password"}
                    suffixIcon={showPassword ? LuEyeOff : LuEye}
                    suffixIconHandler={(event) => {
                      event.preventDefault();
                      setShowPassword(!showPassword);
                    }}
                    {...field}
                    errorMessage={errors.confirmPassword?.message}
                  />
                )}
              />

              <Button
                primary
                submit
                isLoading={confirmationState.isLoading}
                className="w-full py-3 text-[13px] font-normal"
              >
                Save new password
              </Button>
            </form>
          )}

          <p className="mt-5 text-center text-[13px] text-(--muted) font-normal">
            <Link
              to="/auth/login"
              className="link-sweep type-body-sm text-(--signal)"
            >
              Return to sign in
            </Link>
          </p>
    </AuthLayout>
  );
};

export default ResetPassword;
