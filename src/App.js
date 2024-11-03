// src/App.js
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Notification from './components/Notification';
import Planning from './components/Planning';
import MyNavbar from './Navbar';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './Navbar.css';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

import {
  processDataFromExcel,
  applyFilters,
  generatePlanVsActualData,
} from './utils/dataFormatter';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const [data, setData] = useState({ markers: [], filters: [], siteStatus: {} });
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [planVsActualData, setPlanVsActualData] = useState({
    labels: [],
    planRFI: [],
    actualRFI: [],
    planRFS: [],
    actualRFS: [],
  });
  const [filteredSiteStatus, setFilteredSiteStatus] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({
    region: 'All',
    priority: 'All',
    siteCategory: 'All',
    ranVendor: 'All',
    program: 'All',
  });
  const [fileName, setFileName] = useState('Please Choose a file...');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = await processDataFromExcel(event.target.result);
        setData(result);
        setFilteredMarkers(result.markers);
        setFilteredSiteStatus(result.siteStatus);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Update filteredMarkers when selectedFilters change
  useEffect(() => {
    if (data.markers && data.markers.length > 0) {
      const newFilteredMarkers = applyFilters(data.markers, selectedFilters);
      setFilteredMarkers(newFilteredMarkers);
    }
  }, [selectedFilters, data.markers]);

  // Update planVsActualData and filteredSiteStatus when filteredMarkers change
  useEffect(() => {
    if (filteredMarkers && filteredMarkers.length > 0) {
      const newPlanVsActualData = generatePlanVsActualData(filteredMarkers);
      setPlanVsActualData(newPlanVsActualData);

      // Calculate siteStatus based on filteredMarkers
      const statusCounts = {};
      filteredMarkers.forEach((marker) => {
        const status = marker.status || 'Unknown';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      setFilteredSiteStatus(statusCounts);
    }
  }, [filteredMarkers]);

  const handleFilterChange = (updatedFilter) => {
    setSelectedFilters(updatedFilter);
  };

  return (
    <Router>
      <div className="App">
        <MyNavbar />
        <div className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  data={data}
                  filteredMarkers={filteredMarkers}
                  planVsActualData={planVsActualData}
                  filteredSiteStatus={filteredSiteStatus}
                  selectedFilters={selectedFilters}
                  fileName={fileName}
                  handleFileUpload={handleFileUpload}
                  handleFilterChange={handleFilterChange}
                />
              }
            />
            <Route path="/notification" element={<Notification />} />
            <Route path="/planning" element={<Planning />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
