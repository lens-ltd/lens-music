import { Controller, FieldValues, useForm } from 'react-hook-form';
import { validateInputs } from '../../utils/validations.helper';
import Input from '../../components/inputs/Input';
import Button from '../../components/inputs/Button';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useState } from 'react';
import { useLoginMutation } from '../../state/api/apiMutationSlice';
import { toast } from 'react-toastify';
import Loader from '../../components/inputs/Loader';
import { AppDispatch } from '../../state/store';
import { useDispatch } from 'react-redux';
import { setToken } from '../../state/features/authSlice';
import { setUser } from '../../state/features/userSlice';
import { ErrorResponse, Link, useNavigate } from 'react-router-dom';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';

const Login = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const [
    login,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isError: loginIsError,
      isSuccess: loginIsSuccess,
    },
  ] = useLoginMutation();

  const dispatch: AppDispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (data: FieldValues) => {
    login({ email: data.email, password: data.password });
  };

  useEffect(() => {
    if (loginIsError) {
      const errorResponse =
        (loginError as ErrorResponse)?.data?.message ||
        'An error occurred while logging in. Please try again later.';
      toast.error(errorResponse);
    } else if (loginIsSuccess) {
      toast.success('Login successful. Redirecting...');
      dispatch(setToken(loginData?.data?.token));
      dispatch(setUser(loginData?.data?.user));
      navigate('/dashboard');
    }
  }, [loginData, loginError, loginIsLoading, loginIsError, loginIsSuccess, dispatch, navigate]);

  return (
    <main
      className="min-h-screen bg-[color:var(--lens-sand)]/35 flex flex-col"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      <PublicNavbar scrolled variant="auth" />

      <section className="flex-1 min-h-[calc(100vh)] flex items-center justify-center px-6 py-12 pt-[calc(64px+2.5rem)]">
        <article className="max-w-5xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
          <section className="border border-[color:var(--lens-sand)] bg-white p-8 md:p-10 rounded-2xl">
            <p
              className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--lens-blue)]"
              style={{ fontWeight: 400 }}
            >
              Artist access
            </p>
            <h1
              className="mt-4 text-[clamp(30px,4vw,44px)] leading-[1.06] tracking-[-0.02em] text-[color:var(--lens-ink)]"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              Sign in and continue where your release left off.
            </h1>
            <p className="mt-4 text-[13px] leading-6 text-[color:var(--lens-ink)]/65 font-normal">
              Track submissions, review revenue trends, and manage payouts from one dashboard.
              Lens distributes to 150+ stores with a 15% revenue share on earnings only.
            </p>

            <dl className="mt-8 grid sm:grid-cols-3 gap-4">
              {[
                ['Stores', '150+'],
                ['Revenue share', '15%'],
                ['Upfront cost', '$0'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-[color:var(--lens-sand)] p-4 bg-[color:var(--lens-sand)]/20">
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--lens-ink)]/55 font-normal">{label}</dt>
                  <dd
                    className="mt-2 text-[24px] leading-none text-[color:var(--lens-ink)]"
                    style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="w-full">
            <p
              className="text-[11px] uppercase tracking-[0.18em] mb-3 text-[color:var(--lens-blue)]"
              style={{ fontWeight: 400 }}
            >
              Welcome back
            </p>
            <h2
              className="text-[clamp(26px,4vw,36px)] leading-tight tracking-[-0.02em] text-[color:var(--lens-ink)]"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              Sign in to Lens Music
            </h2>
            <p
              className="text-[13px] mt-3 leading-relaxed text-[color:var(--lens-ink)]/60 font-normal"
            >
              Use your email and password to access your catalog, analytics, and payout activity.
            </p>

            <form
              className="mt-6 bg-white rounded-2xl border border-[color:var(--lens-sand)] p-6 md:p-8 flex flex-col gap-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              <fieldset className="border-0 p-0 m-0 flex flex-col gap-5">
                <legend className="sr-only">Sign in details</legend>
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
                        suffixIconHandler={(e) => {
                          e.preventDefault();
                          setShowPassword(!showPassword);
                        }}
                        {...field}
                      />
                    </div>
                  )}
                />
              </fieldset>

              <div className="flex items-center justify-between gap-3">
                <Input label="Keep me signed in" type="checkbox" onChange={(e) => e} />
                <Button styled={false} className="text-[12px]! text-[color:var(--lens-blue)]! font-normal!">
                  Forgot password?
                </Button>
              </div>

              <Button
                primary
                submit
                className="w-full py-3 text-[13px] tracking-[0.03em] shadow-none mt-1 font-normal"
              >
                {loginIsLoading ? <Loader /> : 'Sign in'}
              </Button>

              <p className="text-center text-[12px] text-[color:var(--lens-ink)]/55 font-normal">
                Don&apos;t have an account?{' '}
                <Link to="/auth/signup" className="text-[color:var(--lens-blue)] hover:underline font-normal">
                  Create one
                </Link>
              </p>
            </form>

            <p className="text-center text-[11px] mt-5 text-[color:var(--lens-ink)]/40 font-normal">
              Free distribution. Lens takes 15% only from earnings generated through the platform.
            </p>
          </section>
        </article>
      </section>
      <PublicFooter />
    </main>
  );
};

export default Login;
