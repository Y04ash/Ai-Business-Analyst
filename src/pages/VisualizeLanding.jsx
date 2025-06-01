import React, { useState, useEffect } from "react";

import {
  LineChart,
  BarChart,
  AreaChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import '../index.css'
import "../css/visualizeLanding.css"; // Import custom CSS
// import { useData } from "../context/ResultContext";
import ChartInsights from "../components/ChartInsights";
import { useResultContext } from '../context/ResultContext';
const VisualizeLanding = () => {

  const { data,selectedYear,
    setSelectedYear,
    availableYears,
    chartType,
    setChartType,
    selectedMonth,
    setSelectedMonth,
    hasCustomers,
    hasProfit,
    months,
    hasCategoryRevenueByMonth,
    setAvailableYears,
    setHasProfit,
    setHasCategoryRevenueByMonth, } = useResultContext();
const [segmentationData,setSegmentationData] = useState([])
      
  // useEffect(() => {
  //   if (!data || !data.preprocessed_data?.monthly_revenue) return;
  
  //   const newYears = Array.from(
  //     new Set(data.preprocessed_data.monthly_revenue.map((item) => item.year))
  //   );
  
  //   // Avoid setting state if values didn't change
  //   const yearsChanged = newYears.length !== availableYears.length ||
  //     newYears.some((year, idx) => year !== availableYears[idx]);
  
  //     if (yearsChanged) {
  //       setAvailableYears(newYears);
  //       if (selectedYear !== newYears[newYears.length - 1]) {
  //         setSelectedYear(newYears[newYears.length - 1]);
  //       }
  //     }
  
  //   setHasProfit(!!data.preprocessed_data.monthly_profit);
  //   setHasCategoryRevenueByMonth(!!data.preprocessed_data.category_revenue_by_month);
  // }, [data.preprocessed_data]);
  
  useEffect(() => {
    if (!data || !data.preprocessed_data?.monthly_revenue) return;
  
    const newYears = Array.from(
      new Set(data.preprocessed_data.monthly_revenue.map((item) => item.year))
    );
  
    const yearsChanged = newYears.length !== availableYears.length ||
      newYears.some((year, idx) => year !== availableYears[idx]);
  
    if (yearsChanged) {
      setAvailableYears(newYears);
    }
  
    // Only update selected year if it's different
    const latestYear = newYears[newYears.length - 1];
    if (selectedYear !== latestYear) {
      setSelectedYear(latestYear);
    }
  
    // Avoid unnecessary updates
    const profitExists = !!data.preprocessed_data.monthly_profit;
    if (profitExists !== hasProfit) {
      setHasProfit(profitExists);
    }
  
    const hasCategory = !!data.preprocessed_data.category_revenue_by_month;
    if (hasCategory !== hasCategoryRevenueByMonth) {
      setHasCategoryRevenueByMonth(hasCategory);
    }

    if(data.preprocessed_data?.customer_segmentation){
      const temp = [
        {
          name: "Repeat Customers",
          value: data.preprocessed_data.customer_segmentation.repeat_customers,
        },
        {
          name: "New Customers",
          value: data.preprocessed_data.customer_segmentation.new_customers,
        },
      ]
      setSegmentationData(temp)
    }else{
      setSegmentationData([])
    }
    
  }, [data]); // ✅ ONLY `data`
  
  

  const COLORS = ["#3498db", "#e74c3c"]; // Blue for repeat, Red for new
  const getChartElement = (key, color) => {
    switch (chartType) {
      case "bar":
        return <Bar dataKey={key} fill={color} />;
      case "area":
        return (
          <Area type="monotone" dataKey={key} stroke={color} fill={color} />
        );
      default:
        return <Line type="monotone" dataKey={key} stroke={color} />;
    }
  };

  const renderChart = (dataset, dataKey, color, xKey = "month") => {
    if (!dataset || dataset.length === 0) return null;

    const ChartComponent = {
      line: LineChart,
      bar: BarChart,
      area: AreaChart,
    }[chartType];

    const GraphElement = getChartElement(dataKey, color);

    return (
      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent data={dataset}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {GraphElement}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  const getYearlyData = (key) => {
    if (!data.preprocessed_data || !data.preprocessed_data[key]) return [];
    return data.preprocessed_data[key].filter((item) => item.year === selectedYear);
  };

  const getMonthlyGroupData = (sourceKey) => {
    if (!data.preprocessed_data || !data.preprocessed_data[sourceKey]) return [];
    return Object.entries(data.preprocessed_data[sourceKey])
      .filter(([month]) => month.startsWith(`${selectedYear}-${selectedMonth}`))
      .flatMap(([_, items]) => items);
  };

  const topProduct = getMonthlyGroupData("top_selling_products_by_month")?.[0];
  const underperformingProduct = getMonthlyGroupData(
    "top_selling_products_by_month"
  )?.slice(-1)?.[0];

  const topRegion = getMonthlyGroupData("region_sales_by_month")?.[0];
  const underperformingRegion = getMonthlyGroupData(
    "region_sales_by_month"
  )?.slice(-1)?.[0];

  const topCategory = getMonthlyGroupData("category_revenue_by_month")?.[0];
  const underperformingCategory = getMonthlyGroupData(
    "category_revenue_by_month"
  )?.slice(-1)?.[0];
  if (!data.preprocessed_data) return <div className="dashboard-loading">Loading data...</div>;

  return (
    // <div className="dashboard-container">
    <>
      <h1 className="dashboard-title">Business Sales Analytics Dashboard</h1>
      <p className="dashboard-subtitle">
        Visualize key metrics to make data-driven decisions
      </p>

      {/* insights */}
      <ChartInsights />

      <div className="dashboard-controls">
        <div className="year-buttons">
          {availableYears.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`year-button ${selectedYear === year ? "active" : ""}`}
            >
              {year}
            </button>
          ))}
        </div>

        <div className="chart-type-buttons">
          {["line", "bar", "area"].map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`chart-button ${chartType === type ? "active" : ""}`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="month-dropdown">
          <span
            style={{ fontSize: "1.2rem", color: "#6b7280", fontWeight: "bold" }}
          >
            Month:{" "}
          </span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

{/* yearly data */}
<h2 className="section-title">Yearly Data</h2>
      <div className="pie-revenue">
        {segmentationData.length > 0 && (
          <div className="chart-card pie-chart">
            <h3>Customer Segmentation</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={segmentationData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {segmentationData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        <div
          className={`chart-card revenue-chart ${
            !hasCustomers ? "full-width" : ""
          }`}
        >
          <h3>Monthly Revenue</h3>
          {renderChart(
            getYearlyData("monthly_revenue"),
            "total_revenue",
            "#3498DB"
          )}
        </div>
      </div>

      <div className="profit-aov">
        {/* AOV */}
        <div
          className={`chart-card aov-chart ${!hasProfit ? "full-width" : ""}`}
        >
          <h3>Average Order Value</h3>
          {renderChart(
            getYearlyData("avg_order_value"),
            "avg_order_value",
            "#F39C12"
          )}
        </div>

        {/* Profit */}
        {hasProfit && (
          <div className="chart-card profit-chart">
            <h3>Monthly Profit</h3>
            {renderChart(getYearlyData("monthly_profit"), "profit", "#2ECC71")}
          </div>
        )}
      </div>
{/* month wise */}
<h2 className="section-title">Monthly Data</h2>
      <div className="chart-card">
          <h3>
          Top Selling Products (
            {months.find((m) => m.value === selectedMonth)?.label})
            </h3>
            {renderChart(
              getMonthlyGroupData("top_selling_products_by_month"),
              "quantity",
              "#E74C3C",
              "product_name"
              )}
              </div>

      <div className="charts-grid">
        {/* Region Chart */}
        <div
          className={`chart-card region-chart ${
            !hasCategoryRevenueByMonth ? "full-width" : ""
          }`}
        >
          <h3>
            Revenue by Region (
            {months.find((m) => m.value === selectedMonth)?.label})
          </h3>
          {renderChart(
            getMonthlyGroupData("region_sales_by_month"),
            "total_revenue",
            "#1ABC9C",
            "region"
          )}
        </div>
        {/* Category Chart */}
        {hasCategoryRevenueByMonth && (
          <div className="chart-card category-chart">
            <h3>
              Revenue by Category (
              {months.find((m) => m.value === selectedMonth)?.label})
            </h3>
            {renderChart(
              getMonthlyGroupData("category_revenue_by_month"),
              "total_revenue",
              "#9B59B6",
              "product_category"
            )}
          </div>
        )}
      </div>

      {/* top under performer */}
      <div className="dashboard-section">
        <h2 className="section-title">Performance Highlights (Monthly)</h2>
        <div className="performance-grid">
          {/* Products */}
          <div className="product-summary-card topperformering">
            <h3>Top Performing Product</h3>
            {topProduct ? (
              <div className="product-summary">
                <strong>{topProduct.product_name}</strong>
                <p>Quantity Sold: {topProduct.quantity}</p>
              </div>
            ) : (
              <p>No data available</p>
            )}

            <h3>Top Performing Region</h3>
            {topRegion ? (
              <div className="product-summary">
                <strong>{topRegion.region}</strong>
                <p>Revenue: ₹{topRegion.total_revenue.toLocaleString()}</p>
              </div>
            ) : (
              <p>No data available</p>
            )}
            <h3>Top Performing Category</h3>
            {topCategory ? (
              <div className="product-summary">
                <strong>{topCategory.product_category}</strong>
                <p>Revenue: ₹{topCategory.total_revenue.toLocaleString()}</p>
              </div>
            ) : (
              <p>No data available</p>
            )}
          </div>
          <div className="product-summary-card underperforming">
            <h3>Underperforming Product</h3>
            {underperformingProduct ? (
              <div className="product-summary">
                <strong>{underperformingProduct.product_name}</strong>
                <p>Quantity Sold: {underperformingProduct.quantity}</p>
              </div>
            ) : (
              <p>No data available</p>
            )}

            <h3>Underperforming Region</h3>
            {underperformingRegion ? (
              <div className="product-summary">
                <strong>{underperformingRegion.region}</strong>
                <p>
                  Revenue: ₹
                  {underperformingRegion.total_revenue.toLocaleString()}
                </p>
              </div>
            ) : (
              <p>No data available</p>
            )}

            <h3>Underperforming Category</h3>
            {underperformingCategory ? (
              <div className="product-summary">
                <strong>{underperformingCategory.product_category}</strong>
                <p>
                  Revenue: ₹
                  {underperformingCategory.total_revenue.toLocaleString()}
                </p>
              </div>
            ) : (
              <p>No data available</p>
            )}
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default VisualizeLanding;

//  new code
// import React from "react";
// import {
//   LineChart,
//   BarChart,
//   AreaChart,
//   Line,
//   Bar,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   PieChart, Pie, Cell
// } from "recharts";
// import "../css/visualizeLanding.css";
// import { useData } from "../context/DataContext";
// import ChartInsights from "../components/ChartInsights";

// const VisualizeLanding = () => {
//   const {
//     data,
//     selectedYear,
//     setSelectedYear,
//     availableYears,
//     chartType,
//     setChartType,
//     selectedMonth,
//     setSelectedMonth,
//     hasCustomers,
//     hasProfit,
//     months,
//     hasCategoryRevenueByMonth,
//   } = useData();
//   // Fetch region & category top/bottom
//   // console.log(data)
//   const segmentationData = [
//     {
//       name: "Repeat Customers",
//       value: data.customer_segmentation.repeat_customers,
//     },
//     { name: "New Customers", value: data.customer_segmentation.new_customers },
//   ];
//   const COLORS = ["#3498db", "#e74c3c"]; // Blue for repeat, Red for new
//   const getChartElement = (key, color) => {
//     switch (chartType) {
//       case "bar":
//         return <Bar dataKey={key} fill={color} />;
//       case "area":
//         return (
//           <Area type="monotone" dataKey={key} stroke={color} fill={color} />
//         );
//       default:
//         return <Line type="monotone" dataKey={key} stroke={color} />;
//     }
//   };

//   const renderChart = (dataset, dataKey, color, xKey = "month") => {
//     if (!dataset || dataset.length === 0) return null;
//     const ChartComponent = { line: LineChart, bar: BarChart, area: AreaChart }[
//       chartType
//     ];
//     const GraphElement = getChartElement(dataKey, color);

//     return (
//       <ResponsiveContainer width="100%" height={300}>
//         <ChartComponent data={dataset}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey={xKey} />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           {GraphElement}
//         </ChartComponent>
//       </ResponsiveContainer>
//     );
//   };

//   const getYearlyData = (key) => {
//     if (!data || !data[key]) return [];
//     return data[key].filter((item) => item.year === selectedYear);
//   };

//   const getMonthlyGroupData = (sourceKey) => {
//     if (!data || !data[sourceKey]) return [];
//     return Object.entries(data[sourceKey])
//       .filter(([month]) => month.startsWith(`${selectedYear}-${selectedMonth}`))
//       .flatMap(([_, items]) => items);
//   };

//   const topProduct = getMonthlyGroupData("top_selling_products_by_month")?.[0];
//   const underperformingProduct = getMonthlyGroupData(
//     "top_selling_products_by_month"
//   )?.slice(-1)?.[0];

//   const topRegion = getMonthlyGroupData("region_sales_by_month")?.[0];
//   const underperformingRegion = getMonthlyGroupData(
//     "region_sales_by_month"
//   )?.slice(-1)?.[0];

//   const topCategory = getMonthlyGroupData("category_revenue_by_month")?.[0];
//   const underperformingCategory = getMonthlyGroupData(
//     "category_revenue_by_month"
//   )?.slice(-1)?.[0];

//   if (!data) return <div className="dashboard-loading">Loading data...</div>;

//   return (
//     <>
//       <h1 className="dashboard-title">Business Sales Analytics Dashboard</h1>
//       <p className="dashboard-subtitle">
//         Visualize key metrics to make better data-driven decisions
//       </p>

//       <ChartInsights />

//       <div className="dashboard-controls">
//         <div className="year-buttons">
//           {availableYears.map((year) => (
//             <button
//               key={year}
//               onClick={() => setSelectedYear(year)}
//               className={`year-button ${selectedYear === year ? "active" : ""}`}
//             >
//               {year}
//             </button>
//           ))}
//         </div>

//         <div className="chart-type-buttons">
//           {["line", "bar", "area"].map((type) => (
//             <button
//               key={type}
//               onClick={() => setChartType(type)}
//               className={`chart-button ${chartType === type ? "active" : ""}`}
//             >
//               {type.toUpperCase()}
//             </button>
//           ))}
//         </div>

//         <div className="month-dropdown">
//           <span className="month-label">Month: </span>
//           <select
//             value={selectedMonth}
//             onChange={(e) => setSelectedMonth(e.target.value)}
//           >
//             {months.map(({ value, label }) => (
//               <option key={value} value={value}>
//                 {label}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="dashboard-section">
//       <div className="charts-grid">
//         {/* <div className="section-title">📈 Yearly Performance Overview</div> */}
//         {/* pie chart */}
//         <div className="chart-card">
//           <h3>Customer Segmentation</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={segmentationData}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={100}
//                 fill="#8884d8"
//                 label
//               >
//                 {segmentationData.map((entry, index) => (
//                   <Cell
//                     key={`cell-${index}`}
//                     fill={COLORS[index % COLORS.length]}
//                   />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//         </div>
//         </div>

//         <div className="dashboard-section">
//         <h2 className="section-title">Yearly Overview</h2>
//         <div className="charts-grid">
//           <div className="chart-card">
//             <h3>Monthly Revenue</h3>
//             {renderChart(
//               getYearlyData("monthly_revenue"),
//               "total_revenue",
//               "#3498DB"
//             )}
//           </div>
//           {hasProfit && (
//             <div className="chart-card">
//               <h3>Monthly Profit</h3>
//               {renderChart(
//                 getYearlyData("monthly_profit"),
//                 "profit",
//                 "#2ECC71"
//               )}
//             </div>
//           )}
//           <div className="chart-card">
//             <h3>Average Order Value</h3>
//             {renderChart(
//               getYearlyData("avg_order_value"),
//               "avg_order_value",
//               "#F39C12"
//             )}
//           </div>
//         </div>
//         </div>

//         <div className="dashboard-section">
//         <h2 className="section-title">Monthly Deep Dive</h2>
//         <div className="charts-grid">
//           <div className="chart-card">
//             <h3>
//               Top Selling Products (
//               {months.find((m) => m.value === selectedMonth)?.label})
//             </h3>
//             {renderChart(
//               getMonthlyGroupData("top_selling_products_by_month"),
//               "quantity",
//               "#E74C3C",
//               "product_name"
//             )}
//           </div>
//           <div className="chart-card">
//             <h3>
//               Revenue by Region (
//               {months.find((m) => m.value === selectedMonth)?.label})
//             </h3>
//             {renderChart(
//               getMonthlyGroupData("region_sales_by_month"),
//               "total_revenue",
//               "#1ABC9C",
//               "region"
//             )}
//           </div>
//           {hasCategoryRevenueByMonth && (
//             <div className="chart-card">
//               <h3>
//                 Revenue by Category (
//                 {months.find((m) => m.value === selectedMonth)?.label})
//               </h3>
//               {renderChart(
//                 getMonthlyGroupData("category_revenue_by_month"),
//                 "total_revenue",
//                 "#9B59B6",
//                 "product_category"
//               )}
//             </div>
//           )}
//         </div>
//         <div/>

//         <div className="dashboard-section">
//           <h2 className="section-title">Performance Highlights</h2>
//           <div className="performance-grid">
//             {/* Products */}
//             <div className="product-summary-card topperformering">
//               <h3>Top Performing Product</h3>
//               {topProduct ? (
//                 <div className="product-summary">
//                   <strong>{topProduct.product_name}</strong>
//                   <p>Quantity Sold: {topProduct.quantity}</p>
//                 </div>
//               ) : (
//                 <p>No data available</p>
//               )}

//               <h3>Top Performing Region</h3>
//               {topRegion ? (
//                 <div className="product-summary">
//                   <strong>{topRegion.region}</strong>
//                   <p>Revenue: ₹{topRegion.total_revenue.toLocaleString()}</p>
//                 </div>
//               ) : (
//                 <p>No data available</p>
//               )}
//                 <h3>Top Performing Category</h3>
//               {topCategory ? (
//                 <div className="product-summary">
//                   <strong>{topCategory.product_category}</strong>
//                   <p>Revenue: ₹{topCategory.total_revenue.toLocaleString()}</p>
//                 </div>
//               ) : (
//                 <p>No data available</p>
//               )}
//             </div>
//             <div className="product-summary-card underperforming">
//               <h3>Underperforming Product</h3>
//               {underperformingProduct ? (
//                 <div className="product-summary">
//                   <strong>{underperformingProduct.product_name}</strong>
//                   <p>Quantity Sold: {underperformingProduct.quantity}</p>
//                 </div>
//               ) : (
//                 <p>No data available</p>
//               )}

//               <h3>Underperforming Region</h3>
//               {underperformingRegion ? (
//                 <div className="product-summary">
//                   <strong>{underperformingRegion.region}</strong>
//                   <p>
//                     Revenue: ₹
//                     {underperformingRegion.total_revenue.toLocaleString()}
//                   </p>
//                 </div>
//               ) : (
//                 <p>No data available</p>
//               )}

//               <h3>Underperforming Category</h3>
//               {underperformingCategory ? (
//                 <div className="product-summary">
//                   <strong>{underperformingCategory.product_category}</strong>
//                   <p>
//                     Revenue: ₹
//                     {underperformingCategory.total_revenue.toLocaleString()}
//                   </p>
//                 </div>
//               ) : (
//                 <p>No data available</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default VisualizeLanding;
