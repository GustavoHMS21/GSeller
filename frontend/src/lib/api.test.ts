import { expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

const { classifyApiFailure } = await import("@/lib/api");

it.each([
  [401, "unauthorized", "login"],
  [403, "onboarding_required", "onboarding"],
  [403, "forbidden", "error"],
  [409, "tenant_already_exists", "error"],
  [500, undefined, "error"],
] as const)("status %s (%s) → %s", (status, code, expected) => {
  expect(classifyApiFailure(status, code)).toBe(expected);
});
