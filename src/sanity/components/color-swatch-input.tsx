import { Flex, Stack, Text, TextInput } from "@sanity/ui";
import { set, type StringInputProps } from "sanity";
import { THEME_TOKENS } from "../../lib/theme-tokens";

/** Sanity field name (`cardForeground`) -> CSS token name (`card-foreground`). */
const CSS_TOKEN = new Map(THEME_TOKENS.map((token) => [token.field, token.name]));

const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

/** Accept only values the site can actually render (`toCssColor` mirrors this). */
const normalize = (value?: string | null): string | null => {
  const trimmed = (value ?? "").trim().toLowerCase();
  return HEX_RE.test(trimmed) ? trimmed : null;
};

/** `<input type="color">` only understands `#rrggbb`. */
const toPickerValue = (hex: string): string => {
  if (hex.length === 4) {
    const [r, g, b] = hex.slice(1).split("");
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return hex.slice(0, 7);
};

/**
 * Input for a single palette token.
 *
 * Colors are stored as plain hex strings rather than @sanity/color-input
 * objects: that plugin stores 18 attributes per color, which pushed a full
 * light+dark palette past Sanity's 1000-attribute-per-document limit (and the
 * site only ever reads the hex anyway).
 */
export function ColorSwatchInput(props: StringInputProps) {
  const { value, onChange, elementProps, schemaType, readOnly } = props;

  const valid = normalize(value);
  const invalid = Boolean(value) && !valid;
  const commit = (next: string) => onChange(set(next.trim().toLowerCase()));

  return (
    <Stack gap={2}>
      <Flex align="center" gap={2}>
        <input
          aria-label={`${schemaType.title ?? "Color"} swatch`}
          disabled={readOnly}
          onChange={(event) => commit(event.currentTarget.value)}
          type="color"
          value={valid ? toPickerValue(valid) : "#000000"}
          style={{
            background: "none",
            border: "none",
            cursor: readOnly ? "default" : "pointer",
            flex: "none",
            height: 33,
            padding: 0,
            width: 44,
          }}
        />
        <TextInput
          {...elementProps}
          onChange={(event) => commit(event.currentTarget.value)}
          placeholder="#rrggbb — leave empty to use the starter color"
          readOnly={readOnly}
          value={value ?? ""}
        />
      </Flex>
      {invalid ? (
        <Text size={0} style={{ color: "var(--card-critical-fg-color, #d33)" }}>
          Not a valid color. Use a hex value such as #c96442.
        </Text>
      ) : null}
      {!value ? (
        <Text muted size={0}>
          Using the starter color for --{CSS_TOKEN.get(schemaType.name) ?? schemaType.name}
        </Text>
      ) : null}
    </Stack>
  );
}
