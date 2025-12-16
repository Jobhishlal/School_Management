export const SummaryCard = ({ title, value }: any) => (
  <div className="border rounded-lg p-4">
    <p className="text-sm text-gray-500">{title}</p>
    <h3 className="text-2xl font-bold">
      ₹{(value ?? 0).toLocaleString()}
    </h3>
  </div>
);