import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RevenueBarChart = ({ data, isDark }: any) => {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <Bar
          dataKey="totalAmount"
          fill={isDark ? "#374151" : "#e5e7eb"}
          radius={[4, 4, 0, 0]}
        />
        <XAxis dataKey="month" />
        <YAxis hide />
        <Tooltip />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RevenueBarChart;
