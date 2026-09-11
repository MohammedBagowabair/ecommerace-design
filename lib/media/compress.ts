/** Client-side image compression to data URL (keeps localStorage smaller). */

export async function fileToCompressedDataUrl(
  file: File,
  opts?: { maxWidth?: number; maxHeight?: number; quality?: number; maxBytes?: number }
): Promise<string> {
  const maxWidth = opts?.maxWidth ?? 1200;
  const maxHeight = opts?.maxHeight ?? 1200;
  const quality = opts?.quality ?? 0.72;
  const maxBytes = opts?.maxBytes ?? 450_000;

  if (file.type.startsWith("video/")) {
    if (file.size > 2_500_000) {
      throw new Error("الفيديو كبير جدًا — اختاري مقطعًا أقصر من ~2.5 ميجا");
    }
    return readAsDataUrl(file);
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("الملف يجب أن يكون صورة أو فيديو");
  }

  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;
  const scale = Math.min(1, maxWidth / width, maxHeight / height);
  width = Math.max(1, Math.round(width * scale));
  height = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return readAsDataUrl(file);
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let q = quality;
  let dataUrl = canvas.toDataURL("image/jpeg", q);
  while (dataUrl.length > maxBytes * 1.37 && q > 0.4) {
    q -= 0.08;
    dataUrl = canvas.toDataURL("image/jpeg", q);
  }
  return dataUrl;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("تعذّر قراءة الملف"));
    reader.readAsDataURL(file);
  });
}

export function isDataUrl(src: string): boolean {
  return src.startsWith("data:");
}

export function isVideoSrc(src: string): boolean {
  if (src.startsWith("data:video")) return true;
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(src);
}
