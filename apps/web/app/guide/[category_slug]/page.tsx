import { renderGuidePage } from "../guide-page-view";

export default async function GuidePage({ params }: { params: Promise<{ category_slug: string }> }) {
  const { category_slug } = await params;
  return renderGuidePage("en", category_slug);
}
