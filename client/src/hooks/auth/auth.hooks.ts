import { useSignupMutation } from "@/state/api/apiMutationSlice";

export const useSignup = () => {
    const [signup, { isLoading, isSuccess, isError, reset, data }] = useSignupMutation();

    return { signup, isLoading, isSuccess, isError, reset, data };
};