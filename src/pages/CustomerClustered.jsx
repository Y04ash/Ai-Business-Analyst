// import React, { useState, useEffect } from "react";
// import CustomerClusterGraph from "../components/CustomerClusterGraph";
// import "../css/customerClustered.css";
// import { useData } from "../context/DataContext";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
// const CustomerClustered = () => {
//   const {data,hasCustomers,setHasCustomers} = useData()
//   const [clusterDetails, setClusterDetails] = useState([]);
//   const [clusterDescriptions, setClusterDescriptions] = useState({}); // <-- Change to {}
//   const [rawData,setRawData] = useState([])
//   // const [hasCustomers, setHasCustomers] = useState(false);
//   // useEffect(() => {
//   //   // Fetch cluster data and descriptions
//   //   fetch("ml/customer_interest_clusters.json")
//   //     .then((res) => res.json())
//   //     .then((data) => {
//   //       if (data[0]?.message === "No Customer Details Found") {
//   //         setHasCustomers(false);
//   //       } else {

//   //         console.log("from cc",hasCustomers)
//   //         const clusterInfo = data.reduce((acc, entry) => {
//   //           const cluster = entry.cluster;
//   //           if (!acc[cluster]) acc[cluster] = [];
//   //           acc[cluster].push(entry);
//   //           return acc;
//   //         }, {});
//   //         setClusterDetails(clusterInfo);
//   //         setHasCustomers(true);
//   //         console.log(clusterInfo);
//   //       }
//   //     });

//   //   if (hasCustomers) {
//   //     fetch("ml/cluster_descriptions.json")
//   //       .then((res) => res.json())
//   //       .then((data) => {
//   //         setClusterDescriptions(data); // It’s an object
//   //       });
//   //   }
//   // }, []);

//   useEffect(() => {
//       fetch('ml/customer_interest_clusters.json')
//         .then(res => res.json())
//         .then(data => {
//           if (data[0]?.message === "No Customer Details Found") {
//                     setHasCustomers(false);
//           }
//           else{
//             setRawData(data);
//             setHasCustomers(true)
//             // Count customers per cluster
//             const clusterCount = {};
//             data.forEach(entry => {
//               const cluster = entry.cluster;
//               clusterCount[cluster] = (clusterCount[cluster] || 0) + 1;
//             });

//             const formattedData = Object.entries(clusterCount).map(([cluster, count]) => ({
//               cluster: `Cluster ${cluster}`,
//               customers: count
//             }));
//             setClusterDetails(formattedData);
//           }

//         });
//         if (hasCustomers) {
//               fetch("ml/cluster_descriptions.json")
//                 .then((res) => res.json())
//                 .then((data) => {
//                   setClusterDescriptions(data); // It’s an object
//                 });
//             }
//     }, []);
//     const handleExportCSV = () => {
//       const headers = ['customer_id,cluster'];
//       const rows = clusterDetails.map(entry => `${entry.customer_id},${entry.cluster}`);
//       const csvContent = [headers, ...rows].join('\n');

//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = 'customer_clusters.csv';
//       a.click();
//       URL.revokeObjectURL(url);}

//   return (
//     <div className="customer-clustered-page">
//       <h2>Customer Clustering and Segmentation</h2>
//       {
//         hasCustomers ?
//         <>
//         <p>
//           <strong>Clustering Methodology:</strong>
//         </p>
//         <p>
//           Customers have been segmented based on their purchasing behavior and the
//           product categories they frequently purchase. The clustering algorithm
//           (KMeans) groups customers with similar buying patterns into distinct
//           clusters.
//         </p>

//         {/* graph */}
//         {/* <CustomerClusterGraph clusterDetails={clusterDetails} clusterDescriptions={clusterDescriptions}/> */}

//         {/*  */}
//         <div className="chart-card">

//               <h3>Customer Segments by Interest (Clustering)</h3><button onClick={handleExportCSV} className="export-button">⬇️ Export CSV</button>
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={clusterDetails}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="cluster" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="customers" fill="#3498db" />
//                 </BarChart>
//               </ResponsiveContainer>

//             </div>

//             {/*  */}

//         <div className="cluster-explanation">
//           <h3>Cluster Breakdown:</h3>
//           {Object.keys(clusterDescriptions).map((cluster) => (
//             <div key={cluster} className="cluster-item">
//               <h4>{`Cluster ${cluster}`}</h4>
//               <p>{clusterDescriptions[cluster]}</p>
//             </div>
//           ))}
//         </div>

//         </>:
//         <>
//         <p>No Customer Details Found</p>
//         <p>Add customer_id and product_category in the data to bundle the customers according to their interest</p>
//         </>
//       }
//       </div>
//   );
// };

