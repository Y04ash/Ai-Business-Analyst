// import React from 'react'
// import { useData } from '../context/DataContext'
// const ChartInsights = () => {
//         const {
//             data,
//           } = useData();
//   return (
//     <div>
//                     <div className="summary-container">
//                 {/* AOV Change */}
//                 <div className="summary-card">
//                     <h4>Average Order Value of this month</h4>
//                     <p className={data.aov_change >= 0 ? 'positive' : 'negative'}>
//                     {data.aov_change >= 0
//                         ? `+ ${data.aov_change.toFixed(2)}%`
//                         : `- ${Math.abs(data.aov_change).toFixed(2)}%`}
//                     </p>
//                 </div>

//                 {/* Sales Change */}
//                 <div className="summary-card">
//                     <h4>Total Sales of this month</h4>
//                     <p className={data.sales_change >= 0 ? 'positive' : 'negative'}>
//                     {data.sales_change >= 0
//                         ? `Increased by ${data.sales_change.toFixed(2)}%`
//                         : `Dropped by ${Math.abs(data.sales_change).toFixed(2)}%`}
//                     </p>
//                 </div>

//                 {/* Profit Margin Change */}
//                 {data.profit_margin_change !== null && (
//                     <div className="summary-card">
//                     <h4>Profit Margin of this month</h4>
//                     <p className={data.profit_margin_change >= 0 ? 'positive' : 'negative'}>
//                         {data.profit_margin_change >= 0
//                         ? `Increased by ${data.profit_margin_change.toFixed(2)}%`
//                         : `Dropped by ${Math.abs(data.profit_margin_change).toFixed(2)}%`}
//                     </p>
//                     </div>
//                 )}
//                 </div>
//     </div>
//   )
// }

// export default ChartInsights

import React from 'react';
// import { useData } from '../context/ResultContext';
import '../index.css'
import { useResultContext } from '../context/ResultContext';
import '../css/chartInsights.css'
const ChartInsights = () => {
  
    const { data } = useResultContext();

  // Get the latest values from arrays
  const latestRevenue = data.preprocessed_data.monthly_revenue?.slice(-1)[0]["total_revenue"] || 0;
  const latestAOV = data.preprocessed_data.avg_order_value?.slice(-1)[0]["avg_order_value"] || 0;
  const latestProfitMargin = data.preprocessed_data.profit_margin_last|| 0;
  // console.log(latestRevenue)
  return (
    <div className="summary-container">
      
      {/* Total Revenue */}
      <div className="summary-card" >
        <h3 >Total Revenue this Month</h3>
        <h2 >₹{latestRevenue.toLocaleString()}</h2>
        <p className={data.preprocessed_data.sales_change >= 0 ? 'positive' : 'negative'} >
        {data.sales_change >= 0
            ? `▲ Increased by ${data.preprocessed_data.sales_change.toFixed(2)}%`
            : `▼ Dropped by ${Math.abs(data.preprocessed_data.sales_change).toFixed(2)}%`}
        </p>
      </div>

      {/* Average Order Value */}
      <div className="summary-card" >
        <h3 >Average Order Value this Month</h3>
        <h2 >₹{latestAOV.toLocaleString()}</h2>
        <p className={data.preprocessed_data.aov_change >= 0 ? 'positive' : 'negative'} >
          {data.aov_change >= 0
            ? `▲ Increased by ${data.preprocessed_data.aov_change.toFixed(2)}%`
            : `▼ Dropped by ${Math.abs(data.preprocessed_data.aov_change).toFixed(2)}%`}
        </p>
      </div>

      {/* Profit Margin Change */}
      {data.monthly_profit!== null && (
        <div className="summary-card">
          <h3 >Profit Margin this Month</h3>
          <h2 >{latestProfitMargin.toLocaleString()}% </h2> {/* You can add actual margin if you have */}
          <p className={data.preprocessed_data.profit_margin_change >= 0 ? 'positive' : 'negative'} >
            {data.profit_margin_change >= 0
              ? `▲ Increased by ${data.preprocessed_data.profit_margin_change.toFixed(2)}%`
              : `▼ Dropped by ${Math.abs(data.preprocessed_data.profit_margin_change).toFixed(2)}%`}
          </p>
        </div>
      )}
      
    </div>
  );
};

export default ChartInsights;
