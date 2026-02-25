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
      className="min-h-screen bg-[color:var(--lens-sand)] flex flex-col"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {/* ── navbar ── */}
      <header
        className="bg-white/96 backdrop-blur-md border-b border-[color:var(--lens-sand)] shadow-[0_1px_0_rgba(16,14,9,0.06)]"
        style={{ height: '64px' }}
      >
        <nav
          className="max-w-6xl mx-auto h-full flex items-center justify-between px-6"
          aria-label="Main navigation"
        >
          <Link
            to="/"
            aria-label="Lens Music home"
            className="flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--lens-blue)] rounded"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="2" stroke="rgb(31,98,142)" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="5.5" stroke="rgb(31,98,142)" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="2" fill="rgb(31,98,142)" />
            </svg>
            <span
              className="text-[color:var(--lens-ink)] tracking-tight"
              style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: 700 }}
            >
              Lens Music
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0" role="list">
            {[
              { label: 'How it works', href: '/#how-it-works' },
              { label: 'Pricing', href: '/#pricing' },
              { label: 'FAQ', href: '/#faq' },
            ].map(({ label, href }) => (
              <li key={label}>
                <Link
                  to={href}
                  className="nav-link text-[color:var(--lens-ink)] opacity-60 hover:opacity-100 text-[12px] tracking-[0.06em] font-medium"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/auth/signup"
                className="nav-link text-[color:var(--lens-ink)] opacity-60 hover:opacity-100 text-[12px] tracking-[0.06em] font-medium"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Sign up
              </Link>
            </li>
          </ul>

          <details className="md:hidden relative" id="mobile-nav-login">
            <summary
              className="list-none cursor-pointer p-2 rounded focus-visible:outline-2 focus-visible:outline-[color:var(--lens-blue)]"
              aria-label="Open navigation menu"
            >
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true">
                <rect y="0"  width="22" height="1.8" rx="1" fill="rgb(16,14,9)" />
                <rect y="7"  width="22" height="1.8" rx="1" fill="rgb(16,14,9)" />
                <rect y="14" width="22" height="1.8" rx="1" fill="rgb(16,14,9)" />
              </svg>
            </summary>
            <nav
              className="absolute top-full right-0 mt-2 w-52 bg-white border border-[color:var(--lens-sand)] rounded-lg shadow-lg p-3"
              aria-label="Mobile navigation"
            >
              <ul className="flex flex-col gap-1 list-none m-0 p-0" role="list">
                {[
                  { label: 'How it works', href: '/#how-it-works' },
                  { label: 'Pricing', href: '/#pricing' },
                  { label: 'FAQ', href: '/#faq' },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      className="block px-3 py-2 rounded text-[12px] text-[color:var(--lens-ink)] hover:bg-[color:var(--lens-sand)] transition-colors"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
                <li className="pt-1 border-t border-[color:var(--lens-sand)]">
                  <Link
                    to="/auth/signup"
                    className="block px-3 py-2 rounded text-[12px] font-semibold text-[color:var(--lens-blue)] hover:bg-[color:var(--lens-sand)] transition-colors"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    Sign up
                  </Link>
                </li>
              </ul>
            </nav>
          </details>
        </nav>
      </header>

      {/* ── form area ── */}
      <section className="flex-1 flex items-center justify-center px-6 py-16">
        <article className="w-full max-w-md">
          {/* card header */}
          <header className="mb-8">
            <p
              className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-3 text-[color:var(--lens-blue)]"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Welcome back
            </p>
            <h1
              className="text-[clamp(28px,4vw,38px)] leading-tight tracking-[-0.02em] text-[color:var(--lens-ink)]"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              Sign in to Lens Music
            </h1>
            <p
              className="text-[13px] mt-3 leading-relaxed"
              style={{ color: 'rgba(16,14,9,0.55)', fontFamily: 'var(--font-sans)' }}
            >
              Distribute your music to 150+ stores worldwide — for free.
            </p>
          </header>

          {/* form card */}
          <form
            className="bg-white rounded-2xl border border-[color:var(--lens-sand)] p-8 flex flex-col gap-6 shadow-[0_2px_16px_rgba(16,14,9,0.06)]"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required',
                validate: (value) => validateInputs(value, 'email') || 'Invalid email',
              }}
              render={({ field }) => (
                <label className="flex flex-col gap-1.5">
                  <Input label="Email" required placeholder="Enter email address" {...field} />
                  {errors?.email && (
                    <p className="text-red-500 text-[12px]">{String(errors?.email?.message)}</p>
                  )}
                </label>
              )}
            />

            <Controller
              name="password"
              rules={{ required: 'Password is required' }}
              control={control}
              render={({ field }) => (
                <label className="flex flex-col gap-1.5">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter password"
                    label="Password"
                    suffixIcon={showPassword ? faEyeSlash : faEye}
                    suffixIconHandler={(e) => {
                      e.preventDefault();
                      setShowPassword(!showPassword);
                    }}
                    {...field}
                  />
                </label>
              )}
            />

            <menu className="flex items-center justify-between m-0 p-0">
              <Input
                label="Keep me logged in"
                type="checkbox"
                onChange={(e) => e}
              />
              <Button
                styled={false}
                className="text-[12px]! text-[color:var(--lens-blue)]! hover:underline! p-0!"
              >
                Forgot password?
              </Button>
            </menu>

            <Button
              primary
              submit
              className="w-full py-3 text-[13px] font-semibold tracking-[0.04em] shadow-none mt-1"
            >
              {loginIsLoading ? <Loader /> : 'Sign in'}
            </Button>

            <p
              className="text-center text-[12px]"
              style={{ color: 'rgba(16,14,9,0.5)' }}
            >
              Don't have an account?{' '}
              <Link
                to="/auth/signup"
                className="font-semibold text-[color:var(--lens-blue)] hover:underline"
              >
                Create one
              </Link>
            </p>
          </form>

          <p
            className="text-center text-[11px] mt-6"
            style={{ color: 'rgba(16,14,9,0.35)', fontFamily: 'var(--font-sans)' }}
          >
            Free distribution. 15% revenue share on earnings only.
          </p>
        </article>
      </section>
    </main>
  );
};

export default Login;