// export default CustomerClustered;

import React, { useState, useEffect } from "react";
import "../index.css";
import "../css/customerClustered.css";
// import { useData } from "../context/ResultContext";

import { useResultContext } from "../context/ResultContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { Button, Box } from "@mui/material";
const CustomerClustered = () => {
  const { data, setHasCustomers, hasCustomers } = useResultContext();
  const [clusterDetails, setClusterDetails] = useState([]);
  const [clusterDescriptions, setClusterDescriptions] = useState({});
  const [rawData, setRawData] = useState([]);

  // useEffect(() => {
  //   fetch('ml/customer_interest_clusters.json')
  //     .then(res => res.json())
  //     .then(data => {
  //       if (data[0]?.message === "No Customer Details Found") {
  //         setHasCustomers(false);
  //       } else {
  //         setRawData(data);
  //         setHasCustomers(true);

  //         // Aggregate cluster counts
  //         const clusterCount = {};
  //         data.forEach(entry => {
  //           const cluster = entry.cluster;
  //           clusterCount[cluster] = (clusterCount[cluster] || 0) + 1;
  //         });

  //         const formattedData = Object.entries(clusterCount).map(([cluster, count]) => ({
  //           cluster: `Cluster ${cluster}`,
  //           customers: count
  //         }));
  //         setClusterDetails(formattedData);

  //         // Fetch descriptions after cluster data is valid
  //         fetch("ml/cluster_descriptions.json")
  //           .then(res => res.json())
  //           .then(descData => {
  //             setClusterDescriptions(descData);
  //           });
  //       }
  //     });
  // }, []);
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      // console.log(Object.keys(data).length)
      if (data.clustering_result?.message === "No Customer Details Found") {
        setHasCustomers(false);
        console.log("inside cluster ", hasCustomers);
      } else {
        setRawData(data.clustering_result.clusters);
        setHasCustomers(true);
        console.log("inside cluster ", hasCustomers);

        // Aggregate cluster counts
        const clusterCount = {};
        data.clustering_result.clusters.forEach((entry) => {
          const cluster = entry.cluster;
          clusterCount[cluster] = (clusterCount[cluster] || 0) + 1;
        });

        const formattedData = Object.entries(clusterCount).map(
          ([cluster, count]) => ({
            cluster: `Cluster ${cluster}`,
            customers: count,
          })
        );
        setClusterDetails(formattedData);
        const temp = data.clustering_result.descriptions;
        setClusterDescriptions(temp);
        console.log(clusterDescriptions);
      }
    } else {
      setHasCustomers(false);
      console.log(hasCustomers);
      // console.log(Object.keys(data).length)
    }
  }, [data]);
  const handleExportCSV = () => {
    const headers = ["customer_id,cluster"];
    const rows = rawData.map(
      (entry) => `${entry.customer_id},${entry.cluster}`
    );
    const csvContent = [headers, ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customer_clusters.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="customer-clustered-page">
      <h2>Customer Clustering and Segmentation</h2>

      {hasCustomers ? (
        <>
          <p>
            <strong>Clustering Methodology:</strong>
          </p>
          <p>
            Customers have been segmented based on their purchasing behavior and
            the product categories they frequently purchase. We used KMeans
            clustering to group similar customers together.
          </p>

          <div className="chart-card">
          <Button variant="contained" onClick={handleExportCSV}>
              ⬇️ Export Customer Data
              </Button>
            <div className="chart-header">
              <h3>Customer Segments by Interest (Clustering)</h3>
              {/* <button onClick={handleExportCSV} className="export-button">
                ⬇️ Export CSV
              </button> */}
              
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clusterDetails}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="cluster" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="customers" fill="#3498db" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="cluster-explanation">
            <h3>Cluster Breakdown:</h3>
            {clusterDescriptions &&
              Object.keys(clusterDescriptions).length > 0 &&
              Object.values(clusterDescriptions).map(
                (
                  desc,
                  idx // Use Object.values()
                ) => (
                  <div key={idx} className="cluster-item">
                    <h4>{`Cluster ${desc.cluster}`}</h4>
                    <p>Top Categories: {desc.top_categories.join(", ")}</p>
                    <p>Customer Count: {desc.size}</p>
                  </div>
                )
              )}
          </div>
        </>
      ) : (
        <>
          <p>No Customer Details Found.</p>
          <p>
            Please ensure the data includes <code>customer_id</code> and{" "}
            <code>product_category</code>.
          </p>
        </>
      )}
    </div>
  );
};

export default CustomerClustered;
