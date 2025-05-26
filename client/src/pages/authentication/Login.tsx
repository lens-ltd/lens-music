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
import { ErrorResponse, useNavigate } from 'react-router-dom';

const Login = () => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  // INITIALIZE LOGIN REQUEST
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

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  // NAVIGATION 
  const navigate = useNavigate();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    login({
      email: data.email,
      password: data.password,
    });
  };

  // HANDLE LOGIN RESPONSE
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
  }, [
    loginData,
    loginError,
    loginIsLoading,
    loginIsError,
    loginIsSuccess,
    dispatch,
    navigate,
  ]);

  return (
    <main className="h-[100vh] max-h-screen overflow-clip flex flex-col items-center justify-center gap-5 w-full bg-background">
      <form
        className="flex flex-col gap-5 w-full max-w-[30%] p-7 rounded-md shadow-lg bg-white"
        onSubmit={handleSubmit(onSubmit)}
      >
        <section className="flex flex-col gap-1 w-full items-center justify-center my-4">
          <h2 className="font-bold uppercase text-xl">Lens Music</h2>
          <h1 className="font-semibold uppercase text-lg text-center">Login</h1>
        </section>
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
              <label className="flex flex-col gap-1">
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
          name="password"
          rules={{ required: 'Password is required' }}
          control={control}
          render={({ field }) => {
            return (
              <label className="flex flex-col gap-1">
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
            );
          }}
        />
        <menu className="flex items-center gap-3 justify-between w-full my-1 max-[1050px]:flex-col max-[800px]:flex-row max-[450px]:flex-col">
          <Input
            label="Keep me logged in"
            type="checkbox"
            onChange={(e) => {
              return e;
            }}
          />
          <Button
            styled={false}
            className="!text-[13px] underline"
          >Forgot password?</Button>
        </menu>
        <menu className="flex flex-col items-center gap-3 w-full">
          <Button
            primary
            submit
            className="w-full"
          >{loginIsLoading ? <Loader /> : 'Login'}</Button>
          <p className="text-center flex items-center gap-2 text-[15px]">
            Don't have an account?{' '}
            <Button
              styled={false}
              route="/auth/signup"
              className='underline'
            >Signup here</Button>
          </p>
        </menu>
      </form>
    </main>
  );
};

export default Login;
