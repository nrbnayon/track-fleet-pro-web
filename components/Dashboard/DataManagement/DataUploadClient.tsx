// components/Dashboard/DataManagement/DataUploadClient.tsx
"use client";

import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import TranslatedText from "@/components/Shared/TranslatedText";

interface ValidationResult {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  errors: string[];
}

export default function DataUploadClient() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      validateFile(selectedFile);
    } else {
      alert("Please upload a CSV or Excel file");
    }
  };

  const validateFile = (file: File) => {
    setIsValidating(true);
    
    // Simulated validation - replace with actual validation logic
    setTimeout(() => {
      const mockValidation: ValidationResult = {
        totalRows: 150,
        validRows: 50,
        invalidRows: 8,
        errors: [
          "Row 2: Missing required fields",
          "Row 3: Missing required fields",
          "Row 4: Missing required fields",
          "Row 5: Missing required fields",
          "Row 6: Missing required fields",
          "Row 7: Missing required fields",
        ],
      };
      
      setValidationResult(mockValidation);
      setIsValidating(false);
    }, 1500);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleConfirm = () => {
    console.log("Confirming upload with valid rows:", validationResult?.validRows);
    // Add logic to process and save valid rows
    alert("Data uploaded successfully!");
    handleCancel();
  };

  const handleCancel = () => {
    setFile(null);
    setValidationResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {!validationResult ? (
        <>
          {/* Upload Area */}
          <div className="bg-white rounded-lg border border-border p-8">
            <h3 className="text-xl font-semibold text-foreground mb-6">
              <TranslatedText text="Property Records" />
            </h3>

            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragging
                  ? "border-primary-green bg-green-50"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              <div className="flex flex-col items-center justify-center space-y-4">
                <FileText className="w-16 h-16 text-gray-400" />
                <div>
                  <p className="text-lg font-medium text-foreground mb-2">
                    <TranslatedText text="Drag & Drop Your Spreadsheet" />
                  </p>
                  <p className="text-sm text-secondary">
                    <TranslatedText text="or click to browse files" />
                  </p>
                </div>
                <Button
                  onClick={handleBrowseClick}
                  variant="outline"
                  className="mt-4"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  <TranslatedText text="Browse Files" />
                </Button>
                <p className="text-xs text-secondary mt-2">
                  <TranslatedText text="Supported formats: CSV, XLSX" />
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* Requirements */}
          <div className="bg-green-50 rounded-lg border border-green-200 p-6">
            <h4 className="text-base font-semibold text-foreground mb-4">
              <TranslatedText text="File Format Requirements:" />
            </h4>
            <ul className="space-y-2 text-sm text-secondary">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <TranslatedText text="File must be in Excel (.xlsx, .xls) or CSV format" />
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <TranslatedText text="Required columns: Parcel ID, Owner Name, Area, Zone, Type, Ownership Status, Registration Date" />
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <TranslatedText text="Area should be in square meters (m2)" />
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <TranslatedText text="Type must be one of: commercial, residential, industrial, agricultural" />
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <TranslatedText text="Ownership Status must be: leased or owned" />
              </li>
            </ul>
          </div>
        </>
      ) : (
        /* Validation Results */
        <div className="bg-white rounded-lg border border-border p-8">
          <div className="flex items-start gap-3 mb-6">
            <CheckCircle2 className="w-6 h-6 text-green-500 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                <TranslatedText text="Drag & Drop Your Spreadsheet" />
              </h3>
              
              <div className="grid grid-cols-3 gap-6 mt-6">
                <div>
                  <p className="text-sm text-secondary mb-1">
                    <TranslatedText text="Total Rows" />
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {validationResult.totalRows}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-secondary mb-1">
                    <TranslatedText text="Valid Rows" />
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {validationResult.validRows}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-secondary mb-1">
                    <TranslatedText text="Invalid Rows" />
                  </p>
                  <p className="text-3xl font-bold text-red-600">
                    {validationResult.invalidRows}
                  </p>
                </div>
              </div>

              {validationResult.errors.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-foreground mb-3">
                    <TranslatedText text="Validation Errors:" />
                  </p>
                  <ul className="space-y-2">
                    {validationResult.errors.map((error, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-secondary">
                        <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="px-6"
            >
              <TranslatedText text="Cancel" />
            </Button>
            <Button
              onClick={handleConfirm}
              className="bg-gray-800 text-white px-6 hover:bg-gray-900"
              disabled={validationResult.validRows === 0}
            >
              <TranslatedText text="Confirm" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}