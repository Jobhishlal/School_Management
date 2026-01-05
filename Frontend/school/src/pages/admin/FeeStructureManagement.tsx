
import React, { useState, useEffect } from "react";
import { createFinanceStructure, GetAllFeeType, GetAllClass } from "../../services/authapi";
import type { CreateFeeStructureDTO } from "../../types/CreateFeeStructureDTO ";
import CreateFeeTypeForm from "../../pages/admin/FeeTypeCreate";
import { generateAcademicYears } from "../../utils/AcademicYear";
import { showToast } from "../../utils/toast";
import { useTheme } from "../../components/layout/ThemeContext";
import ClassPaymentStatus from "./StudentPaymentHistory";

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
  const { isDark } = useTheme();
  
  const [formData, setFormData] = useState<CreateFeeStructureDTO>({
    name: "",
    classId: "",
    academicYear: "",
    feeItems: [{ feeTypeId: "", amount: 0, isOptional: false }],
    notes: "",
    startDate: "", 
    expiryDate: "" 
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
        // console.log("fees releted data get it",feeRes||feeRes.data.data)
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
      showToast(" Fee Structure created successfully!","success");
      console.log(response);
    } catch (err: any) {
      const backendMessage =
    err?.response?.data?.message ||
    err?.message ||
    "Failed to create fee structure";

  showToast(backendMessage, "error");


    } finally {
      setLoading(false);
    }
  };

  // Theme Classes - matching timetable exactly
  const containerBg = isDark ? "bg-[#121A21] text-slate-100" : "bg-[#fafbfc] text-slate-900";
  const cardBg = isDark ? "bg-slate-800/50 border-gray-700" : "bg-white border-gray-300";
  const inputBg = isDark ? "bg-slate-700/50 border-slate-600 text-slate-100" : "bg-white border-gray-300 text-slate-900";
  const buttonPrimary = isDark ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white";
  const buttonSuccess = isDark ? "bg-blue-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white";
  const feeItemBg = isDark ? "bg-slate-700/30 border-slate-600" : "bg-gray-50 border-gray-200";

  return (
    <div className={`p-6 rounded min-h-[calc(100vh-2rem)] transition-colors duration-300 ${containerBg}`}>
      <CreateFeeTypeForm />

      <div className={`max-w-4xl mx-auto p-6 border rounded-lg mt-6 transition-colors duration-300 ${cardBg}`}>
        <h2 className="text-xl font-bold mb-6">Create Fee Structure</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Structure Name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full border rounded p-2 transition-colors duration-200 ${inputBg}`}
          />

          <select
            name="classId"
            value={formData.classId}
            onChange={handleChange}
            className={`w-full border rounded p-2 transition-colors duration-200 ${inputBg}`}
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
            className={`w-full border rounded p-2 transition-colors duration-200 ${inputBg}`}
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
            className={`w-full border rounded p-2 transition-colors duration-200 ${inputBg}`}
          />

           <div className="flex-1">
           <label>Start Date</label>
           <input
           type="date"
           name="startDate"
           value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          className={`w-full border rounded p-2 transition-colors duration-200 ${inputBg}`}
      
          />
           </div>

          <div className="flex-1">
          <label>Expiry Date</label>
          <input
            type="date"
           name="expiryDate"
           value={formData.expiryDate}
           onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
          className={`w-full border rounded p-2 transition-colors duration-200 ${inputBg}`}
      
          />
         </div>

          <h3 className="font-semibold mt-4">Fee Items</h3>
          {formData.feeItems.map((item, index) => (
            <div key={index} className={`border p-3 rounded space-y-2 mb-3 transition-colors duration-200 ${feeItemBg}`}>
              <select
                value={item.feeTypeId}
                onChange={(e) => handleFeeItemChange(index, "feeTypeId", e.target.value)}
                className={`w-full border rounded p-2 transition-colors duration-200 ${inputBg}`}
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
                className={`w-full border rounded p-2 cursor-not-allowed transition-colors duration-200 ${inputBg}`}
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
            className={`px-4 py-2 rounded transition-colors duration-200 ${buttonPrimary}`}
          >
            + Add Fee Item
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-6 py-2 rounded mt-4 transition-colors duration-200 ${buttonSuccess}`}
          >
            {loading ? "Creating..." : "Create Fee Structure"}
          </button>

          {message && <p className="mt-4 text-center text-sm">{message}</p>}
        </form>
      </div>
      <ClassPaymentStatus/>
    </div>
  );
};

export default CreateFeeStructureForm;