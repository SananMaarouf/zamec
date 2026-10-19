import { Card, Grid, Stack, Text, TextInput } from "@sanity/ui";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { set, type StringInputProps } from "sanity";

import {
  FONT_CATEGORIES,
  GOOGLE_FONTS,
  SYSTEM_FONT,
  googleFont,
} from "../../lib/google-fonts";
import { loadFontPreview, previewFontFamily } from "./load-google-font";

/**
 * Picker for one font choice (`theme.fonts.heading` / `theme.fonts.body`).
 *
 * Replaces the default dropdown so every option can be shown in its own
 * typeface, which is the only way to choose a font without opening Google's
 * specimen pages. Families are loaded lazily: a row injects its stylesheet only
 * once it scrolls into view, so opening the Studio does not pull ~50 webfonts.
 *
 * The stored value is the exact Google Fonts family name, or `system` for "no
 * webfont, use the site default" (see `src/lib/google-fonts.ts`).
 */
export function FontSelectInput(props: StringInputProps) {
  const { value, onChange, readOnly, elementProps, schemaType } = props;
  const [query, setQuery] = useState("");

  const label = schemaType.title ?? "font";

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return GOOGLE_FONTS;
    return GOOGLE_FONTS.filter(
      (font) =>
        font.family.toLowerCase().includes(needle) ||
        font.category.toLowerCase().includes(needle),
    );
  }, [query]);

  const groups = useMemo(
    () =>
      FONT_CATEGORIES.map((category) => {
        const fonts = visible.filter((font) => font.category === category);
        return { category, fonts };
      }).filter((group) => group.fonts.length > 0),
    [visible],
  );

  // An unknown value (family dropped from the catalog) is a hard error, so it
  // must stay visible instead of silently rendering as "site default".
  const stored = (value ?? "").trim();
  const unknown = stored && stored !== SYSTEM_FONT && !googleFont(stored);
  const selected = unknown ? "" : stored || SYSTEM_FONT;

  const choose = (next: string) => {
    if (!readOnly) onChange(set(next));
  };

  return (
    <Stack {...elementProps} gap={4}>
      <Stack gap={3}>
        <TextInput
          aria-label={`Search ${label} options`}
          clearButton={query.length > 0}
          disabled={readOnly}
          onChange={(event) => setQuery(event.currentTarget.value)}
          placeholder="Search Google Fonts by name or style…"
          value={query}
        />
        {unknown ? (
          <Text size={1} style={{ color: "var(--card-critical-fg-color)" }}>
            “{stored}” is not in the font catalog. Pick a font below — the site
            falls back to its built-in stack until you do.
          </Text>
        ) : null}
      </Stack>

      <FontCard
        family={null}
        title="Site default"
        detail="No webfont — uses the built-in stack"
        selected={selected === SYSTEM_FONT}
        readOnly={readOnly}
        onSelect={() => choose(SYSTEM_FONT)}
      />

      {groups.map((group) => (
        <Stack key={group.category} gap={3}>
          <Text muted size={0} weight="semibold">
            {group.category.toUpperCase()}
          </Text>
          <Grid gridTemplateColumns={[1, 2]} gap={2}>
            {group.fonts.map((font) => (
              <FontCard
                key={font.family}
                family={font.family}
                title={font.family}
                selected={selected === font.family}
                readOnly={readOnly}
                onSelect={() => choose(font.family)}
              />
            ))}
          </Grid>
        </Stack>
      ))}

      {groups.length === 0 ? (
        <Text muted size={1}>
          No font matches “{query.trim()}”.
        </Text>
      ) : null}
    </Stack>
  );
}

interface FontCardProps {
  /** `null` renders the "site default" card. */
  family: string | null;
  title: string;
  detail?: string;
  selected: boolean;
  readOnly?: boolean;
  onSelect: () => void;
}

/**
 * One clickable option. The family name is rendered in the family itself; the
 * stylesheet is requested only when the card first becomes visible.
 */
function FontCard(props: FontCardProps) {
  const { family, title, detail, selected, readOnly, onSelect } = props;
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!family) return;

    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      loadFontPreview(family);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        loadFontPreview(family);
        observer.disconnect();
      },
      { rootMargin: "300px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [family]);

  return (
    <Card
      as="button"
      type="button"
      padding={3}
      radius={2}
      border
      tone={selected ? "primary" : "default"}
      disabled={readOnly}
      onClick={onSelect}
      aria-pressed={selected}
      ref={ref as ComponentProps<typeof Card>["ref"]}
      style={{
        cursor: readOnly ? "default" : "pointer",
        fontFamily: previewFontFamily(family),
        textAlign: "left",
        width: "100%",
      }}
    >
      <Stack gap={2}>
        <Text
          size={2}
          style={{ fontFamily: "inherit" }}
          textOverflow="ellipsis"
        >
          {title}
        </Text>
        {detail ? (
          <Text muted size={0} style={{ fontFamily: "inherit" }}>
            {detail}
          </Text>
        ) : null}
      </Stack>
    </Card>
  );
}
