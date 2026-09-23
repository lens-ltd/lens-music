import type { ReactNode } from "react";
import { act, renderHook } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useWizardStepNavigation } from "./wizardStepNavigation.hooks";

const createFlow = vi.fn();
const completeFlow = vi.fn();
const toastError = vi.fn();

vi.mock("./navigation.hooks", () => ({
  useCreateReleaseNavigationFlow: () => ({
    createReleaseNavigationFlow: createFlow,
  }),
  useCompleteReleaseNavigationFlow: () => ({
    completeReleaseNavigationFlow: completeFlow,
  }),
}));

vi.mock("sonner", () => ({
  toast: { error: (message: string) => toastError(message) },
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter initialEntries={["/releases/release-1/wizard"]}>
    <Routes>
      <Route path="/releases/:id/wizard" element={children} />
    </Routes>
  </MemoryRouter>
);

const renderNavigation = () =>
  renderHook(
    () =>
      useWizardStepNavigation({
        currentStepName: "REGIONS",
        nextStepName: "STORES",
        previousStepName: "MANAGE_CONTRIBUTIONS",
      }),
    { wrapper },
  );

beforeEach(() => {
  createFlow.mockReset().mockResolvedValue({});
  completeFlow.mockReset().mockResolvedValue({});
  toastError.mockReset();
});

describe("useWizardStepNavigation", () => {
  it("saves, completes the current step, then opens the next one", async () => {
    const calls: string[] = [];
    const save = vi.fn(async () => {
      calls.push("save");
    });
    completeFlow.mockImplementation(async () => calls.push("complete"));
    createFlow.mockImplementation(async () => calls.push("create"));

    const { result } = renderNavigation();
    let moved = false;
    await act(async () => {
      moved = await result.current.goNext(save);
    });

    expect(moved).toBe(true);
    expect(calls).toEqual(["save", "complete", "create"]);
    expect(completeFlow).toHaveBeenCalledWith({
      isCompleted: true,
      staticReleaseNavigationStepName: "REGIONS",
    });
    expect(createFlow).toHaveBeenCalledWith({
      releaseId: "release-1",
      staticReleaseNavigationStepName: "STORES",
    });
    expect(result.current.isNavigating).toBe(false);
  });

  it("stays on the step and shows the error when the save fails", async () => {
    const save = vi.fn().mockRejectedValue({
      status: 400,
      data: { message: "Select at least one country" },
    });

    const { result } = renderNavigation();
    let moved = true;
    await act(async () => {
      moved = await result.current.goNext(save);
    });

    expect(moved).toBe(false);
    expect(completeFlow).not.toHaveBeenCalled();
    expect(createFlow).not.toHaveBeenCalled();
    expect(toastError).toHaveBeenCalledWith("Select at least one country");
  });

  it("stops quietly when the save returns false", async () => {
    const { result } = renderNavigation();
    await act(async () => {
      await result.current.goNext(async () => false);
    });

    expect(completeFlow).not.toHaveBeenCalled();
    expect(createFlow).not.toHaveBeenCalled();
    expect(toastError).not.toHaveBeenCalled();
  });

  it("shows a toast when going back fails", async () => {
    createFlow.mockRejectedValue({ status: "FETCH_ERROR", error: "Failed to fetch" });

    const { result } = renderNavigation();
    let moved = true;
    await act(async () => {
      moved = await result.current.goBack();
    });

    expect(moved).toBe(false);
    expect(createFlow).toHaveBeenCalledWith({
      releaseId: "release-1",
      staticReleaseNavigationStepName: "MANAGE_CONTRIBUTIONS",
    });
    expect(toastError).toHaveBeenCalledWith(
      expect.stringMatching(/couldn't reach the server/),
    );
  });

  it("ignores a second click while a move is running", async () => {
    let finish: () => void = () => {};
    createFlow.mockImplementation(
      () => new Promise<void>((resolve) => (finish = resolve)),
    );

    const { result } = renderNavigation();
    let first: Promise<boolean> = Promise.resolve(false);
    let second = true;
    await act(async () => {
      first = result.current.goTo("STORES");
      second = await result.current.goTo("STORES");
    });
    expect(second).toBe(false);
    expect(result.current.isNavigating).toBe(true);

    await act(async () => {
      finish();
      await first;
    });
    expect(createFlow).toHaveBeenCalledTimes(1);
    expect(result.current.isNavigating).toBe(false);
  });
});
