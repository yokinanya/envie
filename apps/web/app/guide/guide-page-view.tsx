import { notFound, redirect } from "next/navigation";

import { getGuideDocument } from "./guide-content";
import MarkdownContent from "./markdown-content";
import { getGuideUiText, type GuideLocale } from "./guide-pages";

export async function renderGuidePage(locale: GuideLocale, categorySlug: string, pageSlug?: string) {
  const document = await getGuideDocument(locale, categorySlug, pageSlug);
  if (!document) {
    return notFound();
  }
  if (document.kind === "redirect") {
    return redirect(document.redirectHref);
  }

  const uiText = getGuideUiText(locale);

  return (
    <MarkdownContent
      markdownPages={[{ markdown: document.markdown, header: document.title }]}
      nextPage={document.nextPage}
      previousPage={document.previousPage}
      nextLabel={uiText.next}
      previousLabel={uiText.previous}
    />
  );
}
