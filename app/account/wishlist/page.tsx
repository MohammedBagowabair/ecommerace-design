import { redirect } from "next/navigation";

/** Reuse the existing wishlist UI */
export default function AccountWishlistPage() {
  redirect("/wishlist");
}
