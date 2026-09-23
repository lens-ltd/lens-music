import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import releaseReducer, { setRelease } from "@/state/features/releaseSlice";
import { Release } from "@/types/models/release.types";
import ReleaseWizardRegions from "./ReleaseWizardRegions";

const updateTerritories = vi.fn();
const fetchDetails = vi.fn();
const createDetail = vi.fn();
const updateDetail = vi.fn();
const deleteDetail = vi.fn();

// A stable response object, like RTK Query's cached result.
const savedDetails = {
  data: [
    {
      id: "detail-fr",
      releaseId: "release-1",
      territory: "FR",
      title: "Titre",
      displayArtistName: "",
      labelName: "",
    },
  ],
};

const unwrapped = (value: unknown) => ({
  unwrap: () => Promise.resolve(value),
});

vi.mock("@/hooks/releases/wizardStepNavigation.hooks", () => ({
  useWizardStepNavigation: () => ({
    goNext: async (save?: () => Promise<boolean | void>) =>
      save ? (await save()) !== false : true,
    goBack: vi.fn(),
    isNavigating: false,
  }),
}));

vi.mock("@/hooks/releases/release.hooks", () => ({
  useUpdateReleaseTerritories: () => ({
    updateReleaseTerritories: updateTerritories,
    isLoading: false,
    reset: vi.fn(),
  }),
}));

vi.mock("@/hooks/releases/release-territory-detail.hooks", () => ({
  useFetchReleaseTerritoryDetails: () => ({
    fetchReleaseTerritoryDetails: fetchDetails,
    data: savedDetails,
    isFetching: false,
    isError: false,
  }),
  useCreateReleaseTerritoryDetail: () => ({
    createReleaseTerritoryDetail: createDetail,
  }),
  useUpdateReleaseTerritoryDetail: () => ({
    updateReleaseTerritoryDetail: updateDetail,
  }),
  useDeleteReleaseTerritoryDetail: () => ({
    deleteReleaseTerritoryDetail: deleteDetail,
  }),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const release = {
  id: "release-1",
  title: "Release",
  territories: ["FR", "DE"],
  genres: [],
} as unknown as Release;

const renderRegions = () => {
  const store = configureStore({ reducer: { release: releaseReducer } });
  store.dispatch(setRelease(release));
  render(
    <Provider store={store}>
      <ReleaseWizardRegions
        currentStepName="REGIONS"
        nextStepName="STORES"
        previousStepName="MANAGE_CONTRIBUTIONS"
      />
    </Provider>,
  );
  return store;
};

const countryCheckbox = (code: string) =>
  document.getElementById(`country-${code}`) as HTMLInputElement;

beforeEach(() => {
  updateTerritories.mockReset().mockReturnValue(unwrapped({ message: "Saved" }));
  fetchDetails.mockReset();
  createDetail.mockReset().mockReturnValue(unwrapped({ data: { id: "new" } }));
  updateDetail.mockReset().mockReturnValue(unwrapped({}));
  deleteDetail.mockReset().mockReturnValue(unwrapped({}));
});

afterEach(cleanup);

describe("ReleaseWizardRegions", () => {
  it("keeps the selection when the release is refetched", () => {
    const store = renderRegions();

    fireEvent.click(countryCheckbox("GB"));
    expect(countryCheckbox("GB").checked).toBe(true);

    act(() => {
      store.dispatch(setRelease({ ...release, territories: ["FR", "DE"] }));
    });

    expect(countryCheckbox("GB").checked).toBe(true);
    expect(countryCheckbox("FR").checked).toBe(true);
  });

  it("lists only countries with an override", () => {
    renderRegions();

    expect(screen.getByDisplayValue("Titre")).toBeInTheDocument();
    expect(screen.getAllByLabelText("Release title override")).toHaveLength(1);
  });

  it("removes an unticked country's override only on Save", async () => {
    renderRegions();

    fireEvent.click(countryCheckbox("FR"));

    expect(deleteDetail).not.toHaveBeenCalled();
    expect(
      screen.getByText(/override for France will be removed when you save/),
    ).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: "Save & continue" })[0]);

    await waitFor(() =>
      expect(deleteDetail).toHaveBeenCalledWith({
        releaseId: "release-1",
        detailId: "detail-fr",
      }),
    );
    expect(updateTerritories).toHaveBeenCalledWith({
      id: "release-1",
      territories: ["DE"],
    });
    expect(updateTerritories.mock.invocationCallOrder[0]).toBeLessThan(
      deleteDetail.mock.invocationCallOrder[0],
    );
  });

  it("doesn't post a saved override again on blur", async () => {
    renderRegions();

    const title = screen.getByDisplayValue("Titre");
    fireEvent.change(title, { target: { value: "Nouveau titre" } });
    fireEvent.blur(title);

    await waitFor(() => expect(updateDetail).toHaveBeenCalledTimes(1));
    expect(createDetail).not.toHaveBeenCalled();
    expect(updateDetail).toHaveBeenCalledWith(
      expect.objectContaining({ detailId: "detail-fr" }),
    );
  });
});
