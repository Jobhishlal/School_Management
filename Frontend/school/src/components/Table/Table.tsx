// import React from "react";

// export interface Column<T> {
//   label: string;
//   key?: keyof T; 
//   render?: (row: T, index: number) => React.ReactNode; 
//   className?: string;
// }

// interface TableProps<T> {
//   columns: Column<T>[];
//   data: T[];
//   actions?: (item: T) => React.ReactNode;
//   isDark?: boolean;
// }


// export const Table = <T extends { id?: string | number; _id?: string | number }>({
//   columns,
//   data,
//   actions,
//   isDark = false,
// }: TableProps<T>) => {
//   const textSecondary = isDark ? "#94a3b8" : "#64748b";
//   const borderColor = isDark ? "#374151" : "#e2e8f0";
//   const bgCard = isDark ? "#1e293b" : "#ffffff";

//   return (
//     <div className="overflow-x-auto rounded-lg" style={{ backgroundColor: bgCard }}>
//       <table className="w-full border-collapse">
//         <thead style={{ borderBottomColor: borderColor }} className="border-b">
//           <tr>
//             {columns.map((col) => (
//               <th
//                 key={col.label}
//                 className={`px-4 py-3 text-left font-semibold text-sm ${col.className || ""}`}
//                 style={{ color: textSecondary }}
//               >
//                 {col.label}
//               </th>
//             ))}
//             {actions && (
//               <th className="px-4 py-3 text-center font-semibold text-sm" style={{ color: textSecondary }}>
//                 Actions
//               </th>
//             )}
//           </tr>
//         </thead>

//         <tbody>
//           {data.map((item, index) => (
//             <tr
//               key={item._id || item.id || index}
//               className={`border-b last:border-b-0 hover:opacity-80 transition-opacity`}
//               style={{ borderBottomColor: borderColor }}
//             >
//               {columns.map((col) => (
//                 <td key={col.label} className={`px-4 py-3 ${col.className || ""}`}>
//                   {col.render ? col.render(item, index) : (col.key ? (item[col.key] as React.ReactNode) : null)}
//                 </td>
//               ))}

//               {actions && <td className="px-4 py-3 text-center">{actions(item)}</td>}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export { Column };


import React from "react";

export interface Column<T> {
  label: string;
  key?: keyof T | string; 
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  actions?: (item: T) => React.ReactNode;
  isDark?: boolean;
}


export const Table = <T extends Record<string, any>>({
  columns,
  data,
  actions,
  isDark = false,
}: TableProps<T>) => {
  const textSecondary = isDark ? "#94a3b8" : "#64748b";
  const borderColor = isDark ? "#374151" : "#e2e8f0";
  const bgCard = isDark ? "#1e293b" : "#ffffff";

  return (
    <div className="overflow-x-auto rounded-lg" style={{ backgroundColor: bgCard }}>
      <table className="w-full border-collapse">
        <thead style={{ borderBottomColor: borderColor }} className="border-b">
          <tr>
            {columns.map((col) => (
              <th
                key={col.label}
                className={`px-4 py-3 text-left font-semibold text-sm ${col.className || ""}`}
                style={{ color: textSecondary }}
              >
                {col.label}
              </th>
            ))}
            {actions && (
              <th className="px-4 py-3 text-center font-semibold text-sm" style={{ color: textSecondary }}>
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr
              key={item._id || item.id || index}
              className="border-b last:border-b-0 hover:opacity-80 transition-opacity"
              style={{ borderBottomColor: borderColor }}
            >
              {columns.map((col) => (
                <td key={col.label} className={`px-4 py-3 ${col.className || ""}`}>
                  {col.render
                    ? col.render(item, index)
                    : col.key
                    ? (item[col.key as keyof T] as React.ReactNode)
                    : null}
                </td>
              ))}

              {actions && <td className="px-4 py-3 text-center">{actions(item)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { Column };

