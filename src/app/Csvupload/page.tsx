"use client";

import { UploadCloud } from "lucide-react";
import { useState } from "react";

// ✅ Local Button component (no external import needed)
const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost" | "soft";
  }
> = ({ className = "", variant = "secondary", children, ...props }) => {
  const base =
    "inline-flex items-center gap-2 rounded-xl text-sm font-medium px-3.5 py-2.5 transition-colors";
  const variants: Record<string, string> = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700",
    secondary: "bg-white text-gray-900 ring-1 ring-gray-200 hover:bg-gray-50",
    ghost: "text-gray-600 hover:bg-gray-100",
    soft: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default function CSVUploadPage() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10 text-gray-900">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold">New Enrollment</h1>
          <p className="text-sm text-gray-500">
            Add and enroll manually or import in bulk with CSVs.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b text-sm font-medium">
       
          <button className="pb-3 border-b-2 border-emerald-600 text-emerald-600">
            Bulk Enrollment with CSV
          </button>
        </div>

        {/* Upload Box */}
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-8 text-center shadow-sm hover:border-emerald-500 hover:bg-emerald-50/30 transition">
          <UploadCloud className="mx-auto h-12 w-12 text-emerald-500" />
          <p className="mt-2 text-sm font-medium text-gray-700">
            Upload a CSV file (.csv)
          </p>
          <p className="text-xs text-gray-500">
            Max file size supported is 5MB or 100 people
          </p>
          <input
            type="file"
            accept=".csv"
            className="mt-4 block w-full cursor-pointer rounded-md border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm file:mr-3 file:rounded-md file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-emerald-700"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        {/* Download Links */}
        <div className="space-y-2 text-sm">
          <a href="#" className="text-emerald-600 hover:underline">
            Download Sample File
          </a>
          <div className="flex flex-wrap gap-2 text-gray-600">
            <a href="#" className="text-emerald-600 hover:underline">
              Doctors List
            </a>
            <a href="#" className="text-emerald-600 hover:underline">
              Doctors Templates
            </a>
            <a href="#" className="text-emerald-600 hover:underline">
              Doctors Code
            </a>
          </div>
        </div>

        {/* Enroll Button */}
        <Button
          variant="primary"
          className="w-full justify-center"
          disabled={!file}
        >
          Enroll Now
        </Button>

        {/* Guidelines */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-sm">
          <h2 className="mb-2 font-medium">Guidelines to upload CSV files</h2>
          <ul className="list-disc space-y-1 pl-5 text-gray-600">
            <li>
              When creating your CSV, refer to the entity&apos;s index from the
              index file rather than using entity names.
            </li>
            <li>
              Invoices won&apos;t be attached to Doctor emails. Please use the
              Doctor portal for invoice access.
            </li>
          </ul>
        </div>
      </div>
    </div>


  );
}
