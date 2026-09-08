import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary.v2;

// ─── اعتبارسنجی Magic Bytes ────────────────────────────────────────────────

/**
 * بررسی می‌کند که محتوای باینری فایل واقعاً JPEG / PNG / WebP است.
 * @param {Buffer} buffer
 * @returns {boolean}
 */
export function isValidImageBuffer(buffer) {
  const isJPEG = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isPNG  = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e;
  const isWebP =
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP";

  return isJPEG || isPNG || isWebP;
}

// ─── اعتبارسنجی فایل واحد (نوع MIME + حجم) ────────────────────────────────

/**
 * @param {File} file
 * @returns {{ valid: boolean; message?: string }}
 */
export function validateImageFile(file) {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, message: "فرمت تصویر مجاز نیست." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, message: "حجم تصویر نباید بیشتر از 5MB باشد." };
  }
  return { valid: true };
}

// ─── آپلود یک فایل به Cloudinary ──────────────────────────────────────────

/**
 * @param {File} file
 * @param {string} folder  - نام پوشه در Cloudinary (مثلاً "products" | "brands" | "categories")
 * @param {object} [extraOptions] - گزینه‌های اضافی cloudinary.uploader.upload_stream
 * @returns {Promise<import("cloudinary").UploadApiResponse>}
 */
export async function uploadImageToCloudinary(file, folder, extraOptions = {}) {
  const bytes  = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  if (!isValidImageBuffer(buffer)) {
    throw new Error("محتوای فایل معتبر نیست.");
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          { width: 1200, crop: "limit" },
          { quality: "auto", fetch_format: "auto" },
        ],
        ...extraOptions,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
}

// ─── حذف چند تصویر (برای rollback یا حذف محصول/برند/دسته) ────────────────

/**
  @param {string[]} publicIds
 */
export async function deleteImagesFromCloudinary(publicIds) {
  if (!publicIds.length) return;
  await cloudinary.v2.api.delete_resources(publicIds);
}
