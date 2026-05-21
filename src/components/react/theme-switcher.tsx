import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}

export function ThemeSwitcherMobile() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const setThemeMode = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="theme" className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          Theme
        </AccordionTrigger>
        <AccordionContent className="mt-2 flex flex-col gap-2">
          <Button
            variant={theme === "light" ? "default" : "ghost"}
            onClick={() => setThemeMode("light")}
            className="w-full justify-start gap-2"
          >
            <Sun className="h-5 w-5" />
            <span>Light Mode</span>
          </Button>
          <Button
            variant={theme === "dark" ? "default" : "ghost"}
            onClick={() => setThemeMode("dark")}
            className="w-full justify-start gap-2"
          >
            <Moon className="h-5 w-5" />
            <span>Dark Mode</span>
          </Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
