import { useEffect, useRef } from "react";
import { SlugInput, set, useFormValue, type SlugInputProps } from "sanity";

import { englishText, slugify, type I18nStringItem } from "../lib/slug";

/**
 * Slug input that fills itself from the English title.
 *
 * Sanity's stock slug field only fills in when someone clicks "Generate".
 * Here the slug is written as soon as a title exists and kept in sync while
 * the title changes — until an editor types their own slug, after which it is
 * left alone.
 */
export function AutoSlugInput(props: SlugInputProps) {
  const { value, onChange, readOnly } = props;
  const titles = useFormValue(["title"]) as I18nStringItem[] | undefined;

  // The last slug this component wrote. Anything else means a human edited it.
  const generatedSlug = useRef<string | null>(null);

  const nextSlug = slugify(englishText(titles));
  const currentSlug = value?.current?.trim() ?? "";

  const commit = (slug: string) => {
    generatedSlug.current = slug;
    onChange(set({ _type: "slug", current: slug }));
  };

  useEffect(() => {
    if (readOnly || !nextSlug) return;
    if (!currentSlug) {
      commit(nextSlug);
      return;
    }
    // Title changed after we generated the slug — follow the new title.
    if (generatedSlug.current === currentSlug && currentSlug !== nextSlug) {
      commit(nextSlug);
    }
  }, [nextSlug, currentSlug, readOnly]);

  // Any edit coming through the input itself is a manual one.
  const handleChange: SlugInputProps["onChange"] = (patch) => {
    generatedSlug.current = null;
    onChange(patch);
  };

  return <SlugInput {...props} onChange={handleChange} />;
}
