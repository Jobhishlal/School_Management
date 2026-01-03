import { useTheme } from "../layout/ThemeContext";

export const SummaryCard = ({ title, value }: any) => {
  const { isDark } = useTheme();

  const cardBg = isDark
    ? "bg-[#0f1419] border-gray-800 text-slate-100"
    : "bg-white border-gray-200 text-slate-900";

  return (
    <div className={`border rounded-lg p-4 transition-colors ${cardBg}`}>
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold">
        ₹{(value ?? 0).toLocaleString()}
      </h3>
    </div>
  );
};
