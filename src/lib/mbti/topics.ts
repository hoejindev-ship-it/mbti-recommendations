export const TOPICS = [
  { slug: "travel", label: "여행" },
  { slug: "food", label: "맛집" },
  { slug: "shopping", label: "쇼핑" },
] as const;

export type TopicSlug = (typeof TOPICS)[number]["slug"];

export function findTopic(slug: string) {
  return TOPICS.find((t) => t.slug === slug);
}
