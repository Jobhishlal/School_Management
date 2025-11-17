import React, { useState } from "react";
import { createfinancetype } from "../../services/authapi";
import type { CreateFeeTypePayload, OfferInterface } from "../../types/CreateFeeTypePayload";

const CreateFeeTypeForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateFeeTypePayload>({
    name: "",
    description: "",
    defaultAmount: "", 
    frequency: "ONCE",
    isOptional: false,
    isActive: true,
    offers: [],
  });

  const [offer, setOffer] = useState<OfferInterface>({
    type: "ONCE",
    discountPercentage: 0,
  });

  const handleAddOffer = () => {
    setFormData({
      ...formData,
      offers: [...(formData.offers || []), offer],
    });
    setOffer({ type: "ONCE", discountPercentage: 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createfinancetype(formData);
      console.log("Created:", response.data);
      alert("FeeType Created!");
    } catch (err: any) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-md mx-auto mt-8">
      <h2 className="text-lg font-semibold mb-4">Create Fee Type</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="number"
          placeholder="Default Amount"
          value={formData.defaultAmount}
          onChange={(e) => setFormData({ ...formData, defaultAmount: +e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        <select
          value={formData.frequency}
          onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
          className="w-full border p-2 rounded"
        >
          <option value="ONCE">ONCE</option>
          <option value="MONTHLY">MONTHLY</option>
          <option value="YEARLY">YEARLY</option>
        </select>

        {/* Offer Section */}
        <div className="border-t pt-3 mt-3">
          <h3 className="font-semibold mb-2">Add Offer</h3>
          <select
            value={offer.type}
            onChange={(e) => setOffer({ ...offer, type: e.target.value })}
            className="border p-2 rounded w-full"
          >
            <option value="ONCE">ONCE</option>
            <option value="MONTHLY">MONTHLY</option>
            <option value="YEARLY">YEARLY</option>
          </select>

          <input
            type="number"
            placeholder="Discount Percentage"
            value={offer.discountPercentage || ""}
            onChange={(e) => setOffer({ ...offer, discountPercentage: +e.target.value })}
            className="w-full border p-2 rounded mt-2"
          />

          <input
            type="number"
            placeholder="Discount Amount"
            value={offer.discountAmount || ""}
            onChange={(e) => setOffer({ ...offer, discountAmount: +e.target.value })}
            className="w-full border p-2 rounded mt-2"
          />

          <button
            type="button"
            onClick={handleAddOffer}
            className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
          >
            Add Offer
          </button>

          {formData.offers?.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm">
              {formData.offers.map((o, i) => (
                <li key={i} className="bg-gray-100 p-2 rounded">
                  {o.type} → {o.discountPercentage
                    ? `${o.discountPercentage}%`
                    : `₹${o.discountAmount} off`}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white w-full py-2 rounded mt-4"
        >
          Create Fee Type
        </button>
      </form>
    </div>
  );
};

export default CreateFeeTypeForm;
