import { useRef } from "react";
import { Card, Flex, Grid, Stack, Text } from "@sanity/ui";
import { set, unset, type ObjectInputProps } from "sanity";
import {
  ADVANCED_GROUP,
  DEFAULT_DARK_PALETTE,
  DEFAULT_LIGHT_PALETTE,
  THEME_TOKENS,
} from "../../lib/theme-tokens";
import { toPickerValue } from "./color-swatch-input";

const CORE_TOKENS = THEME_TOKENS.filter((t) => t.group !== ADVANCED_GROUP);
const ADVANCED_TOKENS = THEME_TOKENS.filter((t) => t.group === ADVANCED_GROUP);

/** Sanity token name (`card-foreground`) -> field name (`cardForeground`). */
const FIELD_FOR = new Map(THEME_TOKENS.map((t) => [t.name, t.field]));

const RING = "0 0 0 2px var(--card-focus-ring-color, #2276fc)";

/**
 * Custom input for `themePalette`: shows the palette as a small site preview
 * plus a swatch grid, then renders the regular fields underneath.
 *
 * Every color in the preview and every swatch is editable in place — clicking
 * one opens the browser color picker and writes straight to the matching field,
 * so checking a change no longer means scrolling down to the field list and
 * back up to the preview. Shift-click (or the ↺ button) clears a token back to
 * the starter color.
 *
 * Mode-agnostic on purpose — the preview paints itself with the palette it is
 * given. Which starter palette unset tokens fall back to comes from the field's
 * `options.mode` (`emphasis`/`dark`), so the dark object does not preview with
 * light defaults.
 */
