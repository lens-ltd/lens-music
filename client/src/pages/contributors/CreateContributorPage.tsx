import Button from "@/components/inputs/Button";
import Combobox from "@/components/inputs/Combobox";
import Input from "@/components/inputs/Input";
import { Heading } from "@/components/text/Headings";
import { COUNTRIES_LIST } from "@/constants/countries.constants";
import UserLayout from "@/containers/UserLayout";
import { useCreateContributorMutation } from "@/state/api/apiMutationSlice";
import { capitalizeString } from "@/utils/strings.helper";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
    buildContributorPayload,
    contributorGenderOptions,
    ContributorFormValues,
    getContributorFormDefaults,
    socialProfileFields,
    statusOptions,
    storeProfileFields,
} from "./contributorForm";

const CreateContributorPage = () => {

    // NAVIGATION
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // REACT HOOK FORM
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContributorFormValues>({
        defaultValues: getContributorFormDefaults(),
    });

    // CREATE CONTRIBUTOR
    const [
        createContributor,
        { isLoading, isSuccess, isError, error, data, reset: resetCreateContributor },
    ] = useCreateContributorMutation();

    // HANDLE FORM SUBMISSION
    useEffect(() => {
        if (isError) {
            const errorMessage =
                (error as { data?: { message?: string } })?.data?.message ||
                "An error occurred while creating the contributor.";
            toast.error(errorMessage);
        }

        if (isSuccess) {
            toast.success(data?.message || "Contributor created successfully.");
            reset();
            resetCreateContributor();
            if (searchParams.get("redirect")) {
                navigate(searchParams.get("redirect") as string);
            }
            else {
                navigate("/contributors");
            }
        }
    }, [data?.message, error, isError, isSuccess, navigate, reset, resetCreateContributor, searchParams]);

    // HANDLE FORM SUBMISSION
    const onSubmit = handleSubmit((formValues) => {
        createContributor(buildContributorPayload(formValues));
    });

    return (
        <UserLayout>
            <main className="w-full flex flex-col gap-6">
                <header className="flex w-full items-center justify-between gap-3">
                    <Heading>Create new contributor</Heading>
                </header>

                <form className="w-full flex flex-col gap-6" onSubmit={onSubmit}>
                    <section className="w-full flex flex-col gap-4" aria-labelledby="contributor-personal-heading">
                        <header className="flex flex-col gap-1">
                            <Heading type="h3" id="contributor-personal-heading">
                                Personal information
                            </Heading>
                            <p className="text-[12px] font-normal text-gray-500">
                                Capture the supported contributor details and optional profile references.
                            </p>
                        </header>

                        <fieldset className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Controller
                                name="displayName"
                                control={control}
                                rules={{ required: "Please enter the display name" }}
                                render={({ field }) => (
                                    <Input
                                        label="Display name/Artist name"
                                        placeholder="Enter the display name/artist name"
                                        {...field}
                                        errorMessage={errors?.displayName?.message}
                                        required
                                    />
                                )}
                            />
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        label="Full name"
                                        placeholder="Enter the contributor's government name"
                                        {...field}
                                        errorMessage={errors?.name?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="email"
                                control={control}
                                rules={{
                                    pattern: {
                                        value: /^\S+@\S+\.\S+$/,
                                        message: "Please enter a valid email address",
                                    },
                                }}
                                render={({ field }) => (
                                    <Input
                                        label="Email"
                                        placeholder="name@example.com"
                                        type="email"
                                        {...field}
                                        errorMessage={errors?.email?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="phoneNumber"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        label="Phone number"
                                        placeholder="Enter a phone number"
                                        {...field}
                                        errorMessage={errors?.phoneNumber?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="country"
                                control={control}
                                render={({ field }) => (
                                    <Combobox
                                        label="Country"
                                        placeholder="Select the country"
                                        {...field}
                                        options={COUNTRIES_LIST.map((country) => ({
                                            label: capitalizeString(country?.name),
                                            value: country?.code,
                                        }))}
                                        errorMessage={errors?.country?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="gender"
                                control={control}
                                render={({ field }) => (
                                    <Combobox
                                        label="Gender"
                                        placeholder="Select gender"
                                        {...field}
                                        options={contributorGenderOptions}
                                        errorMessage={errors?.gender?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="dateOfBirth"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        label="Date of birth"
                                        placeholder="Select date of birth"
                                        type="date"
                                        value={field.value}
                                        onChange={field.onChange}
                                        errorMessage={errors?.dateOfBirth?.message}
                                        toDate={new Date()}
                                    />
                                )}
                            />
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Combobox
                                        label="Status"
                                        placeholder="Select contributor status"
                                        {...field}
                                        options={statusOptions}
                                        errorMessage={errors?.status?.message}
                                    />
                                )}
                            />
                        </fieldset>
                    </section>

                    <section className="w-full flex flex-col gap-4" aria-labelledby="contributor-social-heading">
                        <header className="flex flex-col gap-1">
                            <Heading type="h3" id="contributor-social-heading">
                                Social media
                            </Heading>
                            <p className="text-[12px] font-normal text-gray-500">
                                Supported links are stored as contributor profile links.
                            </p>
                        </header>

                        <fieldset className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                            {socialProfileFields.map((field) => (
                                <Controller
                                    key={field.name}
                                    name={field.name}
                                    control={control}
                                    render={({ field: controllerField }) => (
                                        <Input
                                            label={field.label}
                                            placeholder={field.placeholder}
                                            {...controllerField}
                                        />
                                    )}
                                />
                            ))}
                        </fieldset>
                    </section>

                    <section className="w-full flex flex-col gap-4" aria-labelledby="contributor-stores-heading">
                        <header className="flex flex-col gap-1">
                            <Heading type="h3" id="contributor-stores-heading">
                                Store IDs
                            </Heading>
                            <p className="text-[12px] font-normal text-gray-500">
                                Enter supported store identifiers or profile URLs. Unsupported services from the reference screen are intentionally excluded.
                            </p>
                        </header>

                        <fieldset className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                            {storeProfileFields.map((field) => (
                                <Controller
                                    key={field.name}
                                    name={field.name}
                                    control={control}
                                    render={({ field: controllerField }) => (
                                        <Input
                                            label={field.label}
                                            placeholder={field.placeholder}
                                            {...controllerField}
                                        />
                                    )}
                                />
                            ))}
                        </fieldset>
                    </section>

                    <footer className="flex w-full items-center justify-between gap-3">
                        <Button
                            onClick={(event) => {
                                event.preventDefault();
                                navigate(-1);
                            }}
                        >
                            Back
                        </Button>
                        <Button icon={faSave} primary submit isLoading={isLoading}>
                            Save
                        </Button>
                    </footer>
                </form>
            </main>
        </UserLayout>
    );
};

export default CreateContributorPage;
