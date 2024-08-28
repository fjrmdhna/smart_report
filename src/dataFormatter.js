import * as XLSX from 'xlsx';

/**
 * Function to process and format data from Excel file.
 * @param {Object} sheet - The sheet from the Excel file.
 * @returns {Object} - Returns formatted data for plan vs actual chart, map markers, and other summaries.
 */
export const processDataFromExcel = (sheet) => {
  const jsonData = XLSX.utils.sheet_to_json(sheet);
  const yearData = {};
  const markers = [];
  const vendors = {};
  let completed = 0;
  let incomplete = 0;
  const regions = {};

  jsonData.forEach(row => {
    // Prepare marker data for map
    if (row.LAT && row.LONG && !isNaN(parseFloat(row.LAT)) && !isNaN(parseFloat(row.LONG))) {
      markers.push({
        lat: parseFloat(row.LAT),
        lng: parseFloat(row.LONG),
        siteName: row.SITE_NAME || 'Unknown',
        vendor: row.Vendor || 'Unknown',
      });
    }

    // Convert Plan and Actual dates
    const planDate = parseExcelDate(row.Plan);
    const actualDate = parseExcelDate(row.Actual);

    // Process plan vs actual data by year
    if (planDate) {
      const planYear = planDate.getFullYear();
      if (!yearData[planYear]) yearData[planYear] = { plan: 0, actual: 0 };
      yearData[planYear].plan += 1;
    }

    if (actualDate) {
      const actualYear = actualDate.getFullYear();
      if (!yearData[actualYear]) yearData[actualYear] = { plan: 0, actual: 0 };
      yearData[actualYear].actual += 1;
    }

    // Process vendor data for chart
    const vendorName = row.Vendor ? row.Vendor.trim().toUpperCase() : 'UNKNOWN';

    // Filter out "DEA"
    if (vendorName !== 'DEA') {
      if (!vendors[vendorName]) {
        vendors[vendorName] = { scope: 0, actual: 0 };
      }
      vendors[vendorName].scope += 1;
      if (row.Actual) {
        vendors[vendorName].actual += 1;
      }
    }

    // Count completed and incomplete projects
    if (row.Actual) {
      completed += 1;
    } else {
      incomplete += 1;
    }

    // Count projects by region
    const region = row.REGION || 'Unknown';
    if (!regions[region]) {
      regions[region] = 0;
    }
    regions[region] += 1;
  });

  const formattedData = {
    labels: Object.keys(yearData),
    plan: [],
    actual: [],
  };

  Object.keys(yearData).forEach(year => {
    formattedData.plan.push(yearData[year].plan);
    formattedData.actual.push(yearData[year].actual);
  });

  const vendorSummary = Object.keys(vendors).map(vendor => ({
    vendor,
    scope: vendors[vendor].scope,
    actual: vendors[vendor].actual,
    percentage: ((vendors[vendor].actual / vendors[vendor].scope) * 100).toFixed(2) + '%',
  }));

  const deliveryPlanSummary = Object.keys(yearData).map(year => ({
    year,
    plan: yearData[year].plan,
    actual: yearData[year].actual,
  }));

  return { formattedData, markers, vendorSummary, deliveryPlanSummary };
};

/**
 * Function to parse Excel date serial number or regular date string.
 * @param {string|number} value - The date value to be parsed.
 * @returns {Date|null} - Parsed date object or null if invalid.
 */
const parseExcelDate = (value) => {
  if (!value) return null;

  // Check if value is a number (Excel serial date)
  if (typeof value === 'number') {
    // Excel serial date conversion (based on 1/1/1900)
    const date = new Date(Math.round((value - 25567) * 86400 * 1000));
    return date;
  }

  // Handle regular date strings
  const parsedDate = new Date(value);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate;
  }

  return null;
};
