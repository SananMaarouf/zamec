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
 * moon (dark) end. Used both in the desktop navbar and in the mobile sheet.
 */
export function ThemeSwitch({ className }: { className?: string }) {
  const { theme, setThemeMode } = useThemeMode();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark mode"
      onClick={() => setThemeMode(isDark ? "light" : "dark")}
      className={cn(
        "bg-muted focus-visible:ring-ring/50 relative inline-flex h-12 w-24 shrink-0 cursor-pointer items-center rounded-full border transition-colors outline-none focus-visible:ring-[3px]",
        className,
      )}
    >
      {/* Painted before the icons, so the active icon stays readable on top. */}
      <span
        aria-hidden="true"
        className={cn(
          "bg-primary absolute top-1 left-1 size-10 rounded-full shadow-sm transition-transform duration-300 ease-in-out",
          isDark && "translate-x-12",
        )}
      />
      <Sun
        aria-hidden="true"
        className={cn(
          "absolute left-3.5 size-5 transition-colors",
          isDark ? "text-muted-foreground" : "text-primary-foreground",
        )}
      />
      <Moon
        aria-hidden="true"
        className={cn(
          "absolute right-3.5 size-5 transition-colors",
          isDark ? "text-primary-foreground" : "text-muted-foreground",
        )}
      />
    </button>
  );
}
