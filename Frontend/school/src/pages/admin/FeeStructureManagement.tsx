import React, { useState, useEffect } from "react";
import { createFinanceStructure, GetAllFeeType, GetAllClass } from "../../services/authapi";
import type { CreateFeeStructureDTO } from "../../types/CreateFeeStructureDTO ";
import CreateFeeTypeForm from "../../pages/admin/FeeTypeCreate";
import { generateAcademicYears } from "../../utils/AcademicYear";

interface FeeType {
  id: string;
  name: string;
  description: string;
  defaultAmount: number;
}

interface ClassInfo {
  _id: string;
  className: string;
  division: string;
}

const CreateFeeStructureForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateFeeStructureDTO>({
    name: "",
    classId: "",
    academicYear: "",
    feeItems: [{ feeTypeId: "", amount: 0, isOptional: false }],
    notes: "",
  });

  const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feeRes, classRes] = await Promise.all([GetAllFeeType(), GetAllClass()]);
        
        setFeeTypes(feeRes.data || []);
        console.log("fees releted data get it",feeRes||feeRes.data.data)
        setClasses(classRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleFeeItemChange = (index: number, field: string, value: any) => {
  const updatedItems = [...formData.feeItems];

  if (field === "feeTypeId") {
    const selectedType = feeTypes.find((ft) => ft.id === value);
    if (selectedType) {
      updatedItems[index].amount = selectedType.defaultAmount || 0;
    }
  }

  (updatedItems[index] as any)[field] = value;
  setFormData({ ...formData, feeItems: updatedItems });
};


  const addFeeItem = () => {
    setFormData({
      ...formData,
      feeItems: [...formData.feeItems, { feeTypeId: "", amount: 0, isOptional: false }],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await createFinanceStructure(formData);
      setMessage(" Fee Structure created successfully!");
      console.log(response);
    } catch (err: any) {
      setMessage(" Failed to create fee structure: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
     
      <CreateFeeTypeForm />

      <div className="max-w-lg mx-auto p-6 shadow-md rounded-lg bg-white mt-6">
        <h2 className="text-2xl font-semibold mb-4">Create Fee Structure</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Structure Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />

          {/* ✅ Class Dropdown */}
          <select
            name="classId"
            value={formData.classId}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.className} - {cls.division}
              </option>
            ))}
          </select>

           <select
          name="academicYear"
        value={formData.academicYear}
  onChange={handleChange}
  className="w-full border rounded p-2"
  required
>
  <option value="">Select Academic Year</option>
  {generateAcademicYears().map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ))}
</select>


          <textarea
            name="notes"
            placeholder="Notes (optional)"
            value={formData.notes}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />

          <h3 className="font-semibold mt-4">Fee Items</h3>
          {formData.feeItems.map((item, index) => (
            <div key={index} className="border p-3 rounded space-y-2 mb-3">
             <select
  value={item.feeTypeId}
  onChange={(e) => handleFeeItemChange(index, "feeTypeId", e.target.value)}
  className="w-full border rounded p-2"
  required
>
  <option value="">Select Fee Type</option>
  {feeTypes.map((ft) => (
    <option key={ft.id} value={ft.id}>
      {ft.name}
    </option>
  ))}
</select>


              <input
                  type="number"
                  placeholder="Amount"
                  value={item.amount}
                  onChange={(e) => handleFeeItemChange(index, "amount", Number(e.target.value))}
                  className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
                   readOnly
                  />

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={item.isOptional}
                  onChange={(e) => handleFeeItemChange(index, "isOptional", e.target.checked)}
                />
                <span>Is Optional?</span>
              </label>
            </div>
          ))}

          <button
            type="button"
            onClick={addFeeItem}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            + Add Fee Item
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded w-full mt-4"
          >
            {loading ? "Creating..." : "Create Fee Structure"}
          </button>

          {message && <p className="mt-4 text-center text-sm">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreateFeeStructureForm;
