import { describe, expect, it } from "vitest";
import {
  getAdjacentWizardStepNames,
  getOrderedWizardSteps,
  getReleaseNavigationFlow,
  getStaticReleaseNavigationStep,
} from "./navigations.helper";
import { GroupedStaticReleaseNavigation, StaticReleaseNavigation } from "@/types/models/staticReleaseNavigation.types";
import { ReleaseNavigationFlow } from "@/types/models/releaseNavigationFlow.types";

const step = (
  stepName: string,
  tabName: string,
  tabOrder: number,
  stepOrder: number,
): StaticReleaseNavigation =>
  ({
    id: `step-${stepName}`,
    stepName,
    stepDescription: "",
    stepOrder,
    tabName,
    tabDescription: "",
    tabOrder,
  }) as StaticReleaseNavigation;

// Deliberately out of order, the way the grouped API response can arrive.
const STATIC_STEPS: GroupedStaticReleaseNavigation = {
  DISTRIBUTION: [step("STORES", "DISTRIBUTION", 3, 2), step("REGIONS", "DISTRIBUTION", 3, 1)],
  DETAILS: [
    step("MANAGE_CONTRIBUTIONS", "DETAILS", 1, 3),
    step("OVERVIEW", "DETAILS", 1, 1),
    step("UPLOAD_TRACKS", "DETAILS", 1, 2),
  ],
  REVIEW: [step("PREVIEW", "REVIEW", 4, 1)],
};

describe("getOrderedWizardSteps", () => {
  it("orders by tab, then by step", () => {
    expect(getOrderedWizardSteps(STATIC_STEPS).map((s) => s.stepName)).toEqual([
      "OVERVIEW",
      "UPLOAD_TRACKS",
      "MANAGE_CONTRIBUTIONS",
      "REGIONS",
      "STORES",
      "PREVIEW",
    ]);
  });

  it("returns an empty list when steps have not loaded", () => {
    expect(getOrderedWizardSteps({})).toEqual([]);
  });
});

describe("getAdjacentWizardStepNames", () => {
  it("has no previous step on the first step", () => {
    expect(getAdjacentWizardStepNames(STATIC_STEPS, "OVERVIEW")).toEqual({
      previousStepName: undefined,
      nextStepName: "UPLOAD_TRACKS",
    });
  });

  it("crosses tab boundaries", () => {
    expect(getAdjacentWizardStepNames(STATIC_STEPS, "MANAGE_CONTRIBUTIONS")).toEqual({
      previousStepName: "UPLOAD_TRACKS",
      nextStepName: "REGIONS",
    });
  });

  it("has no next step on the last step", () => {
    expect(getAdjacentWizardStepNames(STATIC_STEPS, "PREVIEW")).toEqual({
      previousStepName: "STORES",
      nextStepName: undefined,
    });
  });

  it("returns nothing for an unknown step", () => {
    expect(getAdjacentWizardStepNames(STATIC_STEPS, "UNKNOWN")).toEqual({
      previousStepName: undefined,
      nextStepName: undefined,
    });
  });
});

describe("lookups", () => {
  it("finds a static step by name across tabs", () => {
    expect(getStaticReleaseNavigationStep(STATIC_STEPS, "REGIONS")?.id).toBe("step-REGIONS");
    expect(getStaticReleaseNavigationStep(STATIC_STEPS, "UNKNOWN")).toBeUndefined();
  });

  it("finds a flow by its step name", () => {
    const flows = [
      { id: "flow-1", staticReleaseNavigation: STATIC_STEPS.DETAILS[1] },
    ] as unknown as ReleaseNavigationFlow[];
    expect(getReleaseNavigationFlow(flows, "OVERVIEW")?.id).toBe("flow-1");
    expect(getReleaseNavigationFlow(flows, "STORES")).toBeUndefined();
  });
});
