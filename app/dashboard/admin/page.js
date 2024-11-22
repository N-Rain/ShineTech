"use client";
import AdminChart from "@/components/admin/AdminChart";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    year: "",
    month: "",
  });

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.year && { year: filters.year }),
        ...(filters.month && { month: filters.month }),
      });
      const response = await fetch(
        `${process.env.API}/admin/chart?${queryParams.toString()}`
      );
      const data = await response.json();
      setRevenueData(data);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchRevenueData();
  };

  const handleClearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      year: "",
      month: "",
    });
    setRevenueData(null);
  };

  const isMonthSelectedWithoutYear = filters.month && !filters.year;

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-lg-8 offset-lg-2">
          <h2 className="text-center mb-4">Revenue Dashboard</h2>
          <form
            onSubmit={handleFilterSubmit}
            className="row g-3 p-3 border rounded shadow-sm bg-light"
          >
            <div className="col-md-6">
              <label htmlFor="startDate" className="form-label">
                Start Date:
              </label>
              <input
                type="date"
                name="startDate"
                id="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="form-control"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="endDate" className="form-label">
                End Date:
              </label>
              <input
                type="date"
                name="endDate"
                id="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="form-control"
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="year" className="form-label">
                Year:
              </label>
              <input
                type="number"
                name="year"
                id="year"
                value={filters.year}
                onChange={handleFilterChange}
                className="form-control"
                min="2000"
                max="2100"
                placeholder="YYYY"
                disabled={isMonthSelectedWithoutYear}
              />
              {isMonthSelectedWithoutYear && (
                <small className="text-danger">
                  Please select a year when choosing a month.
                </small>
              )}
            </div>
            <div className="col-md-6">
              <label htmlFor="month" className="form-label">
                Month:
              </label>
              <input
                type="number"
                name="month"
                id="month"
                value={filters.month}
                onChange={handleFilterChange}
                className="form-control"
                min="1"
                max="12"
                placeholder="MM"
              />
            </div>

            <div className="col-12 d-flex justify-content-end gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isMonthSelectedWithoutYear && !filters.year}
              >
                Filter
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClearFilters}
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center text-danger vh-100 h1">
          LOADING...
        </div>
      ) : (
        <div className="row">
          <div className="col">
            {revenueData && <AdminChart revenueData={revenueData} />}
          </div>
        </div>
      )}
    </div>
  );
}
