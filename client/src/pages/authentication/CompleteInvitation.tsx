import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ErrorResponse, Navigate, useNavigate, useParams } from 'react-router-dom';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { toast } from 'sonner';
import Input from '@/components/inputs/Input';
import Button from '@/components/inputs/Button';
import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';
import Loader from '@/components/inputs/Loader';
import {
  useCompleteInvitationMutation,
  useValidateInvitationTokenMutation,
} from '@/state/api/apiMutationSlice';
import { setToken } from '@/state/features/authSlice';
import { setUser } from '@/state/features/userSlice';
import { useAppDispatch, useAppSelector } from '@/state/hooks';

const CompleteInvitation = () => {
  const { token } = useParams();
  const authToken = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [invitationEmail, setInvitationEmail] = useState<string | null>(null);

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  const [validateInvitation, validationState] = useValidateInvitationTokenMutation();
  const [completeInvitation, completionState] = useCompleteInvitationMutation();

  useEffect(() => {
    if (token) {
      validateInvitation({ token });
    }
  }, [token, validateInvitation]);

  useEffect(() => {
    if (validationState.isSuccess) {
      setInvitationEmail(validationState.data?.data?.email ?? null);
    }

    if (validationState.isError) {
      toast.error(
        (validationState.error as ErrorResponse)?.data?.message ||
          'This invitation is invalid or has expired.',
      );
    }
  }, [validationState.data, validationState.error, validationState.isError, validationState.isSuccess]);

  useEffect(() => {
    if (completionState.isSuccess) {
      dispatch(setToken(completionState.data?.data?.accessToken));
      dispatch(setUser(completionState.data?.data?.user));
      toast.success('Account setup complete. Redirecting...');
      navigate('/dashboard');
    }

    if (completionState.isError) {
      toast.error(
        (completionState.error as ErrorResponse)?.data?.message ||
          'Unable to complete your registration.',
      );
    }
  }, [completionState.data, completionState.error, completionState.isError, completionState.isSuccess, dispatch, navigate]);

  const invitationUnavailable = validationState.isError || (!token && !validationState.isLoading);

  if (authToken) {
    return <Navigate to="/dashboard" />;
  }

  const onSubmit = (formData: {
    name: string;
    phoneNumber?: string;
    password: string;
  }) => {
    if (!token) return;

    completeInvitation({
      token,
      name: formData.name,
      phoneNumber: formData.phoneNumber || undefined,
      password: formData.password,
    });
  };

  return (
    <main className="min-h-screen bg-[color:var(--lens-sand)]/35 flex flex-col" style={{ fontFamily: 'var(--font-sans)' }}>
      <PublicNavbar scrolled variant="auth" />

      <section className="flex-1 flex items-center justify-center px-6 py-12 pt-[calc(64px+2.5rem)]">
        <article className="w-full max-w-lg rounded-2xl border border-[color:var(--lens-sand)] bg-white p-8 md:p-10 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--lens-blue)] font-normal">
            Invitation only
          </p>
          <h1
            className="mt-4 text-[clamp(28px,4vw,38px)] leading-tight tracking-[-0.02em] text-[color:var(--lens-ink)]"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
          >
            Complete your registration
          </h1>
          <p className="mt-3 text-[13px] leading-6 text-[color:var(--lens-ink)]/60 font-normal">
            Finish setting up your Lens Music account and create your password.
          </p>

          {validationState.isLoading ? (
            <div className="mt-8 flex justify-center"><Loader /></div>
          ) : invitationUnavailable ? (
            <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-[13px] text-red-700">
              This invitation is invalid or has expired. Please ask your admin to send a new invite.
            </div>
          ) : (
            <>
              <div className="mt-6 rounded-xl border border-[color:var(--lens-sand)] bg-[color:var(--lens-sand)]/25 p-4">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--lens-ink)]/55">Invited email</p>
                <p className="mt-2 text-[14px] text-[color:var(--lens-ink)] font-normal">{invitationEmail}</p>
              </div>

              <form className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  control={control}
                  name="name"
                  rules={{ required: 'Name is required' }}
                  render={({ field }) => (
                    <Input label="Full name" required placeholder="Your full name" {...field} errorMessage={errors.name?.message} />
                  )}
                />

                <Controller
                  control={control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <Input label="Phone number" placeholder="Optional" {...field} errorMessage={errors.phoneNumber?.message} />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  rules={{
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  }}
                  render={({ field }) => (
                    <Input
                      label="Password"
                      required
                      placeholder="Create a password"
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
                      label="Confirm password"
                      required
                      placeholder="Re-enter your password"
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

                <Button primary submit isLoading={completionState.isLoading} className="w-full py-3 text-[13px] font-normal">
                  Complete registration
                </Button>
              </form>
            </>
          )}
        </article>
      </section>

      <PublicFooter />
    </main>
  );
};

export default CompleteInvitation;
