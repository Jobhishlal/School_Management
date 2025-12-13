// import React, { useState } from "react";
// import { createfinancetype } from "../../services/authapi";
// import type { CreateFeeTypePayload, OfferInterface } from "../../types/CreateFeeTypePayload";
// import { showToast } from "../../utils/toast";

// const CreateFeeTypeForm: React.FC = () => {
//   const [formData, setFormData] = useState<CreateFeeTypePayload>({
//     name: "",
//     description: "",
//     defaultAmount: "", 
//     frequency: "ONCE",
//     isOptional: false,
//     isActive: true,
//     offers: [],
//   });

//   const [offer, setOffer] = useState<OfferInterface>({
//     type: "ONCE",
//     discountPercentage: 0,
//   });

//   const handleAddOffer = () => {
//     setFormData({
//       ...formData,
//       offers: [...(formData.offers || []), offer],
//     });
//     setOffer({ type: "ONCE", discountPercentage: 0 });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await createfinancetype(formData);
//       console.log("Created:", response.data);
//       showToast("FeeType Created!","success");
//     } catch (err: any) {
//      const backendMessage =
//                   err?.response?.data?.message ||
//                   err?.message ||
//                   "Failed to create FeeType";
//                 showToast(backendMessage,"error");
//     }
//   };

//   return (
//     <div className="p-6 bg-white shadow-md rounded-md max-w-md mx-auto mt-8">
//       <h2 className="text-lg font-semibold mb-4">Create Fee Type</h2>
//       <form onSubmit={handleSubmit} className="space-y-3">
//         <input
//           type="text"
//           placeholder="Name"
//           value={formData.name}
//           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//           className="w-full border p-2 rounded"
          
//         />

//         <input
//           type="number"
//           placeholder="Default Amount"
//           value={formData.defaultAmount}
//           onChange={(e) => setFormData({ ...formData, defaultAmount: +e.target.value })}
//           className="w-full border p-2 rounded"
          
//         />

//         <select
//           value={formData.frequency}
//           onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
//           className="w-full border p-2 rounded"
//         >
//           <option value="ONCE">ONCE</option>
//           <option value="MONTHLY">MONTHLY</option>
//           <option value="YEARLY">YEARLY</option>
//         </select>

//         {/* Offer Section */}
//         <div className="border-t pt-3 mt-3">
//           <h3 className="font-semibold mb-2">Add Offer</h3>
//           <select
//             value={offer.type}
//             onChange={(e) => setOffer({ ...offer, type: e.target.value })}
//             className="border p-2 rounded w-full"
//           >
//             <option value="ONCE">ONCE</option>
//             <option value="MONTHLY">MONTHLY</option>
//             <option value="YEARLY">YEARLY</option>
//           </select>

//           <input
//             type="number"
//             placeholder="Discount Percentage"
//             value={offer.discountPercentage || ""}
//             onChange={(e) => setOffer({ ...offer, discountPercentage: +e.target.value })}
//             className="w-full border p-2 rounded mt-2"
//           />

//           <input
//             type="number"
//             placeholder="Discount Amount"
//             value={offer.discountAmount || ""}
//             onChange={(e) => setOffer({ ...offer, discountAmount: +e.target.value })}
//             className="w-full border p-2 rounded mt-2"
//           />

//           <button
//             type="button"
//             onClick={handleAddOffer}
//             className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
//           >
//             Add Offer
//           </button>

//           {formData.offers?.length > 0 && (
//             <ul className="mt-3 space-y-1 text-sm">
//               {formData.offers.map((o, i) => (
//                 <li key={i} className="bg-gray-100 p-2 rounded">
//                   {o.type} → {o.discountPercentage
//                     ? `${o.discountPercentage}%`
//                     : `₹${o.discountAmount} off`}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         <button
//           type="submit"
//           className="bg-green-600 text-white w-full py-2 rounded mt-4"
//         >
//           Create Fee Type
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateFeeTypeForm;



import React, { useState } from "react";
import { createfinancetype } from "../../services/authapi";
import type { CreateFeeTypePayload, OfferInterface } from "../../types/CreateFeeTypePayload";
import { showToast } from "../../utils/toast";
import { useTheme } from "../../components/layout/ThemeContext";

