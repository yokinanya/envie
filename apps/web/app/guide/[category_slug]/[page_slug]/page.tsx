import { renderGuidePage } from "../../guide-page-view";

export default async function GuideChildPage({ params }: { params: Promise<{ category_slug: string; page_slug: string }> }) {
  const { category_slug, page_slug } = await params;
  return renderGuidePage("en", category_slug, page_slug);
}
