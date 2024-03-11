import resolveConfig from "tailwindcss/resolveConfig";
import type { DefaultColors } from "tailwindcss/types/generated/colors";
import tailwindConfig from "../../../tailwind.config";

export const fullConfig = resolveConfig(tailwindConfig);

// types are not resolved properly, so we add the Record type manually.
export const colors = fullConfig.theme.colors as
  & DefaultColors
  & Record<string, string | Record<string, string>>;