const CreateFeeTypeForm: React.FC = () => {
  const { isDark } = useTheme();
  
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
      showToast("FeeType Created!","success");
    } catch (err: any) {
      const backendMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create FeeType";
      showToast(backendMessage,"error");
    }
  };

  // Theme Classes
  const containerBg = isDark ? "bg-[#121A21] text-slate-100" : "bg-[#fafbfc] text-slate-900";
  const cardBg = isDark ? "bg-slate-800/50 border-gray-700" : "bg-white border-gray-300";
    const textPrimary = isDark ? "text-slate-200" : "text-gray-900";
    const textSecondary = isDark ? "text-slate-400" : "text-gray-600";
  const inputBg = isDark ? "bg-slate-700/50 border-slate-600 text-slate-100" : "bg-white border-gray-300 text-slate-900";
  const buttonPrimary = isDark ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white";
  const buttonSuccess = isDark ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-600 hover:bg-green-700 text-white";
  const offerItemBg = isDark ? "bg-slate-700/30" : "bg-gray-100";
  const dividerBorder = isDark ? "border-slate-600" : "border-gray-300";

  return (
    <div className={`p-6 rounded max-w-4xl mx-auto transition-colors duration-300 ${containerBg}`}>
     <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${textPrimary}`}>Finance Management</h1>
          <div className="flex gap-6 text-sm border-b border-slate-700/50">
            <a 
              href="/fee-management"
              className={`pb-3 border-b-2 border-blue-500 ${textPrimary} font-medium transition-colors duration-200 hover:text-blue-400`}
            >
              Fee Management
            </a>
            <a 
              href="/expence-managemtnt"
              className={`pb-3 border-b-2 border-transparent ${textSecondary} font-medium transition-colors duration-200 hover:text-slate-300 hover:border-slate-500`}
            >
              Expense Management
            </a>
            <a 
              href="/fee-report"
              className={`pb-3 border-b-2 border-transparent ${textSecondary} font-medium transition-colors duration-200 hover:text-slate-300 hover:border-slate-500`}
            >
              Fee Report
            </a>
          </div>
        </div>

     

      <div className={`p-6 border rounded-lg transition-colors duration-300 ${cardBg}`}>
        <h2 className="text-xl font-bold mb-6">Create Fee Type</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full border p-2 rounded transition-colors duration-200 ${inputBg}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Default Amount</label>
            <input
              type="number"
              placeholder="Default Amount"
              value={formData.defaultAmount}
              onChange={(e) => setFormData({ ...formData, defaultAmount: +e.target.value })}
              className={`w-full border p-2 rounded transition-colors duration-200 ${inputBg}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Frequency</label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
              className={`w-full border p-2 rounded transition-colors duration-200 ${inputBg}`}
            >
              <option value="ONCE">ONCE</option>
              <option value="MONTHLY">MONTHLY</option>
              <option value="YEARLY">YEARLY</option>
            </select>
          </div>

          {/* Offer Section */}
          <div className={`border-t pt-4 mt-4 transition-colors duration-200 ${dividerBorder}`}>
            <h3 className="font-semibold mb-3 text-lg">Add Offer</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Offer Type</label>
                <select
                  value={offer.type}
                  onChange={(e) => setOffer({ ...offer, type: e.target.value })}
                  className={`border p-2 rounded w-full transition-colors duration-200 ${inputBg}`}
                >
                  <option value="ONCE">ONCE</option>
                  <option value="MONTHLY">MONTHLY</option>
                  <option value="YEARLY">YEARLY</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Discount Percentage</label>
                <input
                  type="number"
                  placeholder="Discount Percentage"
                  value={offer.discountPercentage || ""}
                  onChange={(e) => setOffer({ ...offer, discountPercentage: +e.target.value })}
                  className={`w-full border p-2 rounded transition-colors duration-200 ${inputBg}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Discount Amount</label>
                <input
                  type="number"
                  placeholder="Discount Amount"
                  value={offer.discountAmount || ""}
                  onChange={(e) => setOffer({ ...offer, discountAmount: +e.target.value })}
                  className={`w-full border p-2 rounded transition-colors duration-200 ${inputBg}`}
                />
              </div>

              <button
                type="button"
                onClick={handleAddOffer}
                className={`px-4 py-2 rounded transition-colors duration-200 ${buttonPrimary}`}
              >
                Add Offer
              </button>
            </div>

            {formData.offers?.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Added Offers:</h4>
                <ul className="space-y-2">
                  {formData.offers.map((o, i) => (
                    <li key={i} className={`p-3 rounded transition-colors duration-200 ${offerItemBg}`}>
                      <span className="font-medium">{o.type}</span> → {o.discountPercentage
                        ? `${o.discountPercentage}%`
                        : `₹${o.discountAmount} off`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded mt-6 transition-colors duration-200 ${buttonSuccess}`}
          >
            Create Fee Type
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateFeeTypeForm;