// src/utils/dataFormatter.js
import * as XLSX from 'xlsx';

/**
 * Function to process and format data from Excel file.
 * @param {ArrayBuffer} fileBuffer - The file buffer from the uploaded Excel file.
 * @returns {Object} - Returns markers, siteStatus, and filters.
 */
export const processDataFromExcel = (fileBuffer) => {
  const workbook = XLSX.read(fileBuffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  if (jsonData.length === 0) {
    throw new Error('File Excel kosong.');
  }

  const headers = jsonData[0].map(header => header.toLowerCase().trim());
  const dataRows = jsonData.slice(1);

  const markers = [];
  const siteStatus = {};
  const filters = {
    regions: new Set(),
    priorities: new Set(),
    siteCategories: new Set(),
    ranVendors: new Set(),
    programs: new Set(),
  };

  const getColumnIndex = (columnName) => {
    const index = headers.indexOf(columnName.toLowerCase());
    if (index === -1) {
      throw new Error(`Kolom "${columnName}" tidak ditemukan dalam file Excel.`);
    }
    return index;
  };

  let regionIdx, latitudeIdx, longitudeIdx, siteNameIdx, vendorIdx;
  let siteTypeIdx, trmVendorIdx, trmTypeIdx, siteStatusIdx;
  let planRFIIdx, actualRFIIdx, planRFSIdx, actualRFSIdx;

  try {
    regionIdx = getColumnIndex('region');
    latitudeIdx = getColumnIndex('latitude');
    longitudeIdx = getColumnIndex('longitude');
    siteNameIdx = getColumnIndex('site_name');
    vendorIdx = getColumnIndex('vendor');
    siteTypeIdx = getColumnIndex('site type');
    trmVendorIdx = getColumnIndex('trm vendor');
    trmTypeIdx = getColumnIndex('trm type');
    siteStatusIdx = getColumnIndex('site status');
    planRFIIdx = getColumnIndex('plan rfi (date)');
    actualRFIIdx = getColumnIndex('actual rfi (date)');
    planRFSIdx = getColumnIndex('plan rfs (date)');
    actualRFSIdx = getColumnIndex('actual rfs (date)');
  } catch (error) {
    console.error("Error in column indexing:", error);
    throw error;
  }

  dataRows.forEach((row, rowIndex) => {
    if (row.length === 0) return;

    if (row[latitudeIdx] && row[longitudeIdx]) {
      const lat = parseFloat(row[latitudeIdx].toString().replace(',', '.'));
      const lng = parseFloat(row[longitudeIdx].toString().replace(',', '.'));

      if (!isNaN(lat) && !isNaN(lng)) {
        const marker = {
          lat,
          lng,
          siteName: row[siteNameIdx] || 'Unknown',
          vendor: row[vendorIdx] || 'Unknown',
          region: row[regionIdx] || 'Unknown',
          siteCategory: row[siteTypeIdx] || 'Unknown',
          ranVendor: row[trmVendorIdx] || 'Unknown',
          program: row[trmTypeIdx] || 'Unknown',
          status: row[siteStatusIdx] || 'Unknown',
          planRFI: parseExcelDate(row[planRFIIdx]),
          actualRFI: parseExcelDate(row[actualRFIIdx]),
          planRFS: parseExcelDate(row[planRFSIdx]),
          actualRFS: parseExcelDate(row[actualRFSIdx]),
        };
        markers.push(marker);
      } else {
        console.warn(`Baris ${rowIndex + 2}: Latitude atau Longitude tidak valid.`);
      }
    } else {
      console.warn(`Baris ${rowIndex + 2}: Latitude atau Longitude kosong.`);
    }

    // Menghitung status situs untuk summary
    const status = row[siteStatusIdx] || 'Unknown';
    siteStatus[status] = (siteStatus[status] || 0) + 1;

    // Mengisi opsi filter
    filters.regions.add(row[regionIdx] || 'Unknown');
    filters.priorities.add(status);
    filters.siteCategories.add(row[siteTypeIdx] || 'Unknown');
    filters.ranVendors.add(row[trmVendorIdx] || 'Unknown');
    filters.programs.add(row[trmTypeIdx] || 'Unknown');
  });

  const filterOptions = {
    regions: Array.from(filters.regions).sort(),
    priorities: Array.from(filters.priorities).sort(),
    siteCategories: Array.from(filters.siteCategories).sort(),
    ranVendors: Array.from(filters.ranVendors).sort(),
    programs: Array.from(filters.programs).sort(),
  };

  return {
    markers,
    siteStatus,
    filters: filterOptions
  };
};

/**
 * Utility function to parse Excel date serial number atau regular date string.
 * @param {string|number} value - The date value to be parsed.
 * @returns {Date|null} - Parsed date object atau null jika invalid.
 */
export const parseExcelDate = (value) => {
  if (!value) return null;

  if (typeof value === 'number') {
    // Koreksi formula konversi serial date Excel ke JavaScript Date
    // Formula yang benar: (serialDate - 25569) * 86400 * 1000
    const date = new Date((value - 25569) * 86400 * 1000);
    return isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === 'string') {
    // Mengonversi string tanggal dari format DD/MM/YYYY ke Date object
    const parts = value.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // JavaScript months are 0-based
      const year = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return isNaN(date.getTime()) ? null : date;
    }
  }

  return null;
};