export function PalettePreview(props: ObjectInputProps) {
  const values = (props.value ?? {}) as Record<string, unknown>;
  const readOnly = props.readOnly;

  const mode = (props.schemaType.options as { mode?: string } | undefined)?.mode;
  const fallback = mode === "dark" ? DEFAULT_DARK_PALETTE : DEFAULT_LIGHT_PALETTE;

  // Values are keyed by Sanity field name (`cardForeground`), the rest of the
  // codebase talks in CSS token names (`card-foreground`).
  const stored = (tokenName: string): string | null => {
    const raw = values[FIELD_FOR.get(tokenName) ?? tokenName];
    if (typeof raw === "string") return raw;
    const hex = (raw as { hex?: unknown } | undefined)?.hex;
    return typeof hex === "string" ? hex : null;
  };

  const color = (tokenName: string) =>
    stored(tokenName) ?? fallback[tokenName] ?? "transparent";

  // One shared, invisible <input type="color">. Its value is set imperatively
  // right before opening, because React state would not land before the dialog
  // reads the value.
  const pickerRef = useRef<HTMLInputElement>(null);
  const activeRef = useRef<string | null>(null);

  const commit = (field: string, hex: string) => {
    const next = hex.toLowerCase();
    props.onChange(
      values._type
        ? set(next, [field])
        : set({ ...values, _type: props.schemaType.name, [field]: next }),
    );
  };

  const clear = (field: string) => {
    if (values._type) props.onChange(unset([field]));
  };

  const openPicker = (tokenName: string) => {
    if (readOnly) return;
    const field = FIELD_FOR.get(tokenName);
    const input = pickerRef.current;
    if (!field || !input) return;
    activeRef.current = field;
    input.value = toPickerValue(color(tokenName));
    input.click();
  };

  return (
    <Stack gap={5}>
      <input
        ref={pickerRef}
        aria-hidden="true"
        tabIndex={-1}
        type="color"
        onChange={(event) => {
          const field = activeRef.current;
          if (field) commit(field, event.currentTarget.value);
        }}
        style={{
          height: 0,
          opacity: 0,
          pointerEvents: "none",
          position: "absolute",
          width: 0,
        }}
      />

      <Card
        padding={5}
        style={{
          background: color("background"),
          border: `1px solid ${color("border")}`,
          borderRadius: 8,
        }}
      >
        <Stack gap={4}>
          <Text size={2} weight="semibold" style={{ color: color("foreground") }}>
            Preview
          </Text>
          <Card
            padding={4}
            style={{
              background: color("card"),
              border: `1px solid ${color("border")}`,
              borderRadius: 6,
            }}
          >
            <Stack gap={3}>
              <Text
                size={1}
                style={{ color: color("card-foreground"), cursor: readOnly ? "default" : "pointer" }}
                onClick={() => openPicker("card-foreground")}
                title="Card text — click to change"
              >
                Card title
              </Text>
              <Text
                size={1}
                style={{
                  color: color("muted-foreground"),
                  cursor: readOnly ? "default" : "pointer",
                }}
                onClick={() => openPicker("muted-foreground")}
                title="Secondary text — click to change"
              >
                Secondary text on a card
              </Text>
              <Flex gap={2} wrap="wrap">
                <span
                  onClick={() => openPicker("primary")}
                  title="Primary — click to change"
                  style={{
                    background: color("primary"),
                    color: color("primary-foreground"),
                    borderRadius: 999,
                    cursor: readOnly ? "default" : "pointer",
                    fontSize: 13,
                    padding: "6px 14px",
                  }}
                >
                  Primary
                </span>
                <span
                  onClick={() => openPicker("secondary")}
                  title="Secondary — click to change"
                  style={{
                    background: color("secondary"),
                    color: color("secondary-foreground"),
                    borderRadius: 999,
                    cursor: readOnly ? "default" : "pointer",
                    fontSize: 13,
                    padding: "6px 14px",
                  }}
                >
                  Secondary
                </span>
                <span
                  onClick={() => openPicker("accent")}
                  title="Accent — click to change"
                  style={{
                    background: color("accent"),
                    color: color("accent-foreground"),
                    borderRadius: 999,
                    cursor: readOnly ? "default" : "pointer",
                    fontSize: 13,
                    padding: "6px 14px",
                  }}
                >
                  Accent
                </span>
              </Flex>
            </Stack>
          </Card>
        </Stack>
      </Card>

      <Text muted size={0}>
        Click any color above or any swatch below to change it. Shift-click a
        swatch to go back to the starter color.
      </Text>

      <Grid gridTemplateColumns={[2, 2, 3]} gap={2}>
        {CORE_TOKENS.map((token) => {
          const value = stored(token.name);
          return (
            <Card key={token.name} padding={2} radius={2}>
              <button
                type="button"
                disabled={readOnly}
                onClick={(event) => {
                  if (event.shiftKey) {
                    clear(token.field);
                    return;
                  }
                  openPicker(token.name);
                }}
                title={`${token.label} — click to change (shift-click to reset)`}
                style={{
                  all: "unset",
                  alignItems: "center",
                  border: `1px solid ${color("border")}`,
                  borderRadius: 6,
                  boxSizing: "border-box",
                  cursor: readOnly ? "default" : "pointer",
                  display: "flex",
                  gap: 12,
                  opacity: value ? 1 : 0.6,
                  padding: 8,
                  width: "100%",
                }}
              >
                <span
                  style={{
                    background: value ?? "transparent",
                    border: `1px solid ${value ? "rgba(0,0,0,0.15)" : color("border")}`,
                    borderRadius: 4,
                    flex: "none",
                    height: 22,
                    width: 22,
                  }}
                />
                <Stack gap={2}>
                  <Text size={1} weight="medium">
                    {token.label}
                  </Text>
                  <Text muted size={0} style={{ fontFamily: "monospace" }}>
                    {value ? `${value.toUpperCase()} · --${token.name}` : "default"}
                  </Text>
                </Stack>
              </button>
            </Card>
          );
        })}
      </Grid>

      {/* Advanced tokens stay out of the way: one compact strip, no labels. */}
      <Stack gap={3}>
        <Text muted size={0}>
          Advanced tokens — {ADVANCED_TOKENS.length} more. Click any swatch to
          change it; the hex fields for every color sit under “Advanced” below.
        </Text>
        <Flex gap={2} wrap="wrap">
          {ADVANCED_TOKENS.map((token) => (
            <button
              key={token.name}
              type="button"
              disabled={readOnly}
              title={`--${token.name} · ${stored(token.name) ?? "default"} — click to change`}
              onClick={() => openPicker(token.name)}
              style={{
                all: "unset",
                background: color(token.name),
                border: `1px solid ${color("border")}`,
                borderRadius: 3,
                boxSizing: "border-box",
                cursor: readOnly ? "default" : "pointer",
                height: 16,
                width: 16,
              }}
            />
          ))}
        </Flex>
      </Stack>

      {props.renderDefault(props)}
    </Stack>
  );
}
