// server/index.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { processDataFromExcelBuffer, buildChartDataFromMarkers } = require("./dataFormatter");

const app = express();
const PORT = 5000;

app.use(cors());

// Multer memori storage
const upload = multer({ storage: multer.memoryStorage() });

// In-memory storage untuk data yang diupload (Per Sesi)
let uploadedData = null;

// Endpoint untuk mengupload file Excel
app.post("/api/upload-excel", upload.single("excelFile"), (req, res) => {
  try {
    const fileBuffer = req.file.buffer;

    // Panggil fungsi dataFormatter
    const result = processDataFromExcelBuffer(fileBuffer);
    // result = { markers, sites, pivotData, filters, chartData, provinceToCities }

    // Simpan data di memory (untuk sesi ini)
    uploadedData = result;

    // Kirim balikan pivotData, filters, chartData, provinceToCities untuk frontend
    return res.json({
      success: true,
      pivotData: result.pivotData,
      filters: result.filters,
      chartData: result.chartData,
      provinceToCities: result.provinceToCities,
    });
  } catch (error) {
    console.error("Error parsing Excel di server:", error);
    return res.status(500).json({ success: false, message: "Parsing error" });
  }
});

// Endpoint untuk mengambil markers dengan filter dan pagination
app.get("/api/markers", (req, res) => {
  try {
    if (!uploadedData) {
      return res.status(400).json({ success: false, message: "No data uploaded." });
    }

    const { province, city, mc, vendor, sow, nc, page = 1, limit = 100 } = req.query;

    let filteredMarkers = uploadedData.markers;

    // Terapkan filter
    if (province && province !== "All") {
      filteredMarkers = filteredMarkers.filter((m) => m.province === province);
    }
    if (city && city !== "All") {
      filteredMarkers = filteredMarkers.filter((m) => m.city === city);
    }
    if (mc && mc !== "All") {
      filteredMarkers = filteredMarkers.filter((m) => m.mc === mc);
    }
    if (vendor && vendor !== "All") {
      filteredMarkers = filteredMarkers.filter((m) => m.ranVendor === vendor);
    }
    if (sow && sow !== "All") {
      filteredMarkers = filteredMarkers.filter((m) => m.sow === sow);
    }
    if (nc && nc !== "All") {
      filteredMarkers = filteredMarkers.filter((m) => m.nc === nc);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit, 10);
    const paginatedMarkers = filteredMarkers.slice(startIndex, endIndex);

    // Total pages
    const totalPages = Math.ceil(filteredMarkers.length / limit);

    return res.json({
      success: true,
      data: paginatedMarkers,
      pagination: {
        total: filteredMarkers.length,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching markers:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

// Endpoint untuk mengambil semua markers dengan filter (untuk CoverageMap)
app.get("/api/markers/all", (req, res) => {
  try {
    if (!uploadedData) {
      return res.status(400).json({ success: false, message: "No data uploaded." });
    }

    const { province, city, mc, vendor, nc } = req.query;

    let filteredMarkers = uploadedData.markers;

    // Terapkan filter
    if (province && province !== "All") {
      filteredMarkers = filteredMarkers.filter((m) => m.province === province);
    }
    if (city && city !== "All") {
      filteredMarkers = filteredMarkers.filter((m) => m.city === city);
    }
    if (mc && mc !== "All") {
      filteredMarkers = filteredMarkers.filter((m) => m.mc === mc);
    }
    if (vendor && vendor !== "All") {
      filteredMarkers = filteredMarkers.filter((m) => m.ranVendor === vendor);
    }
    if (nc && nc !== "All") {
      filteredMarkers = filteredMarkers.filter((m) => m.nc === nc);
    }

    // **Tambahkan filter khusus untuk 'Existing'**
    filteredMarkers = filteredMarkers.filter((m) => m.sow === "Existing");

    return res.json({
      success: true,
      data: filteredMarkers,
    });
  } catch (error) {
    console.error("Error fetching all markers:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

// Endpoint untuk mengambil chart data dengan filter
app.get("/api/chart-data", (req, res) => {
  try {
    if (!uploadedData) {
      return res.status(400).json({ success: false, message: "No data uploaded." });
    }

    const { province, city, mc, vendor, sow, nc } = req.query;

    let filteredMarkers = uploadedData.markers;

    // Terapkan filter
    if (province && province !== "All") {
      filteredMarkers = filteredMarkers.filter((m) => m.province === province);
    }
    if (city && city !== "All") {
      filteredMarkers = filteredMarkers.filter((m) => m.city === city);
    }
    if (mc && mc !== "All") {
      filteredMarkers = filteredMarkers.filter((m) => m.mc === mc);
    }
    if (vendor && vendor !== "All") {
      filteredMarkers = filteredMarkers.filter((m) => m.ranVendor === vendor);
    }
    if (sow && sow !== "All") {
      filteredMarkers = filteredMarkers.filter((m) => m.sow === sow);
    }
    if (nc && nc !== "All") {
      filteredMarkers = filteredMarkers.filter((m) => m.nc === nc);
    }

    // Build chartData
    const chartData = buildChartDataFromMarkers(filteredMarkers);

    return res.json({
      success: true,
      chartData,
    });
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

// Endpoint untuk mengambil sites dengan filter dan pagination
app.get("/api/sites", (req, res) => {
  try {
    if (!uploadedData) {
      return res.status(400).json({ success: false, message: "No data uploaded." });
    }

    const { province, city, mc, vendor, sow, nc, page = 1, limit = 100 } = req.query;

    let filteredSites = uploadedData.sites;

    // Terapkan filter
    if (province && province !== "All") {
      filteredSites = filteredSites.filter((s) => s.province === province);
    }
    if (city && city !== "All") {
      filteredSites = filteredSites.filter((s) => s.city === city);
    }
    if (mc && mc !== "All") {
      filteredSites = filteredSites.filter((s) => s.mc === mc);
    }
    if (vendor && vendor !== "All") {
      filteredSites = filteredSites.filter((s) => s.vendor === vendor);
    }
    if (sow && sow !== "All") {
      filteredSites = filteredSites.filter((s) => s.sow === sow);
    }
    if (nc && nc !== "All") {
      filteredSites = filteredSites.filter((s) => s.nc === nc);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit, 10);
    const paginatedSites = filteredSites.slice(startIndex, endIndex);

    // Total pages
    const totalPages = Math.ceil(filteredSites.length / limit);

    return res.json({
      success: true,
      data: paginatedSites,
      pagination: {
        total: filteredSites.length,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching sites:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
