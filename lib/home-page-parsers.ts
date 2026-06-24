import { parseAsStringLiteral } from "nuqs";
import { HOMEPAGE_TABS } from "./constants";

export type HomePageTab = (typeof HOMEPAGE_TABS)[number];

export const homePageSearchParams = {
  tab: parseAsStringLiteral(HOMEPAGE_TABS).withDefault("overview"),
};
