import { Controller, FieldValues, useForm } from 'react-hook-form';
import { validateInputs } from '../../utils/validations.helper';
import Input from '../../components/inputs/Input';
import Button from '../../components/inputs/Button';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useState } from 'react';
import { useLoginMutation } from '../../state/api/apiMutationSlice';
import { toast } from 'sonner';
import Loader from '../../components/inputs/Loader';
import { AppDispatch } from '../../state/store';
import { useDispatch } from 'react-redux';
import { setToken } from '../../state/features/authSlice';
import { setUser } from '../../state/features/userSlice';
import { ErrorResponse, Link, Navigate, useNavigate } from 'react-router-dom';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import { useAppSelector } from '@/state/hooks';

const Login = () => {
  const { token } = useAppSelector((state) => state.auth);

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
      dispatch(setToken(data?.data?.token));
      dispatch(setUser(data?.data?.user));
      navigate('/dashboard');
    }
  }, [data, dispatch, error, isError, isSuccess, navigate]);

  if (token) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <main
      className="min-h-screen bg-[color:var(--lens-sand)]/35 flex flex-col"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      <PublicNavbar scrolled variant="auth" />

      <section className="flex-1 flex items-center justify-center px-6 py-12 pt-[calc(64px+2.5rem)]">
        <article className="w-full max-w-md rounded-2xl border border-[color:var(--lens-sand)] bg-white p-8 md:p-10 shadow-sm">
          <p
            className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--lens-blue)]"
            style={{ fontWeight: 400 }}
          >
            Welcome back
          </p>
          <h1
            className="mt-4 text-[clamp(28px,4vw,38px)] leading-tight tracking-[-0.02em] text-[color:var(--lens-ink)]"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
          >
            Sign in to Lens Music
          </h1>
          <p className="mt-3 text-[13px] leading-6 text-[color:var(--lens-ink)]/60 font-normal">
            Use your email and password to access your catalog, analytics, and payout activity.
          </p>

          <form className="mt-7 flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
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
                    <p className="text-red-500 text-[12px] font-normal">{String(errors?.email?.message)}</p>
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
                    <p className="text-red-500 text-[12px] font-normal">{String(errors?.password?.message)}</p>
                  )}
                </div>
              )}
            />

            <div className="flex justify-end">
              <Link
                to="/auth/forgot-password"
                className="text-[12px] text-[color:var(--lens-blue)] hover:underline font-normal"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              primary
              submit
              className="w-full py-3 text-[13px] tracking-[0.03em] shadow-none mt-1 font-normal"
            >
              {isLoading ? <Loader /> : 'Sign in'}
            </Button>
          </form>

          <p className="text-center text-[11px] mt-5 text-[color:var(--lens-ink)]/40 font-normal">
            Lens Music is invite-only. Reach out to your admin if you need access.
          </p>
        </article>
      </section>

      <PublicFooter />
    </main>
  );
};

export default Login;
