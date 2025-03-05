"use client";
import { useState } from "react";

export default function FileUploader({ onFileSelect }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      // Check if the file is an image
      if (selectedFile.type.startsWith("image/")) {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        onFileSelect(selectedFile);
        setError(null); // Clear any previous error
      } else {
        setError("Please upload an image file.");
        setFile(null);
        setPreview(null);
      }
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto bg-white shadow-xl rounded-lg space-y-4">
      <h2 className="text-xl font-semibold text-gray-700 text-center">Upload a File</h2>

      <div className="border-2 border-gray-300 rounded-md p-4 flex flex-col items-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4 w-full px-4 py-2 border border-blue-500 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Upload an image file"
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {preview && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 mb-2">Preview:</p>
            <img src={preview} alt="File Preview" className="w-full max-h-40 object-cover rounded-md" />
          </div>
        )}
      </div>
    </div>
  );
}
