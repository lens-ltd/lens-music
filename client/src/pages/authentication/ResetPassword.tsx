import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ErrorResponse, Link, useNavigate, useParams } from 'react-router-dom';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { toast } from 'sonner';
import Input from '@/components/inputs/Input';
import Button from '@/components/inputs/Button';
import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';
import Loader from '@/components/inputs/Loader';
import {
  useConfirmPasswordResetMutation,
  useValidatePasswordResetTokenMutation,
} from '@/state/api/apiMutationSlice';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { password: '', confirmPassword: '' } });

  const [validateToken, validationState] = useValidatePasswordResetTokenMutation();
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
          'This password reset link is invalid or has expired.',
      );
    }
  }, [validationState.error, validationState.isError]);

  useEffect(() => {
    if (confirmationState.isSuccess) {
      toast.success('Password updated successfully. Please sign in.');
      navigate('/auth/login');
    }

    if (confirmationState.isError) {
      toast.error(
        (confirmationState.error as ErrorResponse)?.data?.message ||
          'Unable to reset your password.',
      );
    }
  }, [confirmationState.error, confirmationState.isError, confirmationState.isSuccess, navigate]);

  const unavailable = validationState.isError || (!token && !validationState.isLoading);

  return (
    <main className="min-h-screen bg-[color:var(--lens-sand)]/35 flex flex-col" style={{ fontFamily: 'var(--font-sans)' }}>
      <PublicNavbar scrolled variant="auth" />

      <section className="flex-1 flex items-center justify-center px-6 py-12 pt-[calc(64px+2.5rem)]">
        <article className="w-full max-w-md rounded-2xl border border-[color:var(--lens-sand)] bg-white p-8 md:p-10 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--lens-blue)] font-normal">Account security</p>
          <h1 className="mt-4 text-[clamp(28px,4vw,38px)] leading-tight tracking-[-0.02em] text-[color:var(--lens-ink)]" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
            Choose a new password
          </h1>
          <p className="mt-3 text-[13px] leading-6 text-[color:var(--lens-ink)]/60 font-normal">
            Create a new password for your Lens Music account.
          </p>

          {validationState.isLoading ? (
            <div className="mt-8 flex justify-center"><Loader /></div>
          ) : unavailable ? (
            <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-[13px] text-red-700">
              This password reset link is invalid or has expired.
            </div>
          ) : (
            <form className="mt-7 flex flex-col gap-5" onSubmit={handleSubmit((data) => token && confirmReset({ token, password: data.password }))}>
              <Controller
                control={control}
                name="password"
                rules={{
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                }}
                render={({ field }) => (
                  <Input
                    label="New password"
                    required
                    placeholder="Enter a new password"
                    type={showPassword ? 'text' : 'password'}
                    suffixIcon={showPassword ? faEyeSlash : faEye}
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
                  required: 'Please confirm your password',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  validate: (value) => value === watch('password') || 'Passwords do not match',
                }}
                render={({ field }) => (
                  <Input
                    label="Confirm new password"
                    required
                    placeholder="Re-enter your new password"
                    type={showPassword ? 'text' : 'password'}
                    suffixIcon={showPassword ? faEyeSlash : faEye}
                    suffixIconHandler={(event) => {
                      event.preventDefault();
                      setShowPassword(!showPassword);
                    }}
                    {...field}
                    errorMessage={errors.confirmPassword?.message}
                  />
                )}
              />

              <Button primary submit isLoading={confirmationState.isLoading} className="w-full py-3 text-[13px] font-normal">
                Save new password
              </Button>
            </form>
          )}

          <p className="mt-5 text-center text-[12px] text-[color:var(--lens-ink)]/55 font-normal">
            <Link to="/auth/login" className="text-[color:var(--lens-blue)] hover:underline">
              Return to sign in
            </Link>
          </p>
        </article>
      </section>

      <PublicFooter />
    </main>
  );
};

export default ResetPassword;
