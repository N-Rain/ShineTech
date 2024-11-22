import React, { useState } from "react";

export default function DateFilter({ onFilter }) {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  const handleFilter = () => {
    onFilter({ year, month, day });
  };

  // Tạo danh sách năm, tháng, ngày
  const getYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => currentYear - i); // 10 năm trở lại
  };

  const getMonths = () => Array.from({ length: 12 }, (_, i) => i + 1);

  const getDays = () => {
    const daysInMonth = new Date(year || new Date().getFullYear(), month || 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  return (
    <div className="date-filter">
      <div className="row">
        {/* Dropdown chọn năm */}
        <div className="col">
          <select
            className="form-select"
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              setMonth(""); // Reset tháng và ngày nếu năm thay đổi
              setDay("");
            }}
          >
            <option value="">Select Year</option>
            {getYears().map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown chọn tháng (chỉ bật nếu đã chọn năm) */}
        <div className="col">
          <select
            className="form-select"
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
              setDay(""); // Reset ngày nếu tháng thay đổi
            }}
            disabled={!year}
          >
            <option value="">Select Month</option>
            {getMonths().map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown chọn ngày (chỉ bật nếu đã chọn năm và tháng) */}
        <div className="col">
          <select
            className="form-select"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            disabled={!year || !month}
          >
            <option value="">Select Day</option>
            {getDays().map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Nút lọc */}
        <div className="col">
          <button
            className="btn btn-primary"
            onClick={handleFilter}
            disabled={!year} // Nút chỉ bật nếu có năm
          >
            Filter
          </button>
        </div>
      </div>
    </div>
  );
}
