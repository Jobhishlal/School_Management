import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RevenueBarChart = ({ data, isDark }: any) => {
  const axisColor = isDark ? "#9ca3af" : "#6b7280";
  const barColor = isDark ? "#3b82f6" : "#60a5fa";
  const tooltipBg = isDark ? "#0f1419" : "#ffffff";
  const tooltipText = isDark ? "#e5e7eb" : "#111827";

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <XAxis
          dataKey="month"
          tick={{ fill: axisColor, fontSize: 12 }}
          axisLine={{ stroke: axisColor }}
        />
        <YAxis hide />

        <Tooltip
          contentStyle={{
            backgroundColor: tooltipBg,
            border: "none",
            borderRadius: "8px",
            color: tooltipText,
          }}
          formatter={(value: number) => `₹${value.toLocaleString()}`}
        />

        <Bar
          dataKey="totalAmount"
          fill={barColor}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RevenueBarChart;
