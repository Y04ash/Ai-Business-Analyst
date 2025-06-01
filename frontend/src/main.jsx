// import React,{ StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import ReactDOM from 'react-dom/client';;
// // import * as ResultContext from './context/ResultContext';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     {/* <ResultContext.ResultProvider> */}
//       <App />
//     {/* </ResultContext.ResultProvider> */}
//   </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ResultProvider } from "./context/ResultContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ResultProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ResultProvider>
  </React.StrictMode>
);
