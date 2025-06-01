

import React, { createContext, useContext, useState } from 'react';

const ResultContext = createContext();
import '../index.css'
export const ResultProvider = ({ children }) => {
  const [data, setData] = useState({});
  const [selectedYear, setSelectedYear] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [chartType, setChartType] = useState("bar");
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [hasCustomers, setHasCustomers] = useState(false);
  const [hasProfit, setHasProfit] = useState(false);
  const [hasCategoryRevenueByMonth, setHasCategoryRevenueByMonth] = useState(false);

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  return (
    <ResultContext.Provider
      value={{
        data,
        setData,
        selectedYear,
        setSelectedYear,
        availableYears,
        setAvailableYears,
        chartType,
        setChartType,
        selectedMonth,
        setSelectedMonth,
        hasCustomers,
        setHasCustomers,
        hasProfit,
        setHasProfit,
        months,
        hasCategoryRevenueByMonth,
        setHasCategoryRevenueByMonth,
      }}
    >
      {children}
    </ResultContext.Provider>
  );
};

export const useResultContext = () => {
  const context = useContext(ResultContext);
  if (!context) {
    throw new Error("useResultContext must be used within a ResultProvider");
  }
  return context;
};
