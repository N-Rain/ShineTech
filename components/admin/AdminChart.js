// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import Link from "next/link";

// export default function AdminChart({ chartData }) {
//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col">
//           <ResponsiveContainer width="95%" height={400}>
//             <BarChart width={1000} height={300} data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="label" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar
//                 dataKey="count"
//                 fill="rgba(75, 192, 192, 0.6)"
//                 shape={(props) => (
//                   <Link href={props.url}>
//                     <rect {...props} />
//                   </Link>
//                 )}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// }
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { format } from "date-fns";

export default function AdminChart({ chartData }) {
  // Set up colors for the bars in the chart
  const colors = ["#1E90FF", "#32CD32", "#FF6347", "#FFD700", "#6A5ACD"];

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart width={1000} height={400} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />

              {/* X-Axis: Hiển thị ngày tháng theo định dạng mong muốn */}
              <XAxis
                dataKey="label"
                tickFormatter={(value) => {
                  if (value.includes("-W")) {
                    // Tuần
                    const [year, week] = value.split("-W");
                    return `Tuần ${week}, ${year}`;
                  }
                  if (value.includes("-")) {
                    // Ngày
                    const [year, month, day] = value.split("-");
                    return `${day}/${month}/${year}`;
                  }
                  return value;
                }}
                angle={-45}
                textAnchor="end"
                style={{ fontSize: "12px", fill: "#666" }}
              />

              <YAxis
                tickFormatter={(value) =>
                  `₫${new Intl.NumberFormat().format(value)}`
                }
                style={{ fontSize: "12px", fill: "#666" }}
              />

              <Tooltip
                formatter={(value) =>
                  `₫${new Intl.NumberFormat().format(value)}`
                }
                labelFormatter={(label) => `Ngày: ${label}`}
                contentStyle={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />

              {/* Bar series */}
              <Bar dataKey="totalRevenue">
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
