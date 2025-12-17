import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: any[];
  isDark: boolean;
}

const RevenueAreaChart: React.FC<Props> = ({ data, isDark }) => {
  const axisColor = isDark ? "#9ca3af" : "#6b7280";
  const tooltipBg = isDark ? "#0f1419" : "#ffffff";
  const tooltipText = isDark ? "#e5e7eb" : "#111827";
  const strokeColor = "#3b82f6";

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4} />
            <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
          </linearGradient>
        </defs>

        <XAxis
          dataKey="month"
          tick={{ fill: axisColor, fontSize: 12 }}
          axisLine={{ stroke: axisColor }}
        />

        <YAxis hide />

        <Tooltip
          contentStyle={{
            backgroundColor: tooltipBg,
            borderRadius: "8px",
            border: "none",
            color: tooltipText,
          }}
          labelStyle={{ color: tooltipText }}
          formatter={(value: number) => `₹${value.toLocaleString()}`}
        />

        <Area
          type="monotone"
          dataKey="totalAmount"
          stroke={strokeColor}
          fill="url(#areaColor)"
          strokeWidth={2}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default RevenueAreaChart;
