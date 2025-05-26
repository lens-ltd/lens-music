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
    <main className="h-screen flex flex-col items-center justify-center gap-5 w-full bg-background">
      <form
        className="flex flex-col gap-5 w-full max-w-[45%] p-6 rounded-md shadow-lg bg-white"
        onSubmit={handleSubmit(onSubmit)}
      >
        <section className="flex flex-col gap-1 w-full items-center justify-center my-4">
          <h2 className="font-bold uppercase text-xl">Lens Music</h2>
          <h1 className="font-semibold uppercase text-lg text-center">
            Signup
          </h1>
        </section>
        <menu className="w-full flex items-start gap-6">
          <Controller
            control={control}
            name="first_name"
            rules={{
              required: 'First name is required',
            }}
            render={({ field }) => {
              return (
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
              );
            }}
          />
          <Controller
            control={control}
            name="last_name"
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 w-full">
                  <Input
                    label="Last name"
                    required
                    placeholder="Enter last name"
                    {...field}
                  />
                </label>
              );
            }}
          />
        </menu>
        <menu className="w-full flex items-start gap-6">
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              validate: (value) => {
                return validateInputs(value, 'email') || 'Invalid email';
              },
            }}
            render={({ field }) => {
              return (
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
              );
            }}
          />
          <Controller
            control={control}
            name="phone"
            rules={{
              required: 'Phone number is required',
            }}
            render={({ field }) => {
              return (
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
              );
            }}
          />
        </menu>
        <menu className="w-full flex items-start gap-6">
          <Controller
            name="password"
            rules={{ required: 'Password is required' }}
            control={control}
            render={({ field }) => {
              return (
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
              );
            }}
          />
          <Controller
            name="confirm_password"
            rules={{
              required: 'Re-enter password to confirm it',
              validate: (value) => {
                return value === watch('password') || 'Passwords do not match';
              },
            }}
            control={control}
            render={({ field }) => {
              return (
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
              );
            }}
          />
        </menu>
        <menu className="flex flex-col items-center gap-3 w-full">
          <Button primary submit className="w-full">
            {signupIsLoading ? <Loader /> : 'Signup'}
          </Button>
          <p className="text-center flex items-center gap-2 text-[15px]">
            Already have an account?{' '}
            <Button styled={false} className="underline" route="/auth/login">
              Login here
            </Button>
          </p>
        </menu>
      </form>
    </main>
  );
};

export default Signup;
