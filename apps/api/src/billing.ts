import { z } from "zod";

const ENABLED_VALUES = new Set(["1", "true", "yes", "on"]);
const DISABLED_VALUES = new Set(["", "0", "false", "no", "off"]);

const normalizeBooleanFlag = (value: unknown) => {
  if (typeof value === "boolean") {
    return value;
  }
  if (value === undefined || value === null) {
    return false;
  }
  if (typeof value !== "string") {
    return value;
  }

  const normalizedValue = value.trim().toLowerCase();
  if (ENABLED_VALUES.has(normalizedValue)) {
    return true;
  }
  if (DISABLED_VALUES.has(normalizedValue)) {
    return false;
  }

  return value;
};

const UNLIMITED_SELF_HOSTED_LIMIT = Number.MAX_SAFE_INTEGER;

export const booleanFlagSchema = z.preprocess(normalizeBooleanFlag, z.boolean());

export const SELF_HOSTED_LIMITS = Object.freeze({
  maxOrganizations: UNLIMITED_SELF_HOSTED_LIMIT,
  maxUsersPerOrganization: UNLIMITED_SELF_HOSTED_LIMIT,
});
