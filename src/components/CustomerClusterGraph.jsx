import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import '../index.css'
import { useResultContext } from '../context/ResultContext';
const CustomerClusterGraph = ({clusterDetails,clusterDescription}) => {
  const [clusterData, setClusterData] = useState(clusterDetails);
  
  // useEffect(() => {
    //   fetch('ml/customer_interest_clusters.json')
    //     .then(res => res.json())
    //     .then(data => {
        
  //         setRawData(data);
  //         // Count customers per cluster
  //         const clusterCount = {};
  //         data.forEach(entry => {
  //           const cluster = entry.cluster;
  //           clusterCount[cluster] = (clusterCount[cluster] || 0) + 1;
  //         });
  
  //         const formattedData = Object.entries(clusterCount).map(([cluster, count]) => ({
  //           cluster: `Cluster ${cluster}`,
  //           customers: count
  //         }));
  //         setClusterData(formattedData);
        

  //     });
  // }, []);
  const { data } = useResultContext();

  const [rawData, setRawData] = useState([]);
  const handleExportCSV = () => {
    const headers = ['customer_id,cluster'];
    const rows = data.clustering_result.clusters.map(entry => `${entry.customer_id},${entry.cluster}`);
    const csvContent = [headers, ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customer_clusters.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="chart-card">
      
      <h3>Customer Segments by Interest (Clustering)</h3><button onClick={handleExportCSV} className="export-button">⬇️ Export CSV</button>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={clusterData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="cluster" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="customers" fill="#3498db" />
        </BarChart>
      </ResponsiveContainer>
         
      
    </div>
  );
};

export default CustomerClusterGraph;
