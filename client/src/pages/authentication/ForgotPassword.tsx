import { Controller, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { ErrorResponse, Link } from 'react-router-dom';
import { toast } from 'sonner';
import Input from '@/components/inputs/Input';
import Button from '@/components/inputs/Button';
import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';
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
    <main className="min-h-screen bg-[color:var(--lens-sand)]/35 flex flex-col" style={{ fontFamily: 'var(--font-sans)' }}>
      <PublicNavbar scrolled variant="auth" />

      <section className="flex-1 flex items-center justify-center px-6 py-12 pt-[calc(64px+2.5rem)]">
        <article className="w-full max-w-md rounded-2xl border border-[color:var(--lens-sand)] bg-white p-8 md:p-10 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--lens-blue)] font-normal">Account security</p>
          <h1 className="mt-4 text-[clamp(28px,4vw,38px)] leading-tight tracking-[-0.02em] text-[color:var(--lens-ink)]" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
            Reset your password
          </h1>
          <p className="mt-3 text-[13px] leading-6 text-[color:var(--lens-ink)]/60 font-normal">
            Enter your email address and we&apos;ll send you a secure password reset link if an account exists.
          </p>

          <form className="mt-7 flex flex-col gap-5" onSubmit={handleSubmit((data) => requestReset(data))}>
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
                  {errors.email && <p className="text-red-500 text-[12px] font-normal">{String(errors.email.message)}</p>}
                </div>
              )}
            />

            <Button primary submit isLoading={requestState.isLoading} className="w-full py-3 text-[13px] font-normal">
              Send reset link
            </Button>
          </form>

          <p className="mt-5 text-center text-[12px] text-[color:var(--lens-ink)]/55 font-normal">
            Remembered your password?{' '}
            <Link to="/auth/login" className="text-[color:var(--lens-blue)] text-[12px] hover:underline">
              Return to sign in
            </Link>
          </p>
        </article>
      </section>

      <PublicFooter />
    </main>
  );
};

export default ForgotPassword;
