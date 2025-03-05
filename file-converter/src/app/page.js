"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState("webp");
  const [convertedFile, setConvertedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleConvert = async () => {
    if (!file) return;

    setLoading(true);
    setError(null); // Reset previous error

    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", format);

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to convert the file. Please try again.");
      }

      const blob = await response.blob();
      setConvertedFile(URL.createObjectURL(blob));
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-lg space-y-6">
        <h1 className="text-2xl font-semibold text-center text-gray-700">File Converter</h1>

        {/* File Input */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1" htmlFor="fileInput">Choose a file</label>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-gray-400 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Format Selection */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1" htmlFor="formatSelect">Choose Format</label>
          <select
            id="formatSelect"
            onChange={(e) => setFormat(e.target.value)}
            className="text-gray-600 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="webp">Convert to WebP</option>
            <option value="png">Convert to PNG</option>
            <option value="jpeg">Convert to JPEG</option>
            <option value="pdf">Convert to PDF</option>
          </select>
        </div>

        {/* Convert Button */}
        <button
          onClick={handleConvert}
          disabled={!file || loading}
          className={`w-full py-2 text-white font-semibold rounded-md shadow-md transition-all ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Converting..." : "Convert"}
        </button>

        {/* Error Message */}
        {error && (
          <div className="text-red-600 text-center mt-4">{error}</div>
        )}

        {/* Download Link */}
        {convertedFile && (
          <a
            href={convertedFile}
            download={`converted.${format}`}
            className="block mt-4 text-center text-blue-600 font-medium hover:underline"
          >
            Download Converted File
          </a>
        )}
      </div>
    </div>
  );
}
