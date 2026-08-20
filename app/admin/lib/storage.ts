import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirebaseStorageInstance } from "./firebase";

const WEBP_QUALITY = 0.85;
const SKIP_CONVERSION_TYPES = new Set([
  "image/webp",
  "image/gif", // preserve animation
  "image/svg+xml", // vector
]);

function sanitize(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-");
}

function stripExtension(name: string): string {
  const idx = name.lastIndexOf(".");
  return idx > 0 ? name.slice(0, idx) : name;
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to decode image."));
    };
    img.src = url;
  });
}

async function convertToWebP(file: File): Promise<File> {
  if (SKIP_CONVERSION_TYPES.has(file.type)) return file;

  const img = await loadImageFromFile(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable.");
  ctx.drawImage(img, 0, 0);

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("WebP encoding failed."))),
      "image/webp",
      WEBP_QUALITY,
    );
  });

  const baseName = stripExtension(file.name) || "image";
  return new File([blob], `${baseName}.webp`, { type: "image/webp" });
}

export async function uploadImage(
  file: File,
  folder: string,
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image.");
  }
  const converted = await convertToWebP(file);
  const path = `${folder}/${Date.now()}-${sanitize(converted.name)}`;
  const storageRef = ref(getFirebaseStorageInstance(), path);
  await uploadBytes(storageRef, converted, { contentType: converted.type });
  return getDownloadURL(storageRef);
}

export type PdfUpload = { url: string; path: string };

export async function uploadPdf(
  file: File,
  folder: string,
): Promise<PdfUpload> {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    throw new Error("File must be a PDF.");
  }
  const path = `${folder}/${Date.now()}-${sanitize(file.name)}`;
  const storageRef = ref(getFirebaseStorageInstance(), path);
  await uploadBytes(storageRef, file, { contentType: "application/pdf" });
  const url = await getDownloadURL(storageRef);
  return { url, path };
}

export async function deleteStorageObject(path: string): Promise<void> {
  if (!path) return;
  const { deleteObject } = await import("firebase/storage");
  const storageRef = ref(getFirebaseStorageInstance(), path);
  await deleteObject(storageRef);
}

const VIDEO_MIME_PREFIX = "video/";

/**
 * Upload any image or video the admin picks. Images are routed through
 * uploadImage() so they get the same WebP conversion the other forms
 * use; videos are uploaded raw (browser transcoding isn't practical).
 */
export async function uploadMedia(
  file: File,
  folder: string,
): Promise<string> {
  if (file.type.startsWith("image/")) {
    return uploadImage(file, folder);
  }
  if (file.type.startsWith(VIDEO_MIME_PREFIX)) {
    const path = `${folder}/${Date.now()}-${sanitize(file.name)}`;
    const storageRef = ref(getFirebaseStorageInstance(), path);
    await uploadBytes(storageRef, file, { contentType: file.type });
    return getDownloadURL(storageRef);
  }
  throw new Error("File must be an image or video.");
}
