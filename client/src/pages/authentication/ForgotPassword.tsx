import { Controller, useForm } from 'react-hook-form';
import AuthLayout from '@/components/layout/AuthLayout';
import { useEffect } from 'react';
import { ErrorResponse, Link } from 'react-router-dom';
import { toast } from 'sonner';
import Input from '@/components/inputs/Input';
import Button from '@/components/inputs/Button';
import { validateInputs } from '@/utils/validations.helper';
import { useRequestPasswordResetMutation } from '@/state/api/apiMutationSlice';

const ForgotPassword = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { email: '' } });

  const [requestReset, requestState] = useRequestPasswordResetMutation();

  useEffect(() => {
    if (requestState.isSuccess) {
      toast.success(requestState.data?.message || 'If an account exists, a reset link has been sent.');
      reset();
    }

    if (requestState.isError) {
      toast.error(
        (requestState.error as ErrorResponse)?.data?.message ||
          'Unable to request a password reset right now.',
      );
    }
  }, [requestState.data?.message, requestState.error, requestState.isError, requestState.isSuccess, reset]);

  return (
    <AuthLayout widthClassName="max-w-[440px]">
          <h1 className="type-page-title text-2xl" >
            Reset your password
          </h1>
          <p className="mt-2 text-[13px] leading-5 text-(--muted)">
            Enter your email address and we&apos;ll send you a secure password reset link if an account exists.
          </p>

          <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit((data) => requestReset(data))}>
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required',
                validate: (value) => validateInputs(value, 'email') || 'Invalid email',
              }}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <Input label="Email" required placeholder="you@example.com" {...field} />
                  {errors.email && <p className="text-(--danger) text-[13px] font-normal">{String(errors.email.message)}</p>}
                </div>
              )}
            />

            <Button primary submit isLoading={requestState.isLoading} className="w-full py-3 text-[13px] font-normal">
              Send reset link
            </Button>
          </form>

          <p className="mt-5 text-center text-[13px] text-(--muted) font-normal">
            Remembered your password?{' '}
            <Link to="/auth/login" className="link-sweep type-body-sm text-(--signal)">
              Return to sign in
            </Link>
          </p>
    </AuthLayout>
  );
};

export default ForgotPassword;
