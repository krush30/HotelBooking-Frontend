"use client";
import { useState } from "react";

interface AddUnitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorId: number;
}

export default function AddUnitsModal({ isOpen, onClose }: AddUnitsModalProps) {
  const [unitData, setUnitData] = useState({
    listingId: "", // The hotel ID
    type: "",
    capacity: "",
    price: 0,
    availability: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUnitData({ ...unitData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/units`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(unitData),
      });

      if (!response.ok) throw new Error("Failed to add unit");

      alert("Unit added successfully!");
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error adding unit:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 mt-72">
        <h2 className="text-xl font-semibold mb-4">Add New Unit</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="listingId"
            placeholder="Listing ID"
            value={unitData.listingId}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="type"
            placeholder="Unit Type (e.g., Deluxe Room)"
            value={unitData.type}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={unitData.capacity}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={unitData.price}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="availability"
            placeholder="Availability (JSON format)"
            value={unitData.availability}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
