import type { Product } from "../types";
import { categories } from "./categories";

export const products: Product[] = [
  {
    "id": "prod-001",
    "slug": "naqsha-01",
    "name": "نقشة الياسمين الذهبي",
    "shortName": "نقشة الياسمين",
    "description": "استكير نقشة حناء فاخرة بعنوان «نقشة الياسمين الذهبي». تصميم ناعمة مناسب لمناسبة يومي، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 4500,
    "compareAtPrice": 5500,
    "categoryIds": [
      "cat-hand",
      "cat-soft"
    ],
    "images": [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80"
    ],
    "badges": [
      "featured",
      "discount"
    ],
    "rating": 3.8,
    "reviewCount": 4,
    "stock": 24,
    "stockStatus": "in_stock",
    "sku": "NQ-1000",
    "tags": [
      "ناعمة",
      "يومي",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": true,
    "isNew": false,
    "isFeatured": true,
    "isBestseller": false,
    "occasion": "يومي",
    "patternType": "ناعمة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-002",
    "slug": "naqsha-02",
    "name": "تاج العروس الملكي",
    "shortName": "تاج العروس",
    "description": "استكير نقشة حناء فاخرة بعنوان «تاج العروس الملكي». تصميم كبيرة مناسب لمناسبة زفاف، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 12500,
    "compareAtPrice": 15000,
    "categoryIds": [
      "cat-bridal",
      "cat-hand"
    ],
    "images": [
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80"
    ],
    "badges": [
      "bestseller",
      "featured"
    ],
    "rating": 3.9,
    "reviewCount": 7,
    "stock": 8,
    "stockStatus": "in_stock",
    "sku": "NQ-1001",
    "tags": [
      "كبيرة",
      "زفاف",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": false,
    "isNew": false,
    "isFeatured": true,
    "isBestseller": true,
    "occasion": "زفاف",
    "patternType": "كبيرة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-003",
    "slug": "naqsha-03",
    "name": "زخرفة الأصابع الحريرية",
    "shortName": "زخرفة الأصابع",
    "description": "استكير نقشة حناء فاخرة بعنوان «زخرفة الأصابع الحريرية». تصميم ناعمة مناسب لمناسبة يومي، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 2800,
    "categoryIds": [
      "cat-fingers",
      "cat-soft"
    ],
    "images": [
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
      "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&q=80"
    ],
    "badges": [
      "new"
    ],
    "rating": 4,
    "reviewCount": 10,
    "stock": 40,
    "stockStatus": "in_stock",
    "sku": "NQ-1002",
    "tags": [
      "ناعمة",
      "يومي",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": false,
    "isNew": true,
    "isFeatured": false,
    "isBestseller": false,
    "occasion": "يومي",
    "patternType": "ناعمة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-004",
    "slug": "naqsha-04",
    "name": "سوار الكاحل المرصّع",
    "shortName": "سوار الكاحل",
    "description": "استكير نقشة حناء فاخرة بعنوان «سوار الكاحل المرصّع». تصميم متوسطة مناسب لمناسبة مناسبة، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 5200,
    "compareAtPrice": 6500,
    "categoryIds": [
      "cat-feet",
      "cat-occasions"
    ],
    "images": [
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80"
    ],
    "badges": [
      "discount"
    ],
    "rating": 4.1,
    "reviewCount": 13,
    "stock": 15,
    "stockStatus": "in_stock",
    "sku": "NQ-1003",
    "tags": [
      "متوسطة",
      "مناسبة",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": true,
    "isNew": false,
    "isFeatured": false,
    "isBestseller": false,
    "occasion": "مناسبة",
    "patternType": "متوسطة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-005",
    "slug": "naqsha-05",
    "name": "ورقة النخيل البسيطة",
    "shortName": "ورقة النخيل",
    "description": "استكير نقشة حناء فاخرة بعنوان «ورقة النخيل البسيطة». تصميم بسيطة مناسب لمناسبة يومي، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 2200,
    "categoryIds": [
      "cat-simple",
      "cat-hand"
    ],
    "images": [
      "https://images.unsplash.com/photo-1526045478516-99145907023c?w=800&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80"
    ],
    "badges": [],
    "rating": 4.2,
    "reviewCount": 16,
    "stock": 55,
    "stockStatus": "in_stock",
    "sku": "NQ-1004",
    "tags": [
      "بسيطة",
      "يومي",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": false,
    "isNew": false,
    "isFeatured": false,
    "isBestseller": false,
    "occasion": "يومي",
    "patternType": "بسيطة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-006",
    "slug": "naqsha-06",
    "name": "مجموعة ليلة الحنّاء",
    "shortName": "مجموعة ليلة",
    "description": "استكير نقشة حناء فاخرة بعنوان «مجموعة ليلة الحنّاء». تصميم كبيرة مناسب لمناسبة زفاف، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 18900,
    "compareAtPrice": 22000,
    "categoryIds": [
      "cat-bridal",
      "cat-fullset"
    ],
    "images": [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80"
    ],
    "badges": [
      "bestseller",
      "discount",
      "featured"
    ],
    "rating": 4.3,
    "reviewCount": 19,
    "stock": 5,
    "stockStatus": "low_stock",
    "sku": "NQ-1005",
    "tags": [
      "كبيرة",
      "زفاف",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": true,
    "isNew": false,
    "isFeatured": true,
    "isBestseller": true,
    "occasion": "زفاف",
    "patternType": "كبيرة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-007",
    "slug": "naqsha-07",
    "name": "نقشة القمر الفضي",
    "shortName": "نقشة القمر",
    "description": "استكير نقشة حناء فاخرة بعنوان «نقشة القمر الفضي». تصميم متوسطة مناسب لمناسبة مناسبة، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 6100,
    "categoryIds": [
      "cat-hand",
      "cat-occasions"
    ],
    "images": [
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80"
    ],
    "badges": [
      "featured"
    ],
    "rating": 4.4,
    "reviewCount": 22,
    "stock": 18,
    "stockStatus": "in_stock",
    "sku": "NQ-1006",
    "tags": [
      "متوسطة",
      "مناسبة",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": false,
    "isNew": false,
    "isFeatured": true,
    "isBestseller": false,
    "occasion": "مناسبة",
    "patternType": "متوسطة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-008",
    "slug": "naqsha-08",
    "name": "خطوط المساء الناعمة",
    "shortName": "خطوط المساء",
    "description": "استكير نقشة حناء فاخرة بعنوان «خطوط المساء الناعمة». تصميم ناعمة مناسب لمناسبة يومي، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 3100,
    "categoryIds": [
      "cat-soft",
      "cat-fingers"
    ],
    "images": [
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
      "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&q=80"
    ],
    "badges": [
      "new"
    ],
    "rating": 4.5,
    "reviewCount": 25,
    "stock": 32,
    "stockStatus": "in_stock",
    "sku": "NQ-1007",
    "tags": [
      "ناعمة",
      "يومي",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": false,
    "isNew": true,
    "isFeatured": false,
    "isBestseller": false,
    "occasion": "يومي",
    "patternType": "ناعمة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-009",
    "slug": "naqsha-09",
    "name": "طوق القدم الزهري",
    "shortName": "طوق القدم",
    "description": "استكير نقشة حناء فاخرة بعنوان «طوق القدم الزهري». تصميم ناعمة مناسب لمناسبة مناسبة، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 4800,
    "compareAtPrice": 5600,
    "categoryIds": [
      "cat-feet",
      "cat-soft"
    ],
    "images": [
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80"
    ],
    "badges": [
      "discount"
    ],
    "rating": 4.6,
    "reviewCount": 28,
    "stock": 12,
    "stockStatus": "in_stock",
    "sku": "NQ-1008",
    "tags": [
      "ناعمة",
      "مناسبة",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": true,
    "isNew": false,
    "isFeatured": false,
    "isBestseller": false,
    "occasion": "مناسبة",
    "patternType": "ناعمة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-010",
    "slug": "naqsha-10",
    "name": "نقشة العيد المضيئة",
    "shortName": "نقشة العيد",
    "description": "استكير نقشة حناء فاخرة بعنوان «نقشة العيد المضيئة». تصميم متوسطة مناسب لمناسبة عيد، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 5500,
    "categoryIds": [
      "cat-eid",
      "cat-hand"
    ],
    "images": [
      "https://images.unsplash.com/photo-1526045478516-99145907023c?w=800&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80"
    ],
    "badges": [
      "new",
      "featured"
    ],
    "rating": 4.7,
    "reviewCount": 31,
    "stock": 20,
    "stockStatus": "in_stock",
    "sku": "NQ-1009",
    "tags": [
      "متوسطة",
      "عيد",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": false,
    "isNew": true,
    "isFeatured": true,
    "isBestseller": false,
    "occasion": "عيد",
    "patternType": "متوسطة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-011",
    "slug": "naqsha-11",
    "name": "دانتيل الأصابع الكلاسيكي",
    "shortName": "دانتيل الأصابع",
    "description": "استكير نقشة حناء فاخرة بعنوان «دانتيل الأصابع الكلاسيكي». تصميم دقيقة مناسب لمناسبة زفاف، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 7200,
    "categoryIds": [
      "cat-fingers",
      "cat-bridal"
    ],
    "images": [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80"
    ],
    "badges": [
      "bestseller"
    ],
    "rating": 4.8,
    "reviewCount": 34,
    "stock": 9,
    "stockStatus": "in_stock",
    "sku": "NQ-1010",
    "tags": [
      "دقيقة",
      "زفاف",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": false,
    "isNew": false,
    "isFeatured": false,
    "isBestseller": true,
    "occasion": "زفاف",
    "patternType": "دقيقة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-012",
    "slug": "naqsha-12",
    "name": "زهرة الصحراء الكبيرة",
    "shortName": "زهرة الصحراء",
    "description": "استكير نقشة حناء فاخرة بعنوان «زهرة الصحراء الكبيرة». تصميم كبيرة مناسب لمناسبة مناسبة، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 8900,
    "compareAtPrice": 10500,
    "categoryIds": [
      "cat-large",
      "cat-hand"
    ],
    "images": [
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80"
    ],
    "badges": [
      "discount",
      "featured"
    ],
    "rating": 4.9,
    "reviewCount": 37,
    "stock": 7,
    "stockStatus": "in_stock",
    "sku": "NQ-1011",
    "tags": [
      "كبيرة",
      "مناسبة",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": true,
    "isNew": false,
    "isFeatured": true,
    "isBestseller": false,
    "occasion": "مناسبة",
    "patternType": "كبيرة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-013",
    "slug": "naqsha-13",
    "name": "لمسة الصباح الخفيفة",
    "shortName": "لمسة الصباح",
    "description": "استكير نقشة حناء فاخرة بعنوان «لمسة الصباح الخفيفة». تصميم بسيطة مناسب لمناسبة يومي، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 1900,
    "categoryIds": [
      "cat-simple",
      "cat-soft"
    ],
    "images": [
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
      "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&q=80"
    ],
    "badges": [],
    "rating": 3.8,
    "reviewCount": 40,
    "stock": 60,
    "stockStatus": "in_stock",
    "sku": "NQ-1012",
    "tags": [
      "بسيطة",
      "يومي",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": false,
    "isNew": false,
    "isFeatured": false,
    "isBestseller": false,
    "occasion": "يومي",
    "patternType": "بسيطة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-014",
    "slug": "naqsha-14",
    "name": "طقم العروس المتكامل",
    "shortName": "طقم العروس",
    "description": "استكير نقشة حناء فاخرة بعنوان «طقم العروس المتكامل». تصميم كبيرة مناسب لمناسبة زفاف، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 24500,
    "compareAtPrice": 28000,
    "categoryIds": [
      "cat-bridal",
      "cat-fullset",
      "cat-large"
    ],
    "images": [
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80"
    ],
    "badges": [
      "bestseller",
      "limited",
      "featured"
    ],
    "rating": 3.9,
    "reviewCount": 43,
    "stock": 3,
    "stockStatus": "low_stock",
    "sku": "NQ-1013",
    "tags": [
      "كبيرة",
      "زفاف",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": false,
    "isNew": false,
    "isFeatured": true,
    "isBestseller": true,
    "occasion": "زفاف",
    "patternType": "كبيرة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-015",
    "slug": "naqsha-15",
    "name": "نقشة المناسبات الوردية",
    "shortName": "نقشة المناسبات",
    "description": "استكير نقشة حناء فاخرة بعنوان «نقشة المناسبات الوردية». تصميم متوسطة مناسب لمناسبة مناسبة، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 6700,
    "categoryIds": [
      "cat-occasions",
      "cat-hand"
    ],
    "images": [
      "https://images.unsplash.com/photo-1526045478516-99145907023c?w=800&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80"
    ],
    "badges": [
      "featured"
    ],
    "rating": 4,
    "reviewCount": 6,
    "stock": 14,
    "stockStatus": "in_stock",
    "sku": "NQ-1014",
    "tags": [
      "متوسطة",
      "مناسبة",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": false,
    "isNew": false,
    "isFeatured": true,
    "isBestseller": false,
    "occasion": "مناسبة",
    "patternType": "متوسطة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-016",
    "slug": "naqsha-16",
    "name": "خيوط الذهب على الأصابع",
    "shortName": "خيوط الذهب",
    "description": "استكير نقشة حناء فاخرة بعنوان «خيوط الذهب على الأصابع». تصميم دقيقة مناسب لمناسبة مناسبة، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 3900,
    "compareAtPrice": 4500,
    "categoryIds": [
      "cat-fingers",
      "cat-occasions"
    ],
    "images": [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80"
    ],
    "badges": [
      "discount"
    ],
    "rating": 4.1,
    "reviewCount": 9,
    "stock": 22,
    "stockStatus": "in_stock",
    "sku": "NQ-1015",
    "tags": [
      "دقيقة",
      "مناسبة",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": true,
    "isNew": false,
    "isFeatured": false,
    "isBestseller": false,
    "occasion": "مناسبة",
    "patternType": "دقيقة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-017",
    "slug": "naqsha-17",
    "name": "قوس القدم الأميري",
    "shortName": "قوس القدم",
    "description": "استكير نقشة حناء فاخرة بعنوان «قوس القدم الأميري». تصميم كبيرة مناسب لمناسبة زفاف، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 9800,
    "categoryIds": [
      "cat-feet",
      "cat-bridal"
    ],
    "images": [
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80"
    ],
    "badges": [
      "new"
    ],
    "rating": 4.2,
    "reviewCount": 12,
    "stock": 6,
    "stockStatus": "in_stock",
    "sku": "NQ-1016",
    "tags": [
      "كبيرة",
      "زفاف",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": false,
    "isNew": true,
    "isFeatured": false,
    "isBestseller": false,
    "occasion": "زفاف",
    "patternType": "كبيرة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-018",
    "slug": "naqsha-18",
    "name": "نقشة الجمعة الأنيقة",
    "shortName": "نقشة الجمعة",
    "description": "استكير نقشة حناء فاخرة بعنوان «نقشة الجمعة الأنيقة». تصميم بسيطة مناسب لمناسبة يومي، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 2600,
    "categoryIds": [
      "cat-simple",
      "cat-hand"
    ],
    "images": [
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
      "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&q=80"
    ],
    "badges": [],
    "rating": 4.3,
    "reviewCount": 15,
    "stock": 45,
    "stockStatus": "in_stock",
    "sku": "NQ-1017",
    "tags": [
      "بسيطة",
      "يومي",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": false,
    "isNew": false,
    "isFeatured": false,
    "isBestseller": false,
    "occasion": "يومي",
    "patternType": "بسيطة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-019",
    "slug": "naqsha-19",
    "name": "حديقة الورد الناعمة",
    "shortName": "حديقة الورد",
    "description": "استكير نقشة حناء فاخرة بعنوان «حديقة الورد الناعمة». تصميم ناعمة مناسب لمناسبة يومي، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 5400,
    "categoryIds": [
      "cat-soft",
      "cat-hand"
    ],
    "images": [
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80"
    ],
    "badges": [
      "bestseller"
    ],
    "rating": 4.4,
    "reviewCount": 18,
    "stock": 19,
    "stockStatus": "in_stock",
    "sku": "NQ-1018",
    "tags": [
      "ناعمة",
      "يومي",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": false,
    "isNew": false,
    "isFeatured": false,
    "isBestseller": true,
    "occasion": "يومي",
    "patternType": "ناعمة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-020",
    "slug": "naqsha-20",
    "name": "مجموعة العيد الفاخرة",
    "shortName": "مجموعة العيد",
    "description": "استكير نقشة حناء فاخرة بعنوان «مجموعة العيد الفاخرة». تصميم كبيرة مناسب لمناسبة عيد، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 14200,
    "compareAtPrice": 16800,
    "categoryIds": [
      "cat-eid",
      "cat-fullset"
    ],
    "images": [
      "https://images.unsplash.com/photo-1526045478516-99145907023c?w=800&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80"
    ],
    "badges": [
      "discount",
      "featured"
    ],
    "rating": 4.5,
    "reviewCount": 21,
    "stock": 4,
    "stockStatus": "low_stock",
    "sku": "NQ-1019",
    "tags": [
      "كبيرة",
      "عيد",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": true,
    "isNew": false,
    "isFeatured": true,
    "isBestseller": false,
    "occasion": "عيد",
    "patternType": "كبيرة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-021",
    "slug": "naqsha-21",
    "name": "نقشة الكف التقليدية",
    "shortName": "نقشة الكف",
    "description": "استكير نقشة حناء فاخرة بعنوان «نقشة الكف التقليدية». تصميم كبيرة مناسب لمناسبة مناسبة، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 7600,
    "categoryIds": [
      "cat-hand",
      "cat-large"
    ],
    "images": [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80"
    ],
    "badges": [],
    "rating": 4.6,
    "reviewCount": 24,
    "stock": 11,
    "stockStatus": "in_stock",
    "sku": "NQ-1020",
    "tags": [
      "كبيرة",
      "مناسبة",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": false,
    "isNew": false,
    "isFeatured": false,
    "isBestseller": false,
    "occasion": "مناسبة",
    "patternType": "كبيرة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-022",
    "slug": "naqsha-22",
    "name": "نقاط الضوء الدقيقة",
    "shortName": "نقاط الضوء",
    "description": "استكير نقشة حناء فاخرة بعنوان «نقاط الضوء الدقيقة». تصميم بسيطة مناسب لمناسبة يومي، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 2100,
    "categoryIds": [
      "cat-fingers",
      "cat-simple"
    ],
    "images": [
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80"
    ],
    "badges": [
      "new"
    ],
    "rating": 4.7,
    "reviewCount": 27,
    "stock": 38,
    "stockStatus": "in_stock",
    "sku": "NQ-1021",
    "tags": [
      "بسيطة",
      "يومي",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": false,
    "isNew": true,
    "isFeatured": false,
    "isBestseller": false,
    "occasion": "يومي",
    "patternType": "بسيطة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-023",
    "slug": "naqsha-23",
    "name": "سوار الحنّاء الملكي",
    "shortName": "سوار الحنّاء",
    "description": "استكير نقشة حناء فاخرة بعنوان «سوار الحنّاء الملكي». تصميم كبيرة مناسب لمناسبة مناسبة، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 8300,
    "compareAtPrice": 9500,
    "categoryIds": [
      "cat-feet",
      "cat-large"
    ],
    "images": [
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
      "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&q=80"
    ],
    "badges": [
      "discount"
    ],
    "rating": 4.8,
    "reviewCount": 30,
    "stock": 10,
    "stockStatus": "in_stock",
    "sku": "NQ-1022",
    "tags": [
      "كبيرة",
      "مناسبة",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": true,
    "isNew": false,
    "isFeatured": false,
    "isBestseller": false,
    "occasion": "مناسبة",
    "patternType": "كبيرة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-024",
    "slug": "naqsha-24",
    "name": "نقشة الخطوبة الرقيقة",
    "shortName": "نقشة الخطوبة",
    "description": "استكير نقشة حناء فاخرة بعنوان «نقشة الخطوبة الرقيقة». تصميم ناعمة مناسب لمناسبة خطوبة، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 11200,
    "categoryIds": [
      "cat-bridal",
      "cat-soft"
    ],
    "images": [
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80"
    ],
    "badges": [
      "featured",
      "new"
    ],
    "rating": 4.9,
    "reviewCount": 33,
    "stock": 8,
    "stockStatus": "in_stock",
    "sku": "NQ-1023",
    "tags": [
      "ناعمة",
      "خطوبة",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": false,
    "isNew": true,
    "isFeatured": true,
    "isBestseller": false,
    "occasion": "خطوبة",
    "patternType": "ناعمة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-025",
    "slug": "naqsha-25",
    "name": "زخرفة المناسبات الذهبية",
    "shortName": "زخرفة المناسبات",
    "description": "استكير نقشة حناء فاخرة بعنوان «زخرفة المناسبات الذهبية». تصميم متوسطة مناسب لمناسبة مناسبة، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 4700,
    "categoryIds": [
      "cat-occasions",
      "cat-fingers"
    ],
    "images": [
      "https://images.unsplash.com/photo-1526045478516-99145907023c?w=800&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80"
    ],
    "badges": [],
    "rating": 3.8,
    "reviewCount": 36,
    "stock": 25,
    "stockStatus": "in_stock",
    "sku": "NQ-1024",
    "tags": [
      "متوسطة",
      "مناسبة",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": false,
    "isNew": false,
    "isFeatured": false,
    "isBestseller": false,
    "occasion": "مناسبة",
    "patternType": "متوسطة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-026",
    "slug": "naqsha-26",
    "name": "طقم الأمسية الكامل",
    "shortName": "طقم الأمسية",
    "description": "استكير نقشة حناء فاخرة بعنوان «طقم الأمسية الكامل». تصميم كبيرة مناسب لمناسبة مناسبة، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 15800,
    "compareAtPrice": 18500,
    "categoryIds": [
      "cat-fullset",
      "cat-occasions"
    ],
    "images": [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80"
    ],
    "badges": [
      "bestseller",
      "discount"
    ],
    "rating": 3.9,
    "reviewCount": 39,
    "stock": 5,
    "stockStatus": "low_stock",
    "sku": "NQ-1025",
    "tags": [
      "كبيرة",
      "مناسبة",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": true,
    "isNew": false,
    "isFeatured": false,
    "isBestseller": true,
    "occasion": "مناسبة",
    "patternType": "كبيرة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-027",
    "slug": "naqsha-27",
    "name": "وردة الربيع البسيطة",
    "shortName": "وردة الربيع",
    "description": "استكير نقشة حناء فاخرة بعنوان «وردة الربيع البسيطة». تصميم بسيطة مناسب لمناسبة يومي، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 2400,
    "categoryIds": [
      "cat-simple",
      "cat-soft"
    ],
    "images": [
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80"
    ],
    "badges": [],
    "rating": 4,
    "reviewCount": 42,
    "stock": 50,
    "stockStatus": "in_stock",
    "sku": "NQ-1026",
    "tags": [
      "بسيطة",
      "يومي",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": false,
    "isNew": false,
    "isFeatured": false,
    "isBestseller": false,
    "occasion": "يومي",
    "patternType": "بسيطة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-028",
    "slug": "naqsha-28",
    "name": "نقشة العروس البيضاء",
    "shortName": "نقشة العروس",
    "description": "استكير نقشة حناء فاخرة بعنوان «نقشة العروس البيضاء». تصميم كبيرة مناسب لمناسبة زفاف، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 13500,
    "categoryIds": [
      "cat-bridal",
      "cat-hand"
    ],
    "images": [
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
      "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&q=80"
    ],
    "badges": [
      "limited",
      "featured"
    ],
    "rating": 4.1,
    "reviewCount": 5,
    "stock": 2,
    "stockStatus": "low_stock",
    "sku": "NQ-1027",
    "tags": [
      "كبيرة",
      "زفاف",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": false,
    "isNew": false,
    "isFeatured": true,
    "isBestseller": false,
    "occasion": "زفاف",
    "patternType": "كبيرة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-029",
    "slug": "naqsha-29",
    "name": "ضفائر الأصابع العصرية",
    "shortName": "ضفائر الأصابع",
    "description": "استكير نقشة حناء فاخرة بعنوان «ضفائر الأصابع العصرية». تصميم ناعمة مناسب لمناسبة يومي، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 3500,
    "compareAtPrice": 4200,
    "categoryIds": [
      "cat-fingers",
      "cat-soft"
    ],
    "images": [
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80"
    ],
    "badges": [
      "discount",
      "new"
    ],
    "rating": 4.2,
    "reviewCount": 8,
    "stock": 28,
    "stockStatus": "in_stock",
    "sku": "NQ-1028",
    "tags": [
      "ناعمة",
      "يومي",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": true,
    "isNew": true,
    "isFeatured": false,
    "isBestseller": false,
    "occasion": "يومي",
    "patternType": "ناعمة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-030",
    "slug": "naqsha-30",
    "name": "نقشة الأرجل الوردية",
    "shortName": "نقشة الأرجل",
    "description": "استكير نقشة حناء فاخرة بعنوان «نقشة الأرجل الوردية». تصميم متوسطة مناسب لمناسبة مناسبة، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 5900,
    "categoryIds": [
      "cat-feet",
      "cat-occasions"
    ],
    "images": [
      "https://images.unsplash.com/photo-1526045478516-99145907023c?w=800&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80"
    ],
    "badges": [
      "bestseller"
    ],
    "rating": 4.3,
    "reviewCount": 11,
    "stock": 13,
    "stockStatus": "in_stock",
    "sku": "NQ-1029",
    "tags": [
      "متوسطة",
      "مناسبة",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": false,
    "isNew": false,
    "isFeatured": false,
    "isBestseller": true,
    "occasion": "مناسبة",
    "patternType": "متوسطة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-031",
    "slug": "naqsha-31",
    "name": "مجموعة الحفلات اللامعة",
    "shortName": "مجموعة الحفلات",
    "description": "استكير نقشة حناء فاخرة بعنوان «مجموعة الحفلات اللامعة». تصميم متوسطة مناسب لمناسبة حفلة، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 12100,
    "categoryIds": [
      "cat-occasions",
      "cat-fullset"
    ],
    "images": [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80"
    ],
    "badges": [
      "featured"
    ],
    "rating": 4.4,
    "reviewCount": 14,
    "stock": 9,
    "stockStatus": "in_stock",
    "sku": "NQ-1030",
    "tags": [
      "متوسطة",
      "حفلة",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": false,
    "isNew": false,
    "isFeatured": true,
    "isBestseller": false,
    "occasion": "حفلة",
    "patternType": "متوسطة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-032",
    "slug": "naqsha-32",
    "name": "نقشة كبيرة للظهر",
    "shortName": "نقشة كبيرة",
    "description": "استكير نقشة حناء فاخرة بعنوان «نقشة كبيرة للظهر». تصميم كبيرة مناسب لمناسبة مناسبة، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 9200,
    "compareAtPrice": 11000,
    "categoryIds": [
      "cat-large",
      "cat-hand"
    ],
    "images": [
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80"
    ],
    "badges": [
      "discount"
    ],
    "rating": 4.5,
    "reviewCount": 17,
    "stock": 0,
    "stockStatus": "out_of_stock",
    "sku": "NQ-1031",
    "tags": [
      "كبيرة",
      "مناسبة",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": true,
    "isNew": false,
    "isFeatured": false,
    "isBestseller": false,
    "occasion": "مناسبة",
    "patternType": "كبيرة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-033",
    "slug": "naqsha-33",
    "name": "لمسة العيد الناعمة",
    "shortName": "لمسة العيد",
    "description": "استكير نقشة حناء فاخرة بعنوان «لمسة العيد الناعمة». تصميم ناعمة مناسب لمناسبة عيد، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 4300,
    "categoryIds": [
      "cat-eid",
      "cat-soft"
    ],
    "images": [
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
      "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&q=80"
    ],
    "badges": [
      "new"
    ],
    "rating": 4.6,
    "reviewCount": 20,
    "stock": 16,
    "stockStatus": "in_stock",
    "sku": "NQ-1032",
    "tags": [
      "ناعمة",
      "عيد",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": false,
    "isNew": true,
    "isFeatured": false,
    "isBestseller": false,
    "occasion": "عيد",
    "patternType": "ناعمة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-034",
    "slug": "naqsha-34",
    "name": "طقم الزفاف الذهبي",
    "shortName": "طقم الزفاف",
    "description": "استكير نقشة حناء فاخرة بعنوان «طقم الزفاف الذهبي». تصميم كبيرة مناسب لمناسبة زفاف، سهل التطبيق ويدوم لساعات مع لمسة أنثوية عصرية. مصنوع بأحبار آمنة على البشرة ومقاوم للماء بدرجة خفيفة.",
    "price": 26800,
    "compareAtPrice": 31000,
    "categoryIds": [
      "cat-bridal",
      "cat-fullset",
      "cat-feet"
    ],
    "images": [
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80"
    ],
    "badges": [
      "bestseller",
      "limited",
      "featured"
    ],
    "rating": 4.7,
    "reviewCount": 23,
    "stock": 1,
    "stockStatus": "low_stock",
    "sku": "NQ-1033",
    "tags": [
      "كبيرة",
      "زفاف",
      "حناء",
      "استكير",
      "نقشة"
    ],
    "isOffer": false,
    "isNew": false,
    "isFeatured": true,
    "isBestseller": true,
    "occasion": "زفاف",
    "patternType": "كبيرة",
    "info": {
      "نوع المنتج": "استكير نقشة حناء",
      "مدة الثبات": "١٢–٢٤ ساعة",
      "طريقة الاستخدام": "نظّفي البشرة ثم الصقي الاستكير واضغطي بلطف",
      "المادة": "فيلم ناعم بحبر آمن",
      "بلد التصميم": "اليمن"
    }
  },
  {
    "id": "prod-035",
    "slug": "naqsha-35",
    "name": "طقم فرش مكياج مصغّر",
    "shortName": "طقم فرش",
    "description": "منتج تجريبي لإظهار قابلية توسيع المتجر لغير استكيرات الحناء.",
    "price": 8500,
    "categoryIds": [
      "cat-simple"
    ],
    "images": [
      "https://images.unsplash.com/photo-1526045478516-99145907023c?w=800&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80"
    ],
    "badges": [
      "new"
    ],
    "rating": 4.8,
    "reviewCount": 26,
    "stock": 20,
    "stockStatus": "in_stock",
    "sku": "NQ-1034",
    "tags": [
      "ملحقات",
      "يومي",
      "حناء",
      "استكير",
      "ملحقات"
    ],
    "isOffer": false,
    "isNew": true,
    "isFeatured": false,
    "isBestseller": false,
    "occasion": "يومي",
    "patternType": "ملحقات",
    "info": {
      "نوع المنتج": "ملحق",
      "مدة الثبات": "—",
      "طريقة الاستخدام": "حسب التعليمات",
      "المادة": "مواد مختلطة",
      "بلد التصميم": "اليمن"
    },
    "isStub": true
  },
  {
    "id": "prod-036",
    "slug": "naqsha-36",
    "name": "حقيبة هدايا أنيقة",
    "shortName": "حقيبة هدايا",
    "description": "تغليف فاخر للهدايا — منتج تجريبي للتوسّع.",
    "price": 3200,
    "categoryIds": [
      "cat-occasions"
    ],
    "images": [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80"
    ],
    "badges": [],
    "rating": 4.9,
    "reviewCount": 29,
    "stock": 30,
    "stockStatus": "in_stock",
    "sku": "NQ-1035",
    "tags": [
      "ملحقات",
      "هدية",
      "حناء",
      "استكير",
      "ملحقات"
    ],
    "isOffer": false,
    "isNew": false,
    "isFeatured": false,
    "isBestseller": false,
    "occasion": "هدية",
    "patternType": "ملحقات",
    "info": {
      "نوع المنتج": "ملحق",
      "مدة الثبات": "—",
      "طريقة الاستخدام": "حسب التعليمات",
      "المادة": "مواد مختلطة",
      "بلد التصميم": "اليمن"
    },
    "isStub": true
  }
];

// Sync category counts
categories.forEach((c) => {
  c.productCount = products.filter((p) => p.categoryIds.includes(c.id) && !p.isStub).length;
});

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.categoryIds.includes(categoryId));
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured && !p.isStub);
}

export function getNewProducts(): Product[] {
  return products.filter((p) => p.isNew && !p.isStub);
}

export function getBestsellerProducts(): Product[] {
  return products.filter((p) => p.isBestseller && !p.isStub);
}

export function getOfferProducts(): Product[] {
  return products.filter((p) => p.isOffer && !p.isStub);
}

export function getOccasionProducts(): Product[] {
  return products.filter(
    (p) => !p.isStub && (p.occasion === "زفاف" || p.occasion === "مناسبة" || p.occasion === "عيد" || p.occasion === "حفلة" || p.occasion === "خطوبة")
  );
}

export function getSimilarProducts(product: Product, limit = 4): Product[] {
  return products
    .filter(
      (p) =>
        p.id !== product.id &&
        !p.isStub &&
        p.categoryIds.some((c) => product.categoryIds.includes(c))
    )
    .slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter(
      (p) =>
        p.id !== product.id &&
        !p.isStub &&
        (p.patternType === product.patternType || p.occasion === product.occasion)
    )
    .slice(0, limit);
}

export const patternTypes = Array.from(
  new Set(products.filter((p) => !p.isStub).map((p) => p.patternType!).filter(Boolean))
);

export const priceRange = {
  min: Math.min(...products.map((p) => p.price)),
  max: Math.max(...products.map((p) => p.price)),
};

export const occasions = Array.from(
  new Set(products.filter((p) => !p.isStub).map((p) => p.occasion!).filter(Boolean))
).sort();
