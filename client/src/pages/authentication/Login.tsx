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
import { PublicNavbar } from '../landing/LandingPage';

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
    <main className="min-h-screen max-h-screen overflow-clip flex flex-col items-center justify-center gap-5 w-full bg-background relative">
      {/* Accent geometric shape */}
      <aside aria-hidden="true" className="absolute left-0 bottom-0 w-full h-1/2 pointer-events-none select-none">
        <span className="block absolute left-0 bottom-0 w-2/3 h-24 bg-primary/20 rounded-tr-3xl" style={{transform: 'skewY(-4deg)'}}></span>
        <span className="block absolute left-0 bottom-10 w-1/2 h-8 bg-primary/40 rounded-tr-2xl" style={{transform: 'skewY(-2deg)'}}></span>
      </aside>
      <PublicNavbar />
      <form
        className="flex flex-col gap-7 w-full max-w-lg p-10 rounded-2xl shadow-2xl bg-white border border-gray-100 z-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <header className="flex flex-col gap-2 w-full items-center justify-center my-4">
          <h2 className="font-extrabold uppercase text-2xl tracking-widest text-primary">Lens Music</h2>
          <h1 className="font-semibold uppercase text-lg text-center text-gray-700">Login</h1>
        </header>
        <section className="flex flex-col gap-6">
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              validate: (value) => validateInputs(value, 'email') || 'Invalid email',
            }}
            render={({ field }) => (
              <label className="flex flex-col gap-1">
                <Input label="Email" required placeholder="Enter email address" {...field} />
                {errors?.email && (
                  <p className="text-red-500 text-sm">{String(errors?.email?.message)}</p>
                )}
              </label>
            )}
          />
          <Controller
            name="password"
            rules={{ required: 'Password is required' }}
            control={control}
            render={({ field }) => (
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
            )}
          />
        </section>
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
            className="text-[13px]! underline text-purple-700 hover:text-purple-900"
          >Forgot password?</Button>
        </menu>
        <footer className="flex flex-col items-center gap-3 w-full mt-2">
          <Button
            primary
            submit
            className="w-full shadow-md hover:shadow-lg transition-all duration-200"
          >{loginIsLoading ? <Loader /> : 'Login'}</Button>
          <p className="text-center flex items-center gap-2 text-[14px]">
            Don't have an account?{' '}
            <Button
              styled={false}
              route="/auth/signup"
              className="underline text-purple-700 hover:text-purple-900"
            >Signup here</Button>
          </p>
        </footer>
      </form>
    </main>
  );
};

export default Login;
