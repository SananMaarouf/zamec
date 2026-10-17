import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The `<html class="dark">` class is the source of truth for the theme — the
 * inline script in `Layout.astro` sets it before first paint. Every switch
 * instance mirrors it through a MutationObserver, so toggling the switch in
 * the mobile sheet also moves the one in the desktop navbar.
 */
function useThemeMode() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    const sync = () =>
      setTheme(root.classList.contains("dark") ? "dark" : "light");

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const setThemeMode = (next: "light" | "dark") => {
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return { theme, setThemeMode };
}

/**
 * Big horizontal light switch: a knob slides between the sun (light) and the
 * moon (dark) end. Used both in the desktop navbar and in the mobile sheet —
 * `sm` is the compact desktop variant.
 */
const themeSwitchSizes = {
  sm: {
    track: "h-8 w-16",
    knob: "size-6",
    knobShift: "translate-x-8",
    sun: "left-[9px] size-3.5",
    moon: "right-[9px] size-3.5",
  },
  md: {
    track: "h-12 w-24",
    knob: "size-10",
    knobShift: "translate-x-12",
    sun: "left-3.5 size-5",
    moon: "right-3.5 size-5",
  },
} as const;

export function ThemeSwitch({
  size = "md",
  className,
}: {
  size?: keyof typeof themeSwitchSizes;
  className?: string;
}) {
  const { theme, setThemeMode } = useThemeMode();
  const isDark = theme === "dark";
  const styles = themeSwitchSizes[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark mode"
      onClick={() => setThemeMode(isDark ? "light" : "dark")}
      className={cn(
        "bg-muted focus-visible:ring-ring/50 relative inline-flex shrink-0 cursor-pointer items-center rounded-0 border transition-colors outline-none focus-visible:ring-[3px]",
        styles.track,
        className,
      )}
    >
      {/* Painted before the icons, so the active icon stays readable on top. */}
      <span
        aria-hidden="true"
        className={cn(
          "bg-primary absolute top-1 left-1 rounded-0 shadow-sm transition-transform duration-300 ease-in-out",
          styles.knob,
          isDark && styles.knobShift,
        )}
      />
      <Sun
        aria-hidden="true"
        className={cn(
          "absolute transition-colors",
          styles.sun,
          isDark ? "text-muted-foreground" : "text-primary-foreground",
        )}
      />
      <Moon
        aria-hidden="true"
        className={cn(
          "absolute transition-colors",
          styles.moon,
          isDark ? "text-primary-foreground" : "text-muted-foreground",
        )}
      />
    </button>
  );
}
