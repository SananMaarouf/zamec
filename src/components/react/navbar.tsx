import type { ReactNode } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  mobileSheetLinkClassName,
  mobileSheetTriggerClassName,
} from "./mobile-nav-styles";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeSwitch } from "./theme-switcher";

export interface MenuItem {
  title: string;
  url: string;
  description?: string;
  items?: MenuItem[];
}

interface NavbarProps {
  logo: {
    url: string;
    title: string;
  };
  menu?: MenuItem[];
  linkBtn?: {
    title: string;
    url: string;
  };
  children?: ReactNode;
  mobileExtras?: ReactNode;
}

// Shared by every plain nav entry — including the trailing `linkBtn` — so the
// last link reads as one of the menu links instead of a primary-colored CTA.
const navLinkClassName =
  "bg-background hover:bg-muted hover:text-accent-foreground group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors";

// The mobile sheet is the only navigation on small screens: its entries sit in
// a content-width column that is centered in the sheet, while the labels
// themselves stay left-aligned with each other. The shared classes live in
// `mobile-nav-styles.ts`.

const Navbar = ({ logo, menu = [], linkBtn, children, mobileExtras }: NavbarProps) => {
  return (
    <section
      id="site-navbar"
      className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b pt-4 pb-4"
    >
      <div className="container">
        {/* Desktop Menu */}
        <nav className="hidden justify-between gap-3 lg:flex">
          <div className="flex items-center w-full">
            <a href={logo.url} className="flex items-center">
              <span className="text-lg font-semibold tracking-tighter whitespace-nowrap">
                {logo.title}
              </span>
            </a>
            {menu.length > 0 && (
              <div className="flex ml-auto items-center">
                <NavigationMenu className="[&_div.absolute]:-left-8 [&_div.absolute]:top-10">
                  <NavigationMenuList>
                    {menu.map((item) => renderMenuItem(item))}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            )}
          </div>
          <div className="flex gap-2 items-center">
            {children && <div className="flex items-center">{children}</div>}
            <ThemeSwitch />
            {linkBtn && (
              <a href={linkBtn.url} className={navLinkClassName}>
                {linkBtn.title}
              </a>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <a href={logo.url} className="flex items-center">
              <span className="text-2xl font-semibold tracking-tighter whitespace-nowrap">
                {logo.title}
              </span>
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon-lg" className="size-12">
                  <Menu className="size-7" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                {/* Kept visually hidden: Radix needs a title for screen
                    readers, but the mobile sheet shows no visible heading. */}
                <SheetHeader className="sr-only">
                  <SheetTitle>{logo.title}</SheetTitle>
                </SheetHeader>
                <div className="mx-auto flex w-fit max-w-full flex-col items-start gap-8 p-4 pt-10">
                  {menu.length > 0 && (
                    <Accordion
                      type="single"
                      collapsible
                      className="flex w-full wrap-break-word flex-col gap-8"
                    >
                      {menu.map((item) => renderMobileMenuItem(item))}
                    </Accordion>
                  )}

                  <div className="flex w-full flex-col items-stretch gap-8">
                    {linkBtn && (
                      <a href={linkBtn.url} className={mobileSheetLinkClassName}>
                        {linkBtn.title}
                      </a>
                    )}
                    {/* Language entries and the theme switch sit directly in
                        the menu — both are self-explanatory, so they need no
                        accordion row of their own. */}
                    {mobileExtras}
                    <ThemeSwitch />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink href={item.url} className={navLinkClassName}>
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem
        key={item.title}
        value={item.title}
        className="w-full border-b-0"
      >
        <AccordionTrigger className={mobileSheetTriggerClassName}>
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} inSheet />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className={mobileSheetLinkClassName}>
      {item.title}
    </a>
  );
};

const SubMenuLink = ({
  item,
  inSheet = false,
}: {
  item: MenuItem;
  /** Mobile sheet: fill the menu column and keep the text left-aligned. */
  inSheet?: boolean;
}) => {
  return (
    <a
      className={cn(
        "hover:bg-muted hover:text-accent-foreground flex min-w-70 select-none flex-row gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors",
        inSheet && "w-full min-w-0 justify-start text-left",
      )}
      href={item.url}
    >
      <div>
        <div className={cn("text-sm font-semibold", inSheet && "text-xl")}>
          {item.title}
        </div>
        {item.description && (
          <p className="text-muted-foreground text-sm leading-snug wrap-break-word whitespace-normal">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};

export { Navbar };
