// interface SelectInputProps<T extends string> {
//   label: string;
//   value: T;
//   onChange: (val: T) => void;
//   options: T[];
//   required?: boolean;
//   bgColor?: string; 
//   isDark?:boolean
// }

// export const SelectInput = <T extends string>({
//   label,
//   value,
//   onChange,
//   options,
//   required = false,
//   bgColor,
//   isDark = false
// }: SelectInputProps<T>) => (
//   <div className="flex flex-col gap-2">
//     <label
//       className={`block text-sm font-medium mb-2 ${isDark ? "text-slate-300" : "text-gray-700"}`}
//     >
//       {label}{required && "*"}
//     </label>
//     <select
//       value={value}
//       onChange={(e) => onChange(e.target.value as T)}
//       required={required}
//       style={{ backgroundColor: bgColor }}
//       className={`w-full px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm
//         ${isDark 
//           ? "bg-slate-700 border-slate-600 text-slate-100" 
//           : "bg-white border-gray-300 text-gray-800"
//         }`}
//     >
//       {options.map((opt) => (
//         <option key={opt} value={opt}>{opt}</option>
//       ))}
//     </select>
//   </div>
// );


type OptionType = string | { value: string; label: string };

interface SelectInputProps<T extends OptionType> {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: T[];
  required?: boolean;
  bgColor?: string;
  isDark?: boolean;
}

export const SelectInput = <T extends OptionType>({
  label,
  value,
  onChange,
  options,
  required = false,
  bgColor,
  isDark = false,
}: SelectInputProps<T>) => {
  

  return (
  <div className="flex flex-col gap-2">
    <label
      className={`block text-sm font-medium mb-2 ${
        isDark ? "text-slate-300" : "text-gray-700"
      }`}
    >
      {label}
      {required && "*"}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      style={{ backgroundColor: bgColor }}
      className={`w-full px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm
        ${
          isDark
            ? "bg-slate-700 border-slate-600 text-slate-100"
            : "bg-white border-gray-300 text-gray-800"
        }`}
    >
      <option value="">Select...</option>

      {options.map((opt, i) => {
       
        const val = typeof opt === "string" ? opt : opt.value;
        const label = typeof opt === "string" ? opt : opt.label;
        return (
          <option key={i} value={val}>
            {label}
          </option>
        );
      })}
    </select>
  </div>
  )
};
