// src/api/cloudinaryApi.ts
import axios from "axios";

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
const UPLOAD_PRESET = "cookProjectPreset"; // твій unsigned preset
const UPLOAD_FOLDER = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "";

export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
}

export const uploadToCloudinary = async (file: File): Promise<CloudinaryResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", UPLOAD_FOLDER);

  try {
    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (err: any) {
    console.error("Cloudinary upload error:", err.response?.data || err.message);
    throw new Error("Помилка завантаження на Cloudinary");
  }
};
