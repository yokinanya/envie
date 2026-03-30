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

export const booleanFlagSchema = z.preprocess(normalizeBooleanFlag, z.boolean());

export const parseBooleanFlag = (value: unknown, name: string) => {
  const normalizedValue = normalizeBooleanFlag(value);
  if (typeof normalizedValue === "boolean") {
    return normalizedValue;
  }

  throw new Error(
    `Invalid ${name} value "${String(value)}". Use 1/0, true/false, yes/no, or on/off.`
  );
};
