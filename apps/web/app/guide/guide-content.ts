import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { getGuideHref, getGuidePages, type GuideLocale } from "./guide-pages";

function resolveDocsRoot() {
  const cwd = process.cwd();
  const appDirDocsRoot = path.join(cwd, "..", "..", "docs");

  // `next start` may run from `apps/web`, while Docker and monorepo-level
  // commands run from the repository root. Support both execution modes.
  return path.basename(cwd) === "web" && path.basename(path.dirname(cwd)) === "apps"
    ? appDirDocsRoot
    : path.join(cwd, "docs");
}

const DOCS_ROOT = resolveDocsRoot();

export type AdjacentPage = {
  title: string;
  href: string;
};

export type GuideDocument = {
  kind: "document";
  title: string;
  markdown: string;
  nextPage?: AdjacentPage;
  previousPage?: AdjacentPage;
};

export type GuideRedirect = {
  kind: "redirect";
  redirectHref: string;
};

function flattenGuidePages(locale: GuideLocale): AdjacentPage[] {
  return getGuidePages(locale).flatMap((page) => {
    if (!page.children?.length) {
      return [{ title: page.title, href: getGuideHref(locale, page.slug) }];
    }

    return page.children.map((child) => ({
      title: child.title,
      href: getGuideHref(locale, page.slug, child.slug),
    }));
  });
}

function getAdjacentPages(locale: GuideLocale, currentHref: string) {
  const pages = flattenGuidePages(locale);
  const index = pages.findIndex((page) => page.href === currentHref);
  if (index === -1) {
    return {};
  }

  return {
    previousPage: pages[index - 1],
    nextPage: pages[index + 1],
  };
}

function getDocsFilePath(locale: GuideLocale, segments: string[]): string {
  const localeSegments = locale === "en" ? [] : [locale];
  return path.join(DOCS_ROOT, ...localeSegments, ...segments) + ".md";
}

function isMissingFile(error: unknown): error is NodeJS.ErrnoException {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}

async function readGuideMarkdown(locale: GuideLocale, segments: string[]) {
  try {
    return await readFile(getDocsFilePath(locale, segments), "utf8");
  } catch (error) {
    if (isMissingFile(error)) {
      return null;
    }
    throw error;
  }
}

export async function getGuideDocument(
  locale: GuideLocale,
  categorySlug: string,
  pageSlug?: string,
): Promise<GuideDocument | GuideRedirect | null> {
  const category = getGuidePages(locale).find((page) => page.slug === categorySlug);
  if (!category) {
    return null;
  }

  if (!pageSlug) {
    if (category.children?.length) {
      const firstChild = category.children[0];
      return firstChild
        ? { kind: "redirect", redirectHref: getGuideHref(locale, category.slug, firstChild.slug) }
        : null;
    }

    const href = getGuideHref(locale, category.slug);
    const markdown = await readGuideMarkdown(locale, [category.slug]);
    return markdown
      ? { kind: "document", title: category.title, markdown, ...getAdjacentPages(locale, href) }
      : null;
  }

  const child = category.children?.find((item) => item.slug === pageSlug);
  if (!child) {
    return null;
  }

  const href = getGuideHref(locale, category.slug, child.slug);
  const markdown = await readGuideMarkdown(locale, [category.slug, child.slug]);
  return markdown
    ? { kind: "document", title: child.title, markdown, ...getAdjacentPages(locale, href) }
    : null;
}
