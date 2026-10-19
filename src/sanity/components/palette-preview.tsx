import { Card, Flex, Grid, Stack, Text } from "@sanity/ui";
import type { ObjectInputProps } from "sanity";
import {
  ADVANCED_GROUP,
  DEFAULT_LIGHT_PALETTE,
  THEME_TOKENS,
} from "../../lib/theme-tokens";

const CORE_TOKENS = THEME_TOKENS.filter((t) => t.group !== ADVANCED_GROUP);
const ADVANCED_TOKENS = THEME_TOKENS.filter((t) => t.group === ADVANCED_GROUP);

/**
 * Custom input for `themePalette`: shows the palette as a small site preview
 * plus a swatch grid, then renders the regular fields underneath.
 *
 * Mode-agnostic on purpose — the preview paints itself with the palette it is
 * given, so it reads correctly for both the light and the dark object.
 */
export function PalettePreview(props: ObjectInputProps) {
  const values = (props.value ?? {}) as Record<string, unknown>;

  // Values are keyed by Sanity field name (`cardForeground`), the rest of the
  // codebase talks in CSS token names (`card-foreground`).
  const fieldFor = new Map(THEME_TOKENS.map((t) => [t.name, t.field]));

  const stored = (tokenName: string): string | null => {
    const raw = values[fieldFor.get(tokenName) ?? tokenName];
    if (typeof raw === "string") return raw;
    const hex = (raw as { hex?: unknown } | undefined)?.hex;
    return typeof hex === "string" ? hex : null;
  };

  const color = (tokenName: string) =>
    stored(tokenName) ?? DEFAULT_LIGHT_PALETTE[tokenName] ?? "transparent";

  return (
    <Stack gap={5}>
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
              <Text size={1} style={{ color: color("card-foreground") }}>
                Card title
              </Text>
              <Text size={1} style={{ color: color("muted-foreground") }}>
                Secondary text on a card
              </Text>
              <Flex gap={2} wrap="wrap">
                <span
                  style={{
                    background: color("primary"),
                    color: color("primary-foreground"),
                    borderRadius: 999,
                    fontSize: 13,
                    padding: "6px 14px",
                  }}
                >
                  Primary
                </span>
                <span
                  style={{
                    background: color("secondary"),
                    color: color("secondary-foreground"),
                    borderRadius: 999,
                    fontSize: 13,
                    padding: "6px 14px",
                  }}
                >
                  Secondary
                </span>
                <span
                  style={{
                    background: color("accent"),
                    color: color("accent-foreground"),
                    borderRadius: 999,
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

      <Grid gridTemplateColumns={[2, 2, 3]} gap={2}>
        {CORE_TOKENS.map((token) => {
          const value = stored(token.name);
          return (
            <Card
              key={token.name}
              padding={3}
              radius={2}
              style={{
                border: `1px solid ${color("border")}`,
                opacity: value ? 1 : 0.6,
              }}
            >
              <Flex align="center" gap={3}>
                <div
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
                    {value
                      ? `${value.toUpperCase()} · --${token.name}`
                      : "default"}
                  </Text>
                </Stack>
              </Flex>
            </Card>
          );
        })}
      </Grid>

      {/* Advanced tokens stay out of the way: one compact strip, no labels. */}
      <Stack gap={3}>
        <Text muted size={0}>
          Advanced tokens — {ADVANCED_TOKENS.length} more, editable under
          “Advanced” below
        </Text>
        <Flex gap={2} wrap="wrap">
          {ADVANCED_TOKENS.map((token) => (
            <div
              key={token.name}
              title={`--${token.name} · ${stored(token.name) ?? "default"}`}
              style={{
                background: color(token.name),
                border: `1px solid ${color("border")}`,
                borderRadius: 3,
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
