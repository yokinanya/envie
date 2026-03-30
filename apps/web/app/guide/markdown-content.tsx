"use client";

import Markdown from "@repo/ui/markdown";
import { Button } from "@repo/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

import type { AdjacentPage } from "./guide-content";

export type MarkdownPage = {
  markdown: string;
  header: string;
};

type MarkdownContentProps = {
  markdownPages: MarkdownPage[];
  nextPage?: AdjacentPage;
  previousPage?: AdjacentPage;
  nextLabel: string;
  previousLabel: string;
};

export default function MarkdownContent({
  markdownPages,
  nextPage,
  previousPage,
  nextLabel,
  previousLabel,
}: MarkdownContentProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const scrollToHash = useCallback(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    if (!hash || hash.length <= 1) return;

    const targetText = decodeURIComponent(hash.slice(1)).trim();
    const headings = containerRef.current?.querySelectorAll("h1, h2, h3, h4");
    if (!headings) return;

    for (const heading of Array.from(headings)) {
      if ((heading.textContent || "").trim() === targetText) {
        heading.scrollIntoView({ behavior: "auto" });
        break;
      }
    }
  }, []);

  useEffect(() => {
    scrollToHash();
  }, [markdownPages, pathname, scrollToHash, searchParams]);

  return (
    <div>
      <div ref={containerRef}>
        <Markdown>{markdownPages.map((page) => `# ${page.header}\n${page.markdown}`).join("\n")}</Markdown>
      </div>

      {(nextPage || previousPage) && (
        <div className="mt-8 border-t border-neutral-700 pt-6">
          <div className="flex justify-between">
            {previousPage ? (
              <Link href={previousPage.href}>
                <Button iconPosition="left" icon={<ChevronLeft className="h-4 w-4" />} variant="ghost">
                  {previousLabel}: {previousPage.title}
                </Button>
              </Link>
            ) : <div className="w-1/2" />}
            {nextPage ? (
              <Link href={nextPage.href}>
                <Button iconPosition="right" icon={<ChevronRight className="h-4 w-4" />} variant="ghost">
                  {nextLabel}: {nextPage.title}
                </Button>
              </Link>
            ) : <div className="w-1/2" />}
          </div>
        </div>
      )}
    </div>
  );
}
