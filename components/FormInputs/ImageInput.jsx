// components/inputs/ImageInput.jsx
"use client";
import { useState } from "react";

export default function ImageInput({ label, register, name, setValue, watch }) {
  const [preview, setPreview] = useState(null);

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/imageUploader", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const { url } = await res.json();
      setValue(name, url); // ✅ update react-hook-form value
      setPreview(url);
    }
  }

  const currentValue = watch(name);

  return (
    <div className="my-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {/* Manual URL input */}
      <input
        type="text"
        {...register(name)}
        defaultValue={currentValue || ""}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        placeholder="Paste image URL or upload file"
      />

      {/* File upload */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mt-2"
      />

      {/* Preview */}
      {(preview || currentValue) && (
        <img
          src={preview || currentValue}
          alt="Preview"
          className="mt-2 w-32 h-32 object-cover border rounded"
        />
      )}
    </div>
  );
}
