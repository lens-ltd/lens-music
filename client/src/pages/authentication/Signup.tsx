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
import { ErrorResponse } from 'react-router-dom';
import { PublicNavbar } from '../landing/LandingPage';

const Signup = () => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    trigger,
  } = useForm();

  // INITIALIZE SIGNUP REQUEST
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

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    signup({
      name: `${data.first_name} ${data?.last_name || ''}`,
      email: data.email,
      phone: data?.phone,
      password: data.password,
    });
  };

  // HANDLE SIGNUP RESPONSE
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
  }, [
    signupData,
    signupError,
    signupIsLoading,
    signupIsError,
    signupIsSuccess,
    dispatch,
  ]);

  return (
    <main className="min-h-screen overflow-y-clip flex flex-col items-center justify-center gap-5 w-full bg-background relative overflow-hidden">
      {/* Accent geometric shape */}
      <aside
        aria-hidden="true"
        className="absolute left-0 bottom-0 w-full h-1/2 pointer-events-none select-none"
      >
        <span
          className="block absolute left-0 bottom-0 w-2/3 h-24 bg-primary/20 rounded-tr-3xl"
          style={{ transform: 'skewY(-4deg)' }}
        ></span>
        <span
          className="block absolute left-0 bottom-10 w-1/2 h-8 bg-primary/40 rounded-tr-2xl"
          style={{ transform: 'skewY(-2deg)' }}
        ></span>
      </aside>
      <PublicNavbar />
      <form
        className="flex flex-col gap-7 w-full max-w-xl p-10 rounded-2xl shadow-2xl bg-white border border-gray-100 z-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <header className="flex flex-col gap-2 w-full items-center justify-center my-4">
          <h2 className="font-extrabold uppercase text-2xl tracking-widest text-primary">
            Lens Music
          </h2>
          <h1 className="font-semibold uppercase text-lg text-center text-gray-700">
            Signup
          </h1>
        </header>
        <section className="w-full flex flex-col gap-6">
          <menu className="w-full flex flex-col md:flex-row items-start gap-6">
            {/* First and Last Name */}
            <Controller
              control={control}
              name="first_name"
              rules={{ required: 'First name is required' }}
              render={({ field }) => (
                <label className="flex flex-col gap-1 w-full">
                  <Input
                    label="First name"
                    required
                    placeholder="Enter first name"
                    {...field}
                  />
                  {errors?.first_name && (
                    <p className="text-red-500 text-sm">
                      {String(errors?.first_name?.message)}
                    </p>
                  )}
                </label>
              )}
            />
            <Controller
              control={control}
              name="last_name"
              render={({ field }) => (
                <label className="flex flex-col gap-1 w-full">
                  <Input
                    label="Last name"
                    required
                    placeholder="Enter last name"
                    {...field}
                  />
                </label>
              )}
            />
          </menu>
          <menu className="w-full flex flex-col md:flex-row items-start gap-6">
            {/* Email and Phone */}
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required',
                validate: (value) =>
                  validateInputs(value, 'email') || 'Invalid email',
              }}
              render={({ field }) => (
                <label className="flex flex-col gap-1 w-full">
                  <Input
                    label="Email"
                    required
                    placeholder="Enter email address"
                    {...field}
                  />
                  {errors?.email && (
                    <p className="text-red-500 text-sm">
                      {String(errors?.email?.message)}
                    </p>
                  )}
                </label>
              )}
            />
            <Controller
              control={control}
              name="phone"
              rules={{ required: 'Phone number is required' }}
              render={({ field }) => (
                <label className="flex flex-col gap-1 w-full">
                  <Input
                    label="Phone number"
                    required
                    placeholder="Enter phone number"
                    {...field}
                  />
                  {errors?.phone && (
                    <p className="text-red-500 text-sm">
                      {String(errors?.phone?.message)}
                    </p>
                  )}
                </label>
              )}
            />
          </menu>
          <menu className="w-full flex flex-col md:flex-row items-start gap-6">
            {/* Password and Confirm Password */}
            <Controller
              name="password"
              rules={{ required: 'Password is required' }}
              control={control}
              render={({ field }) => (
                <label className="flex flex-col gap-1 w-full">
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
                    <p className="text-red-500 text-sm">
                      {String(errors?.password?.message)}
                    </p>
                  )}
                </label>
              )}
            />
            <Controller
              name="confirm_password"
              rules={{
                required: 'Re-enter password to confirm it',
                validate: (value) =>
                  value === watch('password') || 'Passwords do not match',
              }}
              control={control}
              render={({ field }) => (
                <label className="flex flex-col gap-1 w-full">
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
                    <p className="text-red-500 text-sm">
                      {String(errors?.confirm_password?.message)}
                    </p>
                  )}
                </label>
              )}
            />
          </menu>
        </section>
        <footer className="flex flex-col items-center gap-3 w-full mt-2">
          <Button
            primary
            submit
            className="w-full shadow-md hover:shadow-lg transition-all duration-200"
          >
            {signupIsLoading ? <Loader /> : 'Signup'}
          </Button>
          <p className="text-center flex items-center gap-2 text-[14px]">
            Already have an account?{' '}
            <Button
              styled={false}
              className="underline text-purple-700 hover:text-purple-900"
              route="/auth/login"
            >
              Login here
            </Button>
          </p>
        </footer>
      </form>
    </main>
  );
};

export default Signup;
