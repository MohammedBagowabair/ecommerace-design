import type { Category } from "../types";

/**
 * Flat category list with optional parentId for subcategories.
 * Example: نقشات اليد → ناعمة / كثيفة / عروس
 */
export const categories: Category[] = [
  {
    id: "cat-hand",
    slug: "naqshat-al-yad",
    name: "نقشات اليد",
    description: "تصاميم أنيقة تغطي ظهر اليد والكف بنقوش تقليدية وعصرية.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
    productCount: 0,
    parentId: null,
  },
  {
    id: "cat-soft",
    slug: "naima",
    name: "ناعمة",
    description: "خطوط ناعمة وزخارف رقيقة بإحساس أنثوي راقٍ.",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80",
    productCount: 0,
    parentId: "cat-hand",
  },
  {
    id: "cat-hand-dense",
    slug: "kathifa",
    name: "كثيفة",
    description: "نقوش غنية وتفاصيل متراكبة لإطلالة فخمة على اليد.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80",
    productCount: 0,
    parentId: "cat-hand",
  },
  {
    id: "cat-bridal",
    slug: "al-arous",
    name: "عروس",
    description: "تصاميم فاخرة مخصّصة لليلة العمر ونقشات اليد للعروس.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
    productCount: 0,
    parentId: "cat-hand",
  },
  {
    id: "cat-fingers",
    slug: "naqshat-al-asabi",
    name: "نقشات الأصابع",
    description: "تفاصيل دقيقة للأصابع تناسب الإطلالات اليومية والرسمية.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
    productCount: 0,
    parentId: null,
  },
  {
    id: "cat-simple",
    slug: "basita",
    name: "بسيطة",
    description: "نقوش خفيفة وسريعة التطبيق للأصابع والمناسبات اليومية.",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80",
    productCount: 0,
    parentId: "cat-fingers",
  },
  {
    id: "cat-large",
    slug: "kabira",
    name: "كبيرة",
    description: "نقوش واسعة للأصابع بمساحة أكبر وتفاصيل غنية.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80",
    productCount: 0,
    parentId: "cat-fingers",
  },
  {
    id: "cat-feet",
    slug: "naqshat-al-arjul",
    name: "نقشات الأرجل",
    description: "استكيرات مريحة وجذابة للقدمين والكاحل.",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
    productCount: 0,
    parentId: null,
  },
  {
    id: "cat-feet-soft",
    slug: "arjul-naima",
    name: "ناعمة للأرجل",
    description: "نقوش خفيفة وأنيقة للكاحل وظهر القدم.",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
    productCount: 0,
    parentId: "cat-feet",
  },
  {
    id: "cat-occasions",
    slug: "al-munasabat",
    name: "المناسبات",
    description: "تصاميم مميزة للأعياد والحفلات والتجمعات العائلية.",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80",
    productCount: 0,
    parentId: null,
  },
  {
    id: "cat-eid",
    slug: "eid",
    name: "عيدية",
    description: "مجموعة خاصة بأعياد الفطر والأضحى بلمسة احتفالية.",
    image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&q=80",
    productCount: 0,
    parentId: "cat-occasions",
  },
  {
    id: "cat-fullset",
    slug: "majmuat-kamila",
    name: "مجموعات كاملة",
    description: "طقم متناسق لليدين والقدمين بأسلوب موحّد.",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80",
    productCount: 0,
    parentId: null,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getParentCategories(list: Category[] = categories): Category[] {
  return list.filter((c) => !c.parentId);
}

export function getChildCategories(
  parentId: string,
  list: Category[] = categories
): Category[] {
  return list.filter((c) => c.parentId === parentId);
}

/** Expand parent category ids to include their children (for product matching). */
export function expandCategoryIds(
  ids: string[],
  list: Category[] = categories
): string[] {
  const set = new Set(ids);
  for (const id of ids) {
    for (const child of list) {
      if (child.parentId === id) set.add(child.id);
    }
  }
  return Array.from(set);
}

export function getCategoryTree(list: Category[] = categories) {
  return getParentCategories(list).map((parent) => ({
    ...parent,
    children: getChildCategories(parent.id, list),
  }));
}
