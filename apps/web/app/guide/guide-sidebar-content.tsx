"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@repo/ui/button";
import { cn } from "@sglara/cn";
import {
  getGuideHref,
  getGuideLocaleFromPathname,
  getGuideLocaleLabel,
  getGuidePages,
  getGuideUiText,
  guideLocales,
  localizeGuidePathname,
} from "./guide-pages";

function LanguageSwitch({ locale, pathname }: { locale: "en" | "zh-CN"; pathname: string }) {
  const uiText = getGuideUiText(locale);

  return (
    <div className="space-y-2 border-b border-neutral-800 pb-4">
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">{uiText.language}</p>
      <div className="flex gap-2">
        {guideLocales.map((targetLocale) => (
          <Link key={targetLocale} href={localizeGuidePathname(pathname, targetLocale)}>
            <Button
              variant="ghost"
              className={cn(
                "h-8 px-3 text-xs",
                locale === targetLocale && "bg-neutral-900 text-neutral-100",
              )}
              disabled={locale === targetLocale}
            >
              {getGuideLocaleLabel(targetLocale)}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function GuideSidebarContent() {
  const pathname = usePathname();
  const locale = getGuideLocaleFromPathname(pathname);
  const guidePages = getGuidePages(locale);

  const isCurrentPath = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="mt-4 flex flex-1 flex-col space-y-4 overflow-y-auto pr-2">
      <LanguageSwitch locale={locale} pathname={pathname} />
      {guidePages.map((page, index) => (
        <div key={index} className="space-y-1">
          <Link href={getGuideHref(locale, page.slug)} className="block">
            <Button
              variant="ghost"
              className="opacity-100 w-full justify-start font-semibold text-left"
              disabled={isCurrentPath(getGuideHref(locale, page.slug))}
            >
              {index + 1}.{" "}{page.title}
            </Button>
            {isCurrentPath(getGuideHref(locale, page.slug)) && (
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-neutral-400 to-transparent" />
            )}
          </Link>
          {page.children && page.children.length > 0 && (
            <div className="ml-4 space-y-1">
              {page.children.map((child, childIndex) => {
                const childHref = getGuideHref(locale, page.slug, child.slug);
                return (
                  <Link 
                    key={childIndex} 
                    href={childHref} 
                    className="block"
                  >
                    <Button
                      variant={"ghost"}
                      className={
                        cn("opacity-100 w-full justify-start text-sm text-neutral-400 hover:text-neutral-200 text-left",
                          isCurrentPath(childHref) && "text-neutral")
                        }
                        disabled={isCurrentPath(childHref)}
                    >
                      {index + 1}.{childIndex + 1}.{" "}{child.title}
                    </Button>
                      {isCurrentPath(childHref) && (
                        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-neutral-400 to-transparent" />
                      )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
