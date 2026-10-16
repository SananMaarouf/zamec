import { Card, Flex, Stack, Text } from "@sanity/ui";
import { useEffect } from "react";
import type { ObjectInputProps } from "sanity";

import { googleFont } from "../../lib/google-fonts";
import { loadFontPreview, previewFontFamily } from "./load-google-font";

interface FontsValue {
  heading?: string | null;
  body?: string | null;
}

/**
 * Custom input for `theme.fonts`: two live samples (headline + body copy) in the
 * selected typefaces, then the regular heading/body pickers underneath.
 *
 * The sample uses the same `font-family` values the site generates, so what the
 * client sees here is what the page will render.
 */
export function FontsPreview(props: ObjectInputProps) {
  const { heading, body } = (props.value ?? {}) as FontsValue;

  // Only the two chosen families are loaded for the sample.
  useEffect(() => {
    for (const value of [heading, body]) {
      const font = googleFont(value);
      if (font) loadFontPreview(font.family);
    }
  }, [heading, body]);

  const headingFont = googleFont(heading);
  const bodyFont = googleFont(body);

  // Same fallback chain as the site: an unset heading follows the body font.
  const headingFamily = previewFontFamily(
    headingFont ? headingFont.family : body,
  );
  const bodyFamily = previewFontFamily(body);

  return (
    <Stack gap={5}>
      <Card padding={5} radius={2} border>
        <Stack gap={4}>
          <Stack gap={2}>
            <Text muted size={0} weight="semibold">
              HEADINGS
            </Text>
            <Text
              size={4}
              weight="semibold"
              style={{ fontFamily: headingFamily }}
            >
              The quick brown fox jumps over the lazy dog
            </Text>
          </Stack>

          <Stack gap={2}>
            <Text muted size={0} weight="semibold">
              BODY TEXT
            </Text>
            <Text size={1} style={{ fontFamily: bodyFamily }}>
              Body copy is set in the font chosen for the rest of the content.
              Headings, cards, buttons and navigation follow the two choices
              above, so a long-form paragraph like this one should still be
              comfortable to read.
            </Text>
          </Stack>

          <Flex gap={3} wrap="wrap">
            <Text muted size={0}>
              Heading: <strong>{headingFont?.family ?? "Site default"}</strong>
            </Text>
            <Text muted size={0}>
              Body: <strong>{bodyFont?.family ?? "Site default"}</strong>
            </Text>
          </Flex>
        </Stack>
      </Card>

      {props.renderDefault(props)}
    </Stack>
  );
}
