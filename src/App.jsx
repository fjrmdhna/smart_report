// src/App.jsx
import React, { useState, useEffect } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";

import Dashboard from "./components/Dashboard";
import Notification from "./components/Notification";
import Planning from "./components/Planning";
import MyNavbar from "./Navbar";
import Footer from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const [fileName, setFileName] = useState("Please Choose a file...");
  const [selectedFilters, setSelectedFilters] = useState({
    province: "All",
    city: "All",
    mc: "All",
    vendor: "All",
    sow: "All",
    nc: "All",
  });

  // Data mentah
  const [pivotData, setPivotData] = useState([]);
  const [filters, setFilters] = useState({
    provinceList: [],
    cityList: [],
    mcList: [],
    vendorList: [],
    sowList: [],
    ncList: [],
  });
  const [provinceToCities, setProvinceToCities] = useState({});

  // Data hasil filter dengan pagination
  const [markers, setMarkers] = useState([]);
  const [sites, setSites] = useState([]);
  const [markersPagination, setMarkersPagination] = useState({
    page: 1,
    limit: 100,
    totalPages: 1,
    total: 0,
  });
  const [sitesPagination, setSitesPagination] = useState({
    page: 1,
    limit: 100,
    totalPages: 1,
    total: 0,
  });

  // All markers for CoverageMap
  const [markersForMap, setMarkersForMap] = useState([]);

  // Chart data bulanan
  const [chartData, setChartData] = useState({
    labels: [],
    surveyBF: [],
    surveyAF: [],
    mosBF: [],
    mosAF: [],
    cutoverBF: [],
    cutoverAF: [],
    dismantleBF: [],
    dismantleAF: [],
  });

  /**
   * Handle upload Excel (kirim ke server)
   */
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append("excelFile", file);

      // POST ke backend
      const res = await axios.post("http://localhost:5000/api/upload-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Server response:", res.data);
      // response: { success, pivotData, filters, chartData, provinceToCities }

      if (res.data.success) {
        setPivotData(res.data.pivotData || []);
        setFilters(res.data.filters || {
          provinceList: [],
          cityList: [],
          mcList: [],
          vendorList: [],
          sowList: [],
          ncList: [],
        });
        setProvinceToCities(res.data.provinceToCities || {});

        setChartData(res.data.chartData || {
          labels: [],
          surveyBF: [],
          surveyAF: [],
          mosBF: [],
          mosAF: [],
          cutoverBF: [],
          cutoverAF: [],
          dismantleBF: [],
          dismantleAF: [],
        });

        // Setelah upload, ambil markers dan sites dengan filter default (All) dan halaman 1
        fetchMarkers(selectedFilters, 1, markersPagination.limit);
        fetchSites(selectedFilters, 1, sitesPagination.limit);

        // Fetch all markers for map
        fetchAllMarkers(selectedFilters);
      } else {
        console.error("Upload failed:", res.data.message);
      }
    } catch (error) {
      console.error("Error uploading Excel file:", error);
    }
  };

  /**
   * Fetch markers dari server dengan filter dan pagination
   */
  const fetchMarkers = async (filtersSel, page, limit) => {
    try {
      const params = {
        ...filtersSel,
        page,
        limit,
      };
      const res = await axios.get("http://localhost:5000/api/markers", { params });

      if (res.data.success) {
        // Convert date strings to Date objects
        const markersWithDates = res.data.data.map((m) => ({
          ...m,
          dates: Object.fromEntries(
            Object.entries(m.dates || {}).map(([key, val]) => [
              key,
              typeof val === "string" ? new Date(val) : val,
            ])
          ),
        }));

        setMarkers(markersWithDates);
        setMarkersPagination({
          page: res.data.pagination.page,
          limit: res.data.pagination.limit,
          totalPages: res.data.pagination.totalPages,
          total: res.data.pagination.total,
        });
      } else {
        console.error("Fetch markers failed:", res.data.message);
      }
    } catch (error) {
      console.error("Error fetching markers:", error);
    }
  };

  /**
   * Fetch all markers for CoverageMap
   */
  const fetchAllMarkers = async (filtersSel) => {
    try {
      const params = { ...filtersSel };
      const res = await axios.get("http://localhost:5000/api/markers/all", { params });

      if (res.data.success) {
        // Convert date strings to Date objects
        const markersWithDates = res.data.data.map((m) => ({
          ...m,
          dates: Object.fromEntries(
            Object.entries(m.dates || {}).map(([key, val]) => [
              key,
              typeof val === "string" ? new Date(val) : val,
            ])
          ),
        }));

        setMarkersForMap(markersWithDates);
      } else {
        console.error("Fetch all markers failed:", res.data.message);
      }
    } catch (error) {
      console.error("Error fetching all markers:", error);
    }
  };

  /**
   * Fetch chart data from server with current filters
   */
  const fetchChartData = async (filtersSel) => {
    try {
      const params = { ...filtersSel };
      const res = await axios.get("http://localhost:5000/api/chart-data", { params });

      if (res.data.success) {
        setChartData(res.data.chartData || {
          labels: [],
          surveyBF: [],
          surveyAF: [],
          mosBF: [],
          mosAF: [],
          cutoverBF: [],
          cutoverAF: [],
          dismantleBF: [],
          dismantleAF: [],
        });
      } else {
        console.error("Fetch chart data failed:", res.data.message);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  /**
   * Fetch sites dari server dengan filter dan pagination
   */
  const fetchSites = async (filtersSel, page, limit) => {
    try {
      const params = {
        ...filtersSel,
        page,
        limit,
      };
      const res = await axios.get("http://localhost:5000/api/sites", { params });

      if (res.data.success) {
        setSites(res.data.data);
        setSitesPagination({
          page: res.data.pagination.page,
          limit: res.data.pagination.limit,
          totalPages: res.data.pagination.totalPages,
          total: res.data.pagination.total,
        });
      } else {
        console.error("Fetch sites failed:", res.data.message);
      }
    } catch (error) {
      console.error("Error fetching sites:", error);
    }
  };

  /**
   * Re-fetch markers, sites, and chartData ketika filters berubah
   */
  useEffect(() => {
    if (pivotData.length > 0) { // Pastikan data sudah di-upload
      // Reset pagination to first page
      setMarkersPagination((prev) => ({
        ...prev,
        page: 1,
      }));
      setSitesPagination((prev) => ({
        ...prev,
        page: 1,
      }));

      // Fetch markers, sites, and chart data dengan filter baru
      fetchMarkers(selectedFilters, 1, markersPagination.limit);
      fetchSites(selectedFilters, 1, sitesPagination.limit);
      fetchChartData(selectedFilters);

      // Fetch all markers for map dengan filter baru
      fetchAllMarkers(selectedFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters]);

  /**
   * Handle perubahan filter
   */
  const handleFilterChange = (updatedFilters) => {
    setSelectedFilters(updatedFilters);
  };

  /**
   * Handle pagination untuk markers
   */
  const handleMarkersPageChange = (newPage) => {
    setMarkersPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
    fetchMarkers(selectedFilters, newPage, markersPagination.limit);
  };

  /**
   * Handle pagination untuk sites
   */
  const handleSitesPageChange = (newPage) => {
    setSitesPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
    fetchSites(selectedFilters, newPage, sitesPagination.limit);
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
                  fileName={fileName}
                  handleFileUpload={handleFileUpload}
                  filters={filters}
                  provinceToCities={provinceToCities}
                  selectedFilters={selectedFilters}
                  handleFilterChange={handleFilterChange}
                  pivotData={pivotData}
                  chartData={chartData}
                  sites={sites}
                  markersForMap={markersForMap}
                  sitesPagination={sitesPagination}
                  handleSitesPageChange={handleSitesPageChange}
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