/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import { isDataUrl, isVideoSrc } from "@/lib/media/compress";
import { cn } from "@/lib/utils";

/** Renders image or video; supports remote URLs and data URLs. */
export function SafeMedia({
  src,
  alt,
  fill,
  className,
  sizes,
  priority,
  width,
  height,
  controls,
  muted,
  autoPlay,
  loop,
}: {
  src: string;
  alt?: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  controls?: boolean;
  muted?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
}) {
  if (!src) {
    return (
      <div
        className={cn("bg-cream-100", fill && "absolute inset-0", className)}
        aria-hidden
      />
    );
  }

  if (isVideoSrc(src)) {
    return (
      <video
        src={src}
        className={cn(fill && "absolute inset-0 h-full w-full object-cover", className)}
        controls={controls ?? true}
        muted={muted}
        autoPlay={autoPlay}
        loop={loop}
        playsInline
        aria-label={alt}
      />
    );
  }

  if (isDataUrl(src) || src.startsWith("blob:")) {
    /* Data/blob URLs: next/image cannot optimize these in the mock admin flow. */
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt ?? ""}
        className={cn(fill && "absolute inset-0 h-full w-full object-cover", className)}
        width={width}
        height={height}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt ?? ""}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt ?? ""}
      width={width ?? 400}
      height={height ?? 400}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
