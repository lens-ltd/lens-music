import { Controller, FieldValues, useForm } from 'react-hook-form';
import { validateInputs } from '../../utils/validations.helper';
import Input from '../../components/inputs/Input';
import Button from '../../components/inputs/Button';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useState } from 'react';
import { useLoginMutation } from '../../state/api/apiMutationSlice';
import { toast } from 'sonner';
import { AppDispatch } from '../../state/store';
import { useDispatch } from 'react-redux';
import { setSession } from '../../state/features/authSlice';
import { ErrorResponse, Link, Navigate, useNavigate } from 'react-router-dom';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import { useAppSelector } from '@/state/hooks';

const Login = () => {
  const { token, user } = useAppSelector((state) => state.auth);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const [login, { data, error, isLoading, isError, isSuccess }] = useLoginMutation();
  const dispatch: AppDispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (formData: FieldValues) => {
    login({ email: formData.email, password: formData.password });
  };

  useEffect(() => {
    if (isError) {
      const errorResponse =
        (error as ErrorResponse)?.data?.message ||
        'An error occurred while logging in. Please try again later.';
      toast.error(errorResponse);
    }

    if (isSuccess) {
      toast.success('Login successful. Redirecting...');
      dispatch(setSession(data?.data));
      navigate('/dashboard', { replace: true });
    }
  }, [data, dispatch, error, isError, isSuccess, navigate]);

  if (token && user?.id) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main
      className="min-h-screen bg-(--field) flex flex-col"
    >
      <PublicNavbar scrolled variant="auth" />

      <section className="flex-1 flex items-center justify-center px-6 py-12 pt-[calc(64px+2.5rem)]">
        <article className="w-full max-w-[400px] rounded-lg border border-(--line) bg-(--paper) p-6 shadow-[var(--shadow-modal)] sm:p-7">
          <p
            className="type-eyebrow"
          >
            Welcome back
          </p>
          <h1
            className="mt-3 text-[1.65rem] font-medium text-(--ink)">
            Sign in to Lens Music
          </h1>
          <p className="mt-2 text-[13px] leading-5 text-(--slate)">
            Use your email and password to access your catalog, analytics, and payout activity.
          </p>

          <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
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
                  {errors?.email && (
                    <p className="type-meta text-(--danger-text)">{String(errors?.email?.message)}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="password"
              rules={{ required: 'Password is required' }}
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    label="Password"
                    suffixIcon={showPassword ? faEyeSlash : faEye}
                    suffixIconHandler={(event) => {
                      event.preventDefault();
                      setShowPassword(!showPassword);
                    }}
                    {...field}
                  />
                  {errors?.password && (
                    <p className="type-meta text-(--danger-text)">{String(errors?.password?.message)}</p>
                  )}
                </div>
              )}
            />

            <div className="flex justify-end">
              <Link
                to="/auth/forgot-password"
                className="link-sweep type-body-sm text-(--signal)"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              primary
              submit
              className="w-full mt-1"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Sign in
            </Button>
          </form>

          <div className="mt-5 text-center">
            <p className="type-meta">
              Don&apos;t have an account?
            </p>
            <Link
              to="/auth/signup"
              className="mt-2 inline-flex type-body-sm text-(--signal) link-sweep"
            >
              Create account
            </Link>
          </div>
        </article>
      </section>

      <PublicFooter />
    </main>
  );
};

export default Login;
