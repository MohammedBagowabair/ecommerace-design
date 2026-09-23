import Link from "next/link";
import { Tag } from "lucide-react";

export default function OfferNotFound() {
  return (
    <div className="container-pad flex flex-col items-center py-16 text-center sm:py-24">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-henna-50 text-henna shadow-card">
        <Tag className="h-6 w-6" strokeWidth={1.5} />
      </span>
      <h1 className="mt-6 text-2xl font-bold text-ink sm:text-3xl">هذا العرض غير متاح</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
        لم نعثر على الحملة التي تبحثين عنها. قد يكون الرابط غير صحيح، أو أن العرض لم يعد
        موجودًا. يمكنكِ العودة إلى صفحة العروض وتصفّح الحملات المتاحة.
      </p>
      <Link href="/offers" className="btn-primary mt-8">
        <Tag className="h-4 w-4" />
        العودة إلى العروض
      </Link>
    </div>
  );
}
