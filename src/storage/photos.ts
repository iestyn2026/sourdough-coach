/**
 * photos.ts — turn a phone photo into something localStorage can afford.
 *
 * A modern phone photo is 3–8MB; localStorage holds ~5MB total. Downscaling to
 * max 1000px JPEG at 72% quality lands around 80–150KB per photo — small enough
 * for several fully-photographed loaves (DECISIONS.md #12). Browser-API code, so
 * it lives here in the storage layer, not in lib/sourdough (which stays pure).
 */

const MAX_DIMENSION = 1000;
const JPEG_QUALITY = 0.72;

export async function downscalePhoto(file: File): Promise<string> {
  const bitmap = await loadBitmap(file);
  try {
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not available');
    ctx.drawImage(bitmap, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
  } finally {
    bitmap.close();
  }
}

async function loadBitmap(file: File): Promise<ImageBitmap> {
  try {
    // 'from-image' applies the photo's EXIF rotation (phones rely on it).
    return await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    // Older Safari doesn't know the option — fall back without it.
    return createImageBitmap(file);
  }
}
