"use client";

import { useRef, useState } from "react";

export default function CVUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  function formatSize(bytes: number) {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0];

    if (!file) {
      setFileName(null);
      setFileSize(null);
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      setFileName(null);
      setFileSize(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (file.size > MAX_SIZE) {
      setError("File is too large. Maximum size is 5MB.");
      setFileName(null);
      setFileSize(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setFileName(file.name);
    setFileSize(formatSize(file.size));
  }

  function handleClear(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setFileName(null);
    setFileSize(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const hasFile = !!fileName;

  return (
    <div>
      <div
        className={`bg-primary-dark border-2 border-dashed rounded-2xl p-8 md:p-10 transition group ${
          hasFile
            ? "border-green-500/60"
            : "border-white/15 hover:border-accent/50"
        }`}
      >
        <label htmlFor="cv" className="block cursor-pointer text-center">
          {/* Icon */}
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition border ${
              hasFile
                ? "bg-green-500/15 border-green-500/40"
                : "bg-accent/10 border-accent/30 group-hover:bg-accent/20"
            }`}
          >
            {hasFile ? (
              <svg
                className="w-8 h-8 text-green-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg
                className="w-8 h-8 text-accent"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            )}
          </div>

          {hasFile ? (
            <>
              <h3 className="font-display text-xl font-bold text-white mb-2">
                File selected
              </h3>
              <p className="text-green-400 text-sm font-bold mb-1 break-all">
                {fileName}
              </p>
              <p className="text-white/50 text-xs mb-4">{fileSize}</p>
              <div className="flex items-center justify-center gap-3">
                <div className="inline-block px-5 py-2.5 bg-accent/15 border border-accent/30 rounded-lg text-accent font-bold text-sm hover:bg-accent/25 transition">
                  Change File
                </div>
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-block px-5 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white/60 font-bold text-sm hover:bg-white/10 transition"
                >
                  Remove
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="font-display text-xl font-bold text-white mb-2">
                Drop your CV here, or click to browse
              </h3>
              <p className="text-white/60 text-sm mb-4">
                PDF format only · Maximum 5MB
              </p>
              <div className="inline-block px-5 py-2.5 bg-accent/15 border border-accent/30 rounded-lg text-accent font-bold text-sm hover:bg-accent/25 transition">
                Choose File
              </div>
            </>
          )}

          <input
            ref={inputRef}
            id="cv"
            name="cv"
            type="file"
            accept="application/pdf"
            onChange={handleChange}
            className="sr-only"
          />
        </label>
      </div>

      {error && (
        <p className="mt-3 text-red-400 text-sm font-medium text-center">
          {error}
        </p>
      )}
    </div>
  );
}
