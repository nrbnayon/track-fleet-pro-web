// components/Dashboard/DataManagement/PropertyModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TranslatedText from "@/components/Shared/TranslatedText";
import { LandParcel, LandParcelFormData } from "@/types/land-parcel";

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: LandParcelFormData) => void;
  property?: LandParcel | null;
  mode: "create" | "edit";
}

export default function PropertyModal({
  isOpen,
  onClose,
  onSave,
  property,
  mode,
}: PropertyModalProps) {
  const [formData, setFormData] = useState<LandParcelFormData>({
    parcelId: "",
    ownerName: "",
    area: 0,
    zone: "",
    type: "",
    ownership: "",
    registrationDate: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof LandParcelFormData, string>>
  >({});

  useEffect(() => {
    if (property && mode === "edit") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        parcelId: property.parcelId,
        ownerName: property.ownerName,
        area: property.area,
        zone: property.zone,
        type: property.type,
        ownership: property.ownership,
        registrationDate: property.registrationDate,
      });
    } else {
      setFormData({
        parcelId: "",
        ownerName: "",
        area: 0,
        zone: "",
        type: "",
        ownership: "",
        registrationDate: "",
      });
    }
    setErrors({});
  }, [property, mode, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "area" ? parseFloat(value) || 0 : value,
    }));

    if (errors[name as keyof LandParcelFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LandParcelFormData, string>> = {};

    if (!formData.parcelId.trim()) newErrors.parcelId = "Parcel ID is required";
    if (!formData.ownerName.trim())
      newErrors.ownerName = "Owner Name is required";
    if (!formData.area || formData.area <= 0)
      newErrors.area = "Area must be greater than 0";
    if (!formData.zone.trim()) newErrors.zone = "Zone is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.ownership) newErrors.ownership = "Ownership is required";
    if (!formData.registrationDate)
      newErrors.registrationDate = "Registration Date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-foreground">
            <TranslatedText
              text={mode === "create" ? "Add New Property" : "Edit Property"}
            />
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-sm text-secondary mb-6">
            <TranslatedText text="Enter the property details below." />
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <TranslatedText text="Parcel ID" />*
              </label>
              <Input
                type="text"
                name="parcelId"
                value={formData.parcelId}
                onChange={handleChange}
                placeholder="08000961"
                disabled={mode === "edit"}
                className={errors.parcelId ? "border-red-500" : ""}
              />
              {errors.parcelId && (
                <p className="text-red-500 text-xs mt-1">{errors.parcelId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <TranslatedText text="Owner Name" />*
              </label>
              <Input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                placeholder="John Doe"
                className={errors.ownerName ? "border-red-500" : ""}
              />
              {errors.ownerName && (
                <p className="text-red-500 text-xs mt-1">{errors.ownerName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <TranslatedText text="Ownership" />*
              </label>
              <select
                name="ownership"
                value={formData.ownership}
                onChange={handleChange}
                className={`w-full h-11 px-3 py-1 rounded-md border bg-transparent text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] cursor-pointer ${errors.ownership ? "border-red-500" : "border-input"
                  }`}
              >
                <option value="">Select ownership</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
              {errors.ownership && (
                <p className="text-red-500 text-xs mt-1">{errors.ownership}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <TranslatedText text="Right Type" />*
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`w-full h-11 px-3 py-1 rounded-md border bg-transparent text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] cursor-pointer ${errors.type ? "border-red-500" : "border-input"
                  }`}
              >
                <option value="">Select type</option>
                <option value="Commercial">Commercial</option>
                <option value="Residential">Residential</option>
                <option value="Agricultural">Agricultural</option>
                <option value="Industrial">Industrial</option>
              </select>
              {errors.type && (
                <p className="text-red-500 text-xs mt-1">{errors.type}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <TranslatedText text="Measurement (m²)" />*
              </label>
              <select
                name="zone"
                value={formData.zone}
                onChange={handleChange}
                className={`w-full h-11 px-3 py-1 rounded-md border bg-transparent text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] cursor-pointer ${errors.zone ? "border-red-500" : "border-input"
                  }`}
              >
                <option value="">Select zone</option>
                <option value="Zone A">Zone A</option>
                <option value="Zone B">Zone B</option>
                <option value="Zone C">Zone C</option>
                <option value="Zone D">Zone D</option>
                <option value="Zone E">Zone E</option>
              </select>
              {errors.zone && (
                <p className="text-red-500 text-xs mt-1">{errors.zone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <TranslatedText text="Area (m²)" />*
              </label>
              <Input
                type="number"
                name="area"
                value={formData.area || ""}
                onChange={handleChange}
                placeholder="1,243 m²"
                className={errors.area ? "border-red-500" : ""}
              />
              {errors.area && (
                <p className="text-red-500 text-xs mt-1">{errors.area}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                <TranslatedText text="Creation Date" />*
              </label>
              <Input
                type="date"
                name="registrationDate"
                value={formData.registrationDate}
                onChange={handleChange}
                className={errors.registrationDate ? "border-red-500" : ""}
              />
              {errors.registrationDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.registrationDate}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6"
            >
              <TranslatedText text="Cancel" />
            </Button>
            <Button
              type="submit"
              className="bg-primary-green text-white px-6 hover:bg-green-600"
            >
              <TranslatedText
                text={mode === "create" ? "Create Property" : "Update Property"}
              />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
