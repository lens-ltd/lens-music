import { useCreateReleaseMutation } from "@/state/api/apiMutationSlice";

export const useCreateRelease = () => {
    const [createRelease, { isLoading, reset, data, isSuccess }] = useCreateReleaseMutation();

    return { createRelease, isLoading, reset, data, isSuccess };
};