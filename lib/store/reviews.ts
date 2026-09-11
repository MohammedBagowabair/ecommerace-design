"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserReview } from "../types";

export type AddUserReviewInput = {
  productId: string;
  orderId: string;
  productName: string;
  productImage: string;
  productSlug?: string;
  author: string;
  rating: number;
  comment: string;
  images?: string[];
};

interface ReviewsState {
  reviews: UserReview[];
  addReview: (input: AddUserReviewInput) => UserReview;
  hasReviewed: (orderId: string, productId: string) => boolean;
  getReviewsForProduct: (productId: string) => UserReview[];
  getUserReviews: () => UserReview[];
}

function newReviewId(): string {
  return `ur-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export const useReviewsStore = create<ReviewsState>()(
  persist(
    (set, get) => ({
      reviews: [],
      addReview: (input) => {
        const review: UserReview = {
          id: newReviewId(),
          productId: input.productId,
          orderId: input.orderId,
          productName: input.productName,
          productImage: input.productImage,
          productSlug: input.productSlug,
          author: input.author,
          rating: input.rating,
          comment: input.comment.trim(),
          date: new Date().toISOString(),
          images: input.images?.length ? input.images : undefined,
        };
        set((s) => ({ reviews: [review, ...s.reviews] }));
        return review;
      },
      hasReviewed: (orderId, productId) =>
        get().reviews.some(
          (r) => r.orderId === orderId && r.productId === productId
        ),
      getReviewsForProduct: (productId) =>
        get().reviews.filter((r) => r.productId === productId),
      getUserReviews: () => get().reviews,
    }),
    { name: "naqshat-reviews" }
  )
);
