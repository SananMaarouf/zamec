import { Globe, Mail, Phone, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ContactChannel } from "@/lib/contact";
import { BrandIcon } from "./brand-icons";

/**
 * The "other ways to get in touch" column beside the contact form.
 *
 * Editorial content: the heading and the rows come from the contact page's
 * `contactDetails` object in the CMS. Nothing renders unless at least one row
 * has both a type and a value, so removing every row puts the form back on its
 * own without a code change.
 *
 * Rendered without a `client:*` directive, so it ships as static markup and
 * costs no JavaScript.
 */

// Direct channels get outline icons; the social marks are inlined brand logos
// (see brand-icons.tsx).
const ICONS: Record<string, LucideIcon> = {
  phone: Phone,
  email: Mail,
  website: Globe,
};

// Text shown when the editor leaves the optional label empty. Phone and email
// show the number/address itself; a social link shows the platform name, which
// reads better than a full URL.
const PLATFORM_NAMES: Record<string, string> = {
  phone: "Phone",
  email: "Email",
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  website: "Website",
};

/** `tel:`/`mailto:` for direct channels, a normalised absolute URL otherwise. */
export const channelHref = (channel: ContactChannel): string => {
  const value = channel.value?.trim() ?? "";
  if (channel.platform === "phone") {
    // Keep a leading +, drop spaces and punctuation dialers do not understand.
    const dialable = value.replace(/(?!^\+)[^\d]/g, "");
    return `tel:${dialable}`;
  }
  if (channel.platform === "email") return `mailto:${value}`;
  return /^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`;
};

export const channelLabel = (channel: ContactChannel): string => {
  const label = channel.label?.trim();
  if (label) return label;
  const value = channel.value?.trim() ?? "";
  if (channel.platform === "phone" || channel.platform === "email")
    return value;
  return PLATFORM_NAMES[channel.platform ?? ""] ?? value;
};

const ChannelIcon = ({ platform }: { platform: string }) => {
  const Icon = ICONS[platform];
  if (Icon) return <Icon className="size-4" aria-hidden="true" />;
  return <BrandIcon platform={platform} className="size-4" />;
};

interface ContactDetailsProps {
  /** Heading above the list; the page passes the CMS value or its fallback. */
  title?: string | null;
  items?: ContactChannel[] | null;
  className?: string;
}

const ContactDetails = ({ title, items, className }: ContactDetailsProps) => {
  const channels = (items ?? []).filter(
    (channel) => channel?.platform && channel?.value?.trim(),
  );

  if (channels.length === 0) return null;

  const heading = title?.trim();

  return (
    <aside
      className={cn(
        "rounded-xl border border-border bg-card p-6 shadow-sm md:p-8",
        className,
      )}
    >
      {heading && (
        <h2 className="font-heading text-lg font-semibold text-balance">
          {heading}
        </h2>
      )}
      <ul className={cn("flex flex-col gap-4", heading && "mt-5")}>
        {channels.map((channel, index) => {
          const platform = channel.platform ?? "";
          const external = platform !== "phone" && platform !== "email";
          return (
            <li key={`${platform}-${index}`}>
              <a
                href={channelHref(channel)}
                className="group flex items-center gap-3 text-sm"
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted/60 text-foreground transition-colors group-hover:border-primary/50">
                  <ChannelIcon platform={platform} />
                </span>
                <span className="min-w-0 break-words group-hover:underline">
                  {channelLabel(channel)}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export { ContactDetails };
