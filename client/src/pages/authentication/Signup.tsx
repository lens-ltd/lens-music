import { Controller, FieldValues, useForm } from 'react-hook-form';
import Loader from '../../components/inputs/Loader';
import Button from '../../components/inputs/Button';
import Input from '../../components/inputs/Input';
import { validateInputs } from '../../utils/validations.helper';
import { useEffect, useState } from 'react';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { useSignupMutation } from '../../state/api/apiMutationSlice';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../state/store';
import { setUser } from '../../state/features/userSlice';
import { setToken } from '../../state/features/authSlice';
import { ErrorResponse, Link } from 'react-router-dom';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';

const Signup = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    trigger,
  } = useForm();

  const [
    signup,
    {
      data: signupData,
      error: signupError,
      isLoading: signupIsLoading,
      isError: signupIsError,
      isSuccess: signupIsSuccess,
    },
  ] = useSignupMutation();

  const dispatch: AppDispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: FieldValues) => {
    signup({
      name: `${data.first_name} ${data?.last_name || ''}`,
      email: data.email,
      phone: data?.phone,
      password: data.password,
    });
  };

  useEffect(() => {
    if (signupIsError) {
      const errorResponse =
        (signupError as ErrorResponse)?.data?.message ||
        'An error occurred while signing up. Please try again later.';
      toast.error(errorResponse);
    } else if (signupIsSuccess) {
      toast.success('Account created successfully. Login to continue...');
      dispatch(setUser(signupData?.data?.user));
      dispatch(setToken(signupData?.data?.token));
    }
  }, [signupData, signupError, signupIsLoading, signupIsError, signupIsSuccess, dispatch]);

  return (
    <main
      className="min-h-screen bg-[color:var(--lens-sand)] flex flex-col"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      <PublicNavbar />

      {/* ── form area ── */}
      <section className="flex-1 flex items-center justify-center px-6 py-16 pt-[calc(64px+4rem)]">
        <article className="w-full max-w-xl">
          {/* card header */}
          <header className="mb-8">
            <p
              className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-3 text-[color:var(--lens-blue)]"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Get started — it's free
            </p>
            <h1
              className="text-[clamp(28px,4vw,38px)] leading-tight tracking-[-0.02em] text-[color:var(--lens-ink)]"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              Create your Lens account
            </h1>
            <p
              className="text-[13px] mt-3 leading-relaxed"
              style={{ color: 'rgba(16,14,9,0.55)', fontFamily: 'var(--font-sans)' }}
            >
              No upfront cost. Distribute to 150+ stores and only pay when you earn.
            </p>
          </header>

          {/* form card */}
          <form
            className="bg-white rounded-2xl border border-[color:var(--lens-sand)] p-8 flex flex-col gap-6 shadow-[0_2px_16px_rgba(16,14,9,0.06)]"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Name row */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Controller
                control={control}
                name="first_name"
                rules={{ required: 'First name is required' }}
                render={({ field }) => (
                  <label className="flex flex-col gap-1.5">
                    <Input label="First name" required placeholder="Enter first name" {...field} />
                    {errors?.first_name && (
                      <p className="text-red-500 text-[12px]">{String(errors?.first_name?.message)}</p>
                    )}
                  </label>
                )}
              />
              <Controller
                control={control}
                name="last_name"
                render={({ field }) => (
                  <label className="flex flex-col gap-1.5">
                    <Input label="Last name" placeholder="Enter last name" {...field} />
                  </label>
                )}
              />
            </section>

            {/* Email + Phone row */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                control={control}
                name="phone"
                rules={{ required: 'Phone number is required' }}
                render={({ field }) => (
                  <label className="flex flex-col gap-1.5">
                    <Input label="Phone number" required placeholder="Enter phone number" {...field} />
                    {errors?.phone && (
                      <p className="text-red-500 text-[12px]">{String(errors?.phone?.message)}</p>
                    )}
                  </label>
                )}
              />
            </section>

            {/* Password row */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                      onChange={(e) => {
                        field.onChange(e);
                        if (e.target.value === watch('confirm_password')) {
                          trigger('confirm_password');
                        }
                      }}
                    />
                    {errors?.password && (
                      <p className="text-red-500 text-[12px]">{String(errors?.password?.message)}</p>
                    )}
                  </label>
                )}
              />
              <Controller
                name="confirm_password"
                rules={{
                  required: 'Re-enter password to confirm it',
                  validate: (value) => value === watch('password') || 'Passwords do not match',
                }}
                control={control}
                render={({ field }) => (
                  <label className="flex flex-col gap-1.5">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter password"
                      label="Confirm password"
                      suffixIcon={showPassword ? faEyeSlash : faEye}
                      suffixIconHandler={(e) => {
                        e.preventDefault();
                        setShowPassword(!showPassword);
                      }}
                      {...field}
                    />
                    {errors?.confirm_password && (
                      <p className="text-red-500 text-[12px]">{String(errors?.confirm_password?.message)}</p>
                    )}
                  </label>
                )}
              />
            </section>

            <Button
              primary
              submit
              className="w-full py-3 text-[13px] font-semibold tracking-[0.04em] shadow-none mt-1"
            >
              {signupIsLoading ? <Loader /> : 'Create account'}
            </Button>

            <p
              className="text-center text-[12px]"
              style={{ color: 'rgba(16,14,9,0.5)' }}
            >
              Already have an account?{' '}
              <Link
                to="/auth/login"
                className="font-semibold text-[color:var(--lens-blue)] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>

          <p
            className="text-center text-[11px] mt-6"
            style={{ color: 'rgba(16,14,9,0.35)', fontFamily: 'var(--font-sans)' }}
          >
            Free distribution. 15% revenue share on earnings only. No credit card required.
          </p>
        </article>
      </section>
      <PublicFooter />
    </main>
  );
};

export default Signup;
