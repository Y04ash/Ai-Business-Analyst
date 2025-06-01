import React, { useState } from 'react';
import '../index.css'
import '../css/sidebar.css'; // Sidebar styles
import { Link } from 'react-router-dom'
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [currentSection,setCurrentSection] = useState('home')
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <button className="hamburger" onClick={toggleSidebar}>
        ☰
      </button> 
      {isOpen && (
        <ul className="menu">
          <Link to="/" className="custom-link">
        <li className={currentSection === 'home' ? 'active' : ''} onClick={()=>setCurrentSection('home')}>
        🏠
          <span>Home</span>
        </li>
        </Link>
          <Link to="/upload" className="custom-link">
        <li className={currentSection === 'upload' ? 'active' : ''} onClick={()=>setCurrentSection('upload')}>
        📤
          <span>Upload</span>
        </li>
        </Link>
          <Link to="/visualize" className="custom-link">
        <li className={currentSection === 'visualizeLanding' ? 'active' : ''} onClick={()=>setCurrentSection('visualizeLanding')}>
          📊
          <span>Visualize</span>
        </li>
        </Link>

        <Link to="/customer-clustered" className="custom-link">
        <li className={currentSection === 'customerClustered' ? 'active' : ''} onClick={()=>setCurrentSection('customerClustered')}>
          👥
          <span>Customer</span>
        </li>
        </Link>

        <Link to="/apriori" className="custom-link">
        <li className={currentSection === 'apriori' ? 'active' : ''} onClick={()=>setCurrentSection('apriori')}>
          ↔️
          <span>Apriori</span>
        </li>
        </Link>

        <Link to="/rfm" className="custom-link">
        <li className={currentSection === 'rfm' ? 'active' : ''} onClick={()=>setCurrentSection('rfm')}>
        ⭐
          <span>RFM</span>
        </li>
        </Link>
      </ul>
      
      )}
    </div>
  );
};

export default Sidebar;
