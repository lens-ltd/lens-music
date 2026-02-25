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
      className="min-h-screen bg-[color:var(--lens-sand)]/35 flex flex-col"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      <PublicNavbar scrolled variant="auth" />

      <section className="flex-1 min-h-[calc(100vh)] flex items-center justify-center px-6 py-12 pt-[calc(64px+2.5rem)]">
        <article className="max-w-6xl mx-auto grid xl:grid-cols-[0.95fr_1.05fr] gap-8 items-start">
          <section className="border border-[color:var(--lens-sand)] bg-white p-8 md:p-10 rounded-2xl">
            <p
              className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--lens-blue)]"
              style={{ fontWeight: 400 }}
            >
              New artist account
            </p>
            <h1
              className="mt-4 text-[clamp(30px,4vw,44px)] leading-[1.06] tracking-[-0.02em] text-[color:var(--lens-ink)]"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              Start distributing and track revenue from day one.
            </h1>
            <p className="text-[13px] mt-4 leading-6 text-[color:var(--lens-ink)]/65 font-normal">
              Create your Lens account to deliver releases to 150+ stores, monitor earnings, and
              manage catalog activity in one workspace. No upfront cost.
            </p>

            <div className="mt-8 space-y-4">
              {[
                { label: 'No setup fee', value: '$0 upfront' },
                { label: 'Stores', value: '150+ destinations' },
                { label: 'Revenue model', value: '15% on earnings only' },
              ].map((item) => (
                <div key={item.label} className="flex items-start justify-between gap-4 border-b border-[color:var(--lens-sand)] pb-3">
                  <p className="text-[12px] text-[color:var(--lens-ink)]/60 font-normal">{item.label}</p>
                  <p className="text-[12px] text-[color:var(--lens-ink)] font-normal">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <p
              className="text-[11px] uppercase tracking-[0.18em] mb-3 text-[color:var(--lens-blue)]"
              style={{ fontWeight: 400 }}
            >
              Create your account
            </p>
            <h2
              className="text-[clamp(26px,4vw,36px)] leading-tight tracking-[-0.02em] text-[color:var(--lens-ink)]"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              Set up your Lens profile
            </h2>
            <p className="text-[13px] mt-3 leading-relaxed text-[color:var(--lens-ink)]/60 font-normal">
              Use your legal contact details for payouts and account security. You can add artist and label info after sign up.
            </p>

            <form
              className="mt-6 bg-white rounded-2xl border border-[color:var(--lens-sand)] p-6 md:p-8 flex flex-col gap-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              <fieldset className="border-0 p-0 m-0 grid grid-cols-1 md:grid-cols-2 gap-5">
                <legend className="sr-only">Name details</legend>
                <Controller
                  control={control}
                  name="first_name"
                  rules={{ required: 'First name is required' }}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1.5">
                      <Input label="First name" required placeholder="First name" {...field} />
                      {errors?.first_name && (
                        <p className="text-red-500 text-[12px] font-normal">{String(errors?.first_name?.message)}</p>
                      )}
                    </div>
                  )}
                />
                <Controller
                  control={control}
                  name="last_name"
                  render={({ field }) => (
                    <div className="flex flex-col gap-1.5">
                      <Input label="Last name" placeholder="Last name" {...field} />
                    </div>
                  )}
                />
              </fieldset>

              <fieldset className="border-0 p-0 m-0 grid grid-cols-1 md:grid-cols-2 gap-5">
                <legend className="sr-only">Contact details</legend>
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
                  control={control}
                  name="phone"
                  rules={{ required: 'Phone number is required' }}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1.5">
                      <Input label="Phone number" required placeholder="+250..." {...field} />
                      {errors?.phone && (
                        <p className="text-red-500 text-[12px] font-normal">{String(errors?.phone?.message)}</p>
                      )}
                    </div>
                  )}
                />
              </fieldset>

              <fieldset className="border-0 p-0 m-0 grid grid-cols-1 md:grid-cols-2 gap-5">
                <legend className="sr-only">Password details</legend>
                <Controller
                  name="password"
                  rules={{ required: 'Password is required' }}
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1.5">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Create a password"
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
                        <p className="text-red-500 text-[12px] font-normal">{String(errors?.password?.message)}</p>
                      )}
                    </div>
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
                    <div className="flex flex-col gap-1.5">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Confirm password"
                        label="Confirm password"
                        suffixIcon={showPassword ? faEyeSlash : faEye}
                        suffixIconHandler={(e) => {
                          e.preventDefault();
                          setShowPassword(!showPassword);
                        }}
                        {...field}
                      />
                      {errors?.confirm_password && (
                        <p className="text-red-500 text-[12px] font-normal">{String(errors?.confirm_password?.message)}</p>
                      )}
                    </div>
                  )}
                />
              </fieldset>

              <Button
                primary
                submit
                className="w-full py-3 text-[13px] tracking-[0.03em] shadow-none mt-1 font-normal"
              >
                {signupIsLoading ? <Loader /> : 'Create account'}
              </Button>

              <p className="text-center text-[12px] text-[color:var(--lens-ink)]/55 font-normal">
                Already have an account?{' '}
                <Link to="/auth/login" className="text-[color:var(--lens-blue)] hover:underline font-normal">
                  Sign in
                </Link>
              </p>
            </form>

            <p className="text-center text-[11px] mt-5 text-[color:var(--lens-ink)]/40 font-normal">
              Free distribution. 15% revenue share on earnings only. No credit card required.
            </p>
          </section>
        </article>
      </section>
      <PublicFooter />
    </main>
  );
};

export default Signup;
