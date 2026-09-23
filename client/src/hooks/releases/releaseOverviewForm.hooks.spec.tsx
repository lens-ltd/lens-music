import type { ReactNode } from "react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import releaseReducer, { setRelease } from "@/state/features/releaseSlice";
import { useAppSelector } from "@/state/hooks";
import { Release } from "@/types/models/release.types";
import { useReleaseOverviewForm } from "./releaseOverviewForm.hooks";

const release = {
  id: "release-1",
  title: "Saved title",
  productionYear: 2025,
  genres: [],
} as unknown as Release;

const renderOverviewForm = () => {
  const store = configureStore({ reducer: { release: releaseReducer } });
  store.dispatch(setRelease(release));

  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  const view = renderHook(
    () => useReleaseOverviewForm(useAppSelector((state) => state.release.release)),
    { wrapper },
  );
  return { store, ...view };
};

describe("useReleaseOverviewForm", () => {
  it("starts from the release's saved values", () => {
    const { result } = renderOverviewForm();

    expect(result.current.getValues("title")).toBe("Saved title");
    expect(result.current.getValues("productionYear")).toBe("2025");
  });

  it("keeps typed values when the same release is updated", () => {
    const { store, result } = renderOverviewForm();

    act(() => {
      result.current.setValue("title", "Typed title", { shouldDirty: true });
    });
    // A cover-art upload stores the updated release.
    act(() => {
      store.dispatch(
        setRelease({ ...release, coverArtUrl: "https://example.com/cover.jpg" }),
      );
    });

    expect(result.current.getValues("title")).toBe("Typed title");
  });

  it("loads the new release's values when the release id changes", () => {
    const { store, result } = renderOverviewForm();

    act(() => {
      result.current.setValue("title", "Typed title");
    });
    act(() => {
      store.dispatch(
        setRelease({ ...release, id: "release-2", title: "Other release" }),
      );
    });

    expect(result.current.getValues("title")).toBe("Other release");
  });
});
