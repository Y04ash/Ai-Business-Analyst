// // pages/UploadPage.jsx
// import React from 'react';
// import '../index.css'
// import { useResultContext } from '../context/ResultContext';
// import { useNavigate } from 'react-router-dom';

// const UploadPage = () => {
//   const { setData } = useResultContext();
//   const navigate = useNavigate();
  

//   const handleUpload = async (e) => {
//     try {
//         console.log("clicked")
//         console.log("Uploading file:", e.target.files[0]);

//     const formData = new FormData();
//     formData.append('file', e.target.files[0]);

//     const response = await fetch('http://localhost:8000/upload', {
//       method: 'POST',
//       body: formData,
//     });

//     const data = await response.json();
//     setData(data); // Save to context
//     console.log(data)
     
//     navigate('/visualize'); 
//     } catch (error) {
//         console.log("Error is ",error)
//     }
//     // Navigate to dashboard or any results page
//   };

//   return (
//   <>
//   <input type="file" onChange={handleUpload}/>
  
//   </>
//   )
// };

// export default UploadPage;


// pages/UploadPage.jsx
import React, { useState } from 'react';
import '../css/upload.css';
import { useResultContext } from '../context/ResultContext';
import { useNavigate } from 'react-router-dom';

const UploadPage = () => {
  const { setData } = useResultContext();
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleUpload = async (file) => {
    try {
      console.log("Uploading file:", file);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log(data)
      setData(data);
      navigate('/visualize');
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileName(e.dataTransfer.files[0].name);
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      handleUpload(e.target.files[0]);
    }
  };

  return (
    <div className="upload-container">
      <h1 className="title">Upload Your Sales CSV File</h1>
      <div
        className={`dropzone ${dragActive ? 'active' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <p>Drag & Drop your CSV file here, or click to select</p>
        <input
          type="file"
          accept=".csv"
          onChange={handleChange}
          className="file-input"
        />
        {fileName && <p className="file-name">Selected file: {fileName}</p>}
      </div>

      <div className="note">
        <h3>Note: CSV should include the following columns</h3>
        <ul>
          <li><strong>product_name</strong>: Name of the product</li>
          <li><strong>product_category</strong> (optional): Category of the product — required for category-based insights</li>
          <li><strong>customer_id</strong> (optional): ID of the customer — required for customer-based analytics</li>
          <li><strong>region</strong>: Sales region (e.g., North, South, etc.)</li>
          <li><strong>order_date</strong>: Date of the order (format: dd/mm/yyyy)</li>
          <li><strong>quantity</strong>: Number of units sold</li>
          <li><strong>unit_price</strong>: Price per unit of product</li>
          <li><strong>total_revenue</strong>: Calculated as <em>quantity × unit_price</em></li>
          <li><strong>cost_price</strong>: Cost to acquire or produce the product</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadPage;
