"use client";
import { ListingData } from "@/app/dashboard/vendor/page";
import Image from "next/image";
import { useState } from "react";

export default function AddListingModal({
  isOpen,
  onClose,
  onSubmit,
  vendorId,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ListingData) => void;
  vendorId: number;
}) {
  const [data, setFormData] = useState<ListingData>({
    type: "Hotel",
    name: "",
    address: "",
    description: "",
    facilities: [],
    pricing: 0,
    images: "", // Store image URLs from backend
    vendorId: vendorId,
  });

  const [facilityInput, setFacilityInput] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Handle text input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...data, [name]: value });
  };

  // Handle image selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);

    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...imageUrls]);
  };

  // Remove an image from selection
  const removeImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Add a facility
  const addFacility = () => {
    if (facilityInput.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        facilities: [...prev.facilities, facilityInput.trim()],
      }));
      setFacilityInput("");
    }
  };

  // Remove a facility
  //   const removeFacility = (index: number) => {
  //     setFormData((prev) => ({
  //       ...prev,
  //       facilities: prev.facilities.filter((_, i) => i !== index),
  //     }));
  //   };

  // Upload images to the backend
  const uploadImages = async () => {
    if (selectedFiles.length === 0) return "";

    const uploadedImageUrls = await Promise.all(
      selectedFiles.map(async (file) => {
        const formData = new FormData();

        formData.append("file", file);
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) throw new Error("Image upload failed");

          const result = await response.json();
          console.log(result);
          return result.imageUrl;
        } catch (error) {
          console.error("Error uploading images:", error);
          return "";
        }
      })
    );
    return uploadedImageUrls.join(",");
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Upload images first
    const uploadedImageUrls = await uploadImages();
    console.log(uploadedImageUrls);
    const tempData = {
      ...data,
      pricing: Number(data.pricing),
      vendorId: vendorId,
      images: uploadedImageUrls, // Store uploaded image URLs
    };
    console.log(tempData);

    onSubmit(tempData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-[10000]">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto mt-72">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Add New Listing
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Form Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Type
              </label>
              <select
                name="type"
                value={data.type}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500 transition"
              >
                <option value="Hotel">Hotel</option>
                <option value="Restaurant">Restaurant</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Pricing
              </label>
              <input
                type="number"
                name="pricing"
                value={data.pricing}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={data.address}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500 transition"
              />
            </div>
          </div>

          {/* Facilities */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Facilities
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={facilityInput}
                onChange={(e) => setFacilityInput(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500 transition"
                placeholder="Add a facility (e.g. Free WiFi)"
              />
              <button
                type="button"
                onClick={addFacility}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all"
              >
                Add
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={data.description}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500 transition"
            ></textarea>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Upload Images
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 border rounded-lg cursor-pointer transition-all"
            />
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="relative">
                  <Image
                    src={src}
                    alt="Preview"
                    width={80}
                    height={80}
                    className="object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-0 right-0 bg-red-600 text-white px-2 py-1 rounded-full text-xs"
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end gap-4 mt-5">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-orange-600 text-white rounded-lg"
            >
              Add Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