/**
 * Function to apply filters to a dataset.
 * @param {Array} data - The dataset to filter (e.g., markers).
 * @param {Object} selectedFilters - The current selected filters.
 * @returns {Array} - The filtered dataset.
 */
export const applyFilters = (data, selectedFilters) => {
  if (!Array.isArray(data) || !selectedFilters) return data;

  return data.filter(item => {
    const matchRegion = selectedFilters.region === 'All' || 
      (item.region && item.region.toLowerCase() === selectedFilters.region.toLowerCase());
    
    const matchPriority = selectedFilters.priority === 'All' || 
      (item.status && item.status.toLowerCase() === selectedFilters.priority.toLowerCase());
    
    const matchSiteCategory = selectedFilters.siteCategory === 'All' || 
      (item.siteCategory && item.siteCategory.toLowerCase() === selectedFilters.siteCategory.toLowerCase());
    
    const matchRanVendor = selectedFilters.ranVendor === 'All' || 
      (item.ranVendor && item.ranVendor.toLowerCase() === selectedFilters.ranVendor.toLowerCase());
    
    const matchProgram = selectedFilters.program === 'All' || 
      (item.program && item.program.toLowerCase() === selectedFilters.program.toLowerCase());

    return matchRegion && matchPriority && matchSiteCategory && matchRanVendor && matchProgram;
  });
};

/**
 * Function to generate Plan vs Actual data from filtered markers.
 * @param {Array} markers - The filtered markers.
 * @returns {Object} - The plan vs actual data.
 */
export const generatePlanVsActualData = (markers) => {
  const planVsActualData = {
    labels: [],
    planRFI: {},
    actualRFI: {},
    planRFS: {},
    actualRFS: {}
  };

  markers.forEach(marker => {
    const dates = [
      { type: 'planRFI', date: marker.planRFI },
      { type: 'actualRFI', date: marker.actualRFI },
      { type: 'planRFS', date: marker.planRFS },
      { type: 'actualRFS', date: marker.actualRFS },
    ];

    dates.forEach(({ type, date }) => {
      if (date) {
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const label = `${month}-${year}`;

        // Validasi bahwa bulan berada dalam rentang 1-12
        if (month < 1 || month > 12) return;

        if (!planVsActualData.labels.includes(label)) {
          planVsActualData.labels.push(label);
          planVsActualData.planRFI[label] = 0;
          planVsActualData.actualRFI[label] = 0;
          planVsActualData.planRFS[label] = 0;
          planVsActualData.actualRFS[label] = 0;
        }

        if (type === 'planRFI') {
          planVsActualData.planRFI[label]++;
        } else if (type === 'actualRFI') {
          planVsActualData.actualRFI[label]++;
        } else if (type === 'planRFS') {
          planVsActualData.planRFS[label]++;
        } else if (type === 'actualRFS') {
          planVsActualData.actualRFS[label]++;
        }
      }
    });
  });

  // Sort labels chronologically
  planVsActualData.labels.sort((a, b) => {
    const [monthA, yearA] = a.split('-').map(Number);
    const [monthB, yearB] = b.split('-').map(Number);
    return yearA - yearB || monthA - monthB;
  });

  // Convert counts to arrays
  const labels = planVsActualData.labels;
  const planRFI = labels.map(label => planVsActualData.planRFI[label] || 0);
  const actualRFI = labels.map(label => planVsActualData.actualRFI[label] || 0);
  const planRFS = labels.map(label => planVsActualData.planRFS[label] || 0);
  const actualRFS = labels.map(label => planVsActualData.actualRFS[label] || 0);

  return {
    labels,
    planRFI,
    actualRFI,
    planRFS,
    actualRFS
  };
};
