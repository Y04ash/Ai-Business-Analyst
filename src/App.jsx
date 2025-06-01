// import React, { useState, useEffect, createContext } from "react";
// import "./css/App.css"; // App general styles
// import { useResultContext } from "./context/ResultContext";
// import ReactDOM from 'react-dom/client';
// import Sidebar from "./components/Sidebar";
// import VisualizeLanding from "./pages/VisualizeLanding";
// import CustomerClustered from "./pages/CustomerClustered";
// import Apriori from "./pages/Apriori";
// import RFMPage from "./pages/RFMPage";
// import { BrowserRouter } from 'react-router-dom';
// // import * as ResultContext from './context/ResultContext';
// import { useNavigate } from 'react-router-dom';
// import UploadPage from "./pages/Upload";
// import Home from "./pages/Home";
// import { ResultProvider } from "./context/ResultContext";
// function App() {

//   const { data,setData,isSidebarOpen,setIsSidebarOpen } = useResultContext();
//   const navigate = useNavigate();


//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };


//   return (
//     // <BrowserRouter>
//       <ResultProvider>
//         <div className="app-container lato-bold">
//           <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//           <div className="content">
//             <Routes>
//               <Route path="/" element={<Home />} />
//               <Route path="/upload" element={<UploadPage />} />
//               <Route path="/visualize" element={<VisualizeLanding />} />
//               <Route path="/customer-clustered" element={<CustomerClustered />} />
//               <Route path="/apriori" element={<Apriori />} />
//               <Route path="/rfm" element={<RFMPage />} />
//             </Routes>
//           </div>
//         </div>
//       </ResultProvider>)
//     {/* </BrowserRouter> */}
    
// }

// export default App;


// src/App.jsx
import React, { useState,useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ResultProvider } from "./context/ResultContext";
import './index.css'
import { useResultContext } from './context/ResultContext';
import "./css/App.css";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import UploadPage from "./pages/Upload";
import VisualizeLanding from "./pages/VisualizeLanding";
import CustomerClustered from "./pages/CustomerClustered";
import Apriori from "./pages/Apriori";
import RFMPage from "./pages/RFMPage";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const {
    data,
    availableYears,
    setAvailableYears,
    setSelectedYear,
    setHasProfit,
    setHasCategoryRevenueByMonth,
  } = useResultContext();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };



  return (
        <div className="app-container lato-bold">
          <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/visualize" element={<VisualizeLanding />} />
              <Route path="/customer-clustered" element={<CustomerClustered />} />
              <Route path="/apriori" element={<Apriori />} />
              <Route path="/rfm" element={<RFMPage />} />
            </Routes>
          </div>
        </div>
  );
}

export default App;
