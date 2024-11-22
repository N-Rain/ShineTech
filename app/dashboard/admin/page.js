// "use client";
// import { useEffect, useState } from "react";
// import AdminChart from "@/components/admin/AdminChart";

// export default function AdminDashboard() {
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchChartData();
//   }, []);

//   const fetchChartData = async () => {
//     try {
//       const response = await fetch(`${process.env.API}/admin/chart`);
//       const data = await response.json();

//       setChartData(data.data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching chart data:", error);
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center text-danger vh-100 h1">
//         LOADING...
//       </div>
//     );
//   }

//   return (
//     <div className="container">
//       <div className="row">
//         <div className="col">
//           <p className="lead text-center">Admin Dashboard</p>

//           <AdminChart chartData={chartData} />
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import AdminChart from "@/components/admin/AdminChart";
import moment from "moment";

export default function AdminDashboard() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(""); // Time period for stats
  const [type, setType] = useState("day"); // Statistics type: day, month, year, week

  useEffect(() => {
    if (period && type) {
      fetchChartData(period, type);
    }
  }, [period, type]);
  
  const fetchChartData = async (period, type) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.API}/admin/chart?period=${period}&type=${type}`);
      const data = await response.json();
      setChartData(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <p className="lead text-center">Admin Dashboard</p>
          
          {/* Choose the statistics type */}
          <div className="mb-3">
            <label htmlFor="type" className="form-label">Chọn kiểu thống kê:</label>
            <select
              id="type"
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="day">Ngày</option>
              <option value="month">Tháng</option>
              <option value="year">Năm</option>
              <option value="week">Tuần</option> {/* New option for week */}
            </select>
          </div>

          {/* Choose the period */}
          <div className="mb-3">
            <label htmlFor="period" className="form-label">Chọn thời gian:</label>
            {type === "day" && (
              <input
                type="date"
                id="period"
                className="form-control"
                onChange={(e) => setPeriod(e.target.value)}
              />
            )}
            {type === "month" && (
              <input
                type="month"
                id="period"
                className="form-control"
                onChange={(e) => setPeriod(e.target.value)}
              />
            )}
            {type === "year" && (
              <input
                type="number"
                id="period"
                className="form-control"
                onChange={(e) => setPeriod(e.target.value)}
              />
            )}
            {type === "week" && (
              <input
                type="week"
                id="period"
                className="form-control"
                onChange={(e) => setPeriod(e.target.value)}
              />
            )}
          </div>

          {/* Display chart if data is available */}
          {loading ? (
            <div className="d-flex justify-content-center align-items-center text-danger vh-100 h1">
              LOADING...
            </div>
          ) : (
            <AdminChart chartData={chartData} />
          )}
        </div>
      </div>
    </div>
  );
}
