import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface TextInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  className?: string;
  isDark?: boolean;
  min?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
  className = "",
  isDark = false,
  min,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";

  return (
    <div className="flex flex-col gap-2">
      <label
        className={`block text-sm font-medium mb-1 ${isDark ? "text-slate-300" : "text-gray-700"}`}
      >
        {label}{required && "*"}
      </label>
      <div className="relative">
        <input
          type={isPasswordType && showPassword ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          min={min}
          className={`w-full px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm
            ${isDark
              ? "bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400"
              : "bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500"
            } 
            ${isPasswordType ? "pr-10" : ""}
            ${className}`}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};
