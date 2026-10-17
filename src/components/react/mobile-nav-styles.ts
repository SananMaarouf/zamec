/**
 * Classes shared by the mobile sheet menu.
 *
 * The sheet is rendered from two components — `navbar.tsx` (the CMS menu
 * entries) and `theme-switcher.tsx` (the "Theme" entry) — plus the Language
 * buttons in `LanguageSwitcherMobile.astro`. They have to look identical, so
 * the class strings live here instead of being duplicated per component.
 */

/** Plain menu link in the sheet, e.g. "About me". */
export const mobileSheetLinkClassName =
  "block w-full text-left text-2xl font-semibold";

/**
 * Accordion header in the sheet ("Language", "Theme"). `justify-start` keeps
 * the label on the same left edge as the plain links; the svg override matches
 * the 24px label size instead of the component's default 16px chevron.
 */
export const mobileSheetTriggerClassName =
  "justify-start text-2xl py-0 font-semibold hover:no-underline [&>svg]:size-6";

/** Option button inside a sheet accordion ("English", "Light Mode", ...). */
export const mobileSheetOptionClassName =
  "h-14 w-full justify-start gap-2 text-lg";
