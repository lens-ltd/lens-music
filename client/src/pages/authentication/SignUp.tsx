import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ErrorResponse, Link, Navigate, useNavigate } from 'react-router-dom';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { toast } from 'sonner';
import Input from '@/components/inputs/Input';
import Button from '@/components/inputs/Button';
import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';
import { useRegisterMutation } from '@/state/api/apiMutationSlice';
import { setSession } from '@/state/features/authSlice';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { validateInputs } from '@/utils/validations.helper';

const SignUp = () => {
  const { token: authToken, user: authUser } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  const [register, registerState] = useRegisterMutation();

  if (authToken && authUser?.id) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (formData: {
    name: string;
    email: string;
    phoneNumber?: string;
    password: string;
  }) => {
    try {
      const response = await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: formData.phoneNumber?.trim() || undefined,
        password: formData.password,
      }).unwrap();
      dispatch(setSession(response.data));
      toast.success('Account created successfully.');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      toast.error(
        (error as ErrorResponse)?.data?.message ||
          'Unable to create your account.',
      );
    }
  };

  return (
    <main className="min-h-screen bg-[color:var(--lens-sand)]/35 flex flex-col" style={{ fontFamily: 'var(--font-sans)' }}>
      <PublicNavbar scrolled variant="auth" />

      <section className="flex-1 flex items-center justify-center px-6 py-12 pt-[calc(64px+2.5rem)]">
        <article className="w-full max-w-lg rounded-2xl border border-[color:var(--lens-sand)] bg-white p-8 md:p-10 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--lens-blue)] font-normal">
            Get started
          </p>
          <h1
            className="mt-4 text-[clamp(28px,4vw,38px)] leading-tight tracking-[-0.02em] text-[color:var(--lens-ink)]"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
          >
            Create your Lens Music account
          </h1>
          <p className="mt-3 text-[13px] leading-6 text-[color:var(--lens-ink)]/60 font-normal">
            Set up your account to distribute releases, manage contributors, and track your catalog.
          </p>

          <form className="mt-7 flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
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
              name="email"
              rules={{
                required: 'Email is required',
                validate: (value) => validateInputs(value, 'email') || 'Enter a valid email address',
              }}
              render={({ field }) => (
                <Input label="Email" required placeholder="you@example.com" type="email" {...field} errorMessage={errors.email?.message} />
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

            <Button primary submit disabled={registerState.isLoading} isLoading={registerState.isLoading} className="w-full py-3 text-[13px] font-normal">
              Create account
            </Button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-[11px] text-[color:var(--lens-ink)]/40 font-normal">
              Already have an account?
            </p>
            <Link
              to="/auth/login"
              className="mt-2 inline-flex text-[12px] text-[color:var(--lens-blue)] hover:underline font-normal"
            >
              Sign in
            </Link>
          </div>
        </article>
      </section>

      <PublicFooter />
    </main>
  );
};

export default SignUp;
