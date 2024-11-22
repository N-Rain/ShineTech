"use client";
import { useEffect, useState } from "react";
import UserChart from "@/components/user/UserChart";
import DateFilter from "@/components/user/DateFilter";

export default function UserDashboard() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChartData = async (filters = {}) => {
    setLoading(true);
    const { year, month, day } = filters;

    // Xây dựng URL với query string
    let query = [];
    if (year) query.push(`year=${year}`);
    if (month) query.push(`month=${month}`);
    if (day) query.push(`day=${day}`);
    const queryString = query.length ? `?${query.join("&")}` : "";

    try {
      const response = await fetch(`/api/user/chart${queryString}`);
      const data = await response.json();
      setChartData(data.data);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData(); // Lấy dữ liệu ban đầu không có bộ lọc
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center text-danger vh-100 h1">
        LOADING...
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <p className="lead text-center">User Dashboard</p>
          <DateFilter onFilter={fetchChartData} />
          <UserChart chartData={chartData} />
        </div>
      </div>
    </div>
  );
}
