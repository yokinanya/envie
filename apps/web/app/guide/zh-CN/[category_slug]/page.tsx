import { renderGuidePage } from "../../guide-page-view";

export default async function ChineseGuidePage({ params }: { params: Promise<{ category_slug: string }> }) {
  const { category_slug } = await params;
  return renderGuidePage("zh-CN", category_slug);
}
