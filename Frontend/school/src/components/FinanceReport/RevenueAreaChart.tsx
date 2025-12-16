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
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>

        <Area
          type="monotone"
          dataKey="totalAmount"
          stroke="#3b82f6"
          fill="url(#areaColor)"
          strokeWidth={2}
          dot={false}
        />

        <XAxis dataKey="month" tick={{ fill: isDark ? "#9ca3af" : "#6b7280" }} />
        <YAxis hide />
        <Tooltip
          formatter={(value: number) => `₹${value.toLocaleString()}`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default RevenueAreaChart;
