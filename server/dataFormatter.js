// server/dataFormatter.js
const XLSX = require("xlsx");

/**
 * Format month-year string from Date object
 * e.g., "12-2024"
 */
function formatMonthYear(dateObj) {
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const yyyy = dateObj.getFullYear();
  return `${mm}-${yyyy}`;
}

/**
 * Build chartData from markers
 * Aggregates data per month for various fields
 */
function buildChartDataFromMarkers(markersArray) {
  const dateMap = {};

  markersArray.forEach((m) => {
    if (!m.dates) return;
    const d = m.dates;
    const dateFields = [
      { key: "surveyBF", date: d.surveyBF }, // mapped from survey_ff
      { key: "surveyAF", date: d.surveyAF }, // mapped from survey_af
      { key: "mosBF", date: d.mosBF },       // mapped from mos_ff
      { key: "mosAF", date: d.mosAF },       // mapped from mos_af
      { key: "cutoverBF", date: d.cutoverBF }, // mapped from cutover_ff
      { key: "cutoverAF", date: d.cutoverAF }, // mapped from cutover_af
      { key: "dismantleBF", date: d.siteDismantleBF }, // mapped from site_dismantle_ff
      { key: "dismantleAF", date: d.siteDismantleAF }, // mapped from site_dismantle_af
    ];

    dateFields.forEach(({ key, date }) => {
      if (date instanceof Date && !isNaN(date.getTime())) {
        const label = formatMonthYear(date); // e.g "12-2024"
        if (!dateMap[label]) {
          dateMap[label] = {
            surveyBF: 0,
            surveyAF: 0,
            mosBF: 0,
            mosAF: 0,
            cutoverBF: 0,
            cutoverAF: 0,
            dismantleBF: 0,
            dismantleAF: 0,
          };
        }
        dateMap[label][key]++;
      }
    });
  });

  const sortedLabels = Object.keys(dateMap).sort((a, b) => {
    const [monA, yearA] = a.split("-").map(Number);
    const [monB, yearB] = b.split("-").map(Number);
    const dateA = new Date(yearA, monA - 1);
    const dateB = new Date(yearB, monB - 1);
    return dateA - dateB;
  });

  const result = {
    labels: sortedLabels,
    surveyBF: [],
    surveyAF: [],
    mosBF: [],
    mosAF: [],
    cutoverBF: [],
    cutoverAF: [],
    dismantleBF: [],
    dismantleAF: [],
  };

  sortedLabels.forEach((label) => {
    result.surveyBF.push(dateMap[label].surveyBF);
    result.surveyAF.push(dateMap[label].surveyAF);
    result.mosBF.push(dateMap[label].mosBF);
    result.mosAF.push(dateMap[label].mosAF);
    result.cutoverBF.push(dateMap[label].cutoverBF);
    result.cutoverAF.push(dateMap[label].cutoverAF);
    result.dismantleBF.push(dateMap[label].dismantleBF);
    result.dismantleAF.push(dateMap[label].dismantleAF);
  });

  return result;
}

/**
 * Memproses file Excel (buffer) dan menghasilkan object data sesuai kebutuhan:
 *   - markers (untuk CoverageMap / chart)
 *   - sites (untuk SiteDataTable)
 *   - pivotData (ringkasan data untuk chart)
 *   - filters (untuk Filter: provinceList, cityList, dsb.)
 *   - chartData (aggregated data for charts)
 *   - provinceToCities (mapping province ke cities)
 */
function processDataFromExcelBuffer(fileBuffer) {
  // 1) Baca workbook dari Buffer
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });

  // 2) Ambil sheet pertama
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // 3) Convert sheet -> array (range=1 => skip row 1 di Excel)
  const jsonData = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    range: 1,
  });

  if (jsonData.length < 2) {
    throw new Error("File Excel tidak memiliki cukup baris untuk header + data.");
  }

  // Baris #2 di Excel => header
  const headers = jsonData[0].map((h) => (h ? h.toString().trim().toLowerCase() : ""));
  // Sisanya => data rows
  const dataRows = jsonData.slice(1);

  // 4) Penampung data
  const markers = [];
  const sites = [];
  const pivotData = {}; // Ringkasan pivot
  const filters = {
    provinceList: new Set(),
    cityList: new Set(),
    mcList: new Set(),
    vendorList: new Set(),
    sowList: new Set(),
    ncList: new Set(),
  };
  const provinceToCities = new Map();

  // Helper cari index kolom
  function getColumnIndex(colName) {
    return headers.indexOf(colName.toLowerCase());
  }

  // Helper parse date (Excel serial / "dd/mm/yyyy" / "dd-mm-yyyy")
  function parseExcelDate(value) {
    if (!value) return null;

    // Numeric => Excel date serial
    if (typeof value === "number") {
      const date = new Date((value - 25569) * 86400 * 1000);
      return isNaN(date.getTime()) ? null : date;
    }

    // String => "dd/mm/yyyy" atau "dd-mm-yyyy"
    if (typeof value === "string") {
      const parts = value.split(/[-/]/);
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const date = new Date(year, month, day);
        return isNaN(date.getTime()) ? null : date;
      }
    }
    return null;
  }

  // 5) Definisikan index kolom
  const latIdx = getColumnIndex("lat");
  const lngIdx = getColumnIndex("long");
  const siteIdIdx = getColumnIndex("site_id");
  const siteNameIdx = getColumnIndex("site_name");
  const provinceIdx = getColumnIndex("province");
  const cityIdx = getColumnIndex("dati_ii");
  const mcIdx = getColumnIndex("mc_cluster");
  const vendorIdx = getColumnIndex("vendor_name");
  const sowIdx = getColumnIndex("scope_of_work");
  const ncIdx = getColumnIndex("nano_cluster");

  // Date columns
  const rfcBFIdx = getColumnIndex("rfc_ff"); // mapped from rfc_ff
  const surveyBFIdx = getColumnIndex("survey_ff"); // mapped from survey_ff
  const surveyAFIdx = getColumnIndex("survey_af"); // mapped from survey_af
  const mosBFIdx = getColumnIndex("mos_ff"); // mapped from mos_ff
  const mosAFIdx = getColumnIndex("mos_af"); // mapped from mos_af
  const mosFFIdx = getColumnIndex("mos_ff"); // if needed
  const cutoverBFIdx = getColumnIndex("cutover_ff"); // mapped from cutover_ff
  const cutoverAFIdx = getColumnIndex("cutover_af"); // mapped from cutover_af
  const cutoverFFIdx = getColumnIndex("cutover_ff"); // if needed
  const siteDismantleBFIdx = getColumnIndex("site_dismantle_ff"); // mapped from site_dismantle_ff
  const siteDismantleAFIdx = getColumnIndex("site_dismantle_af"); // mapped from site_dismantle_af
  const siteDismantleFFIdx = getColumnIndex("site_dismantle_ff"); // if needed

  // 6) Loop baris data
  dataRows.forEach((row) => {
    if (row.length === 0) return; // Skip kosong

    let lat = null, lng = null;
    if (latIdx !== -1 && row[latIdx]) {
      lat = parseFloat(row[latIdx]);
    }
    if (lngIdx !== -1 && row[lngIdx]) {
      lng = parseFloat(row[lngIdx]);
    }

    const siteId = siteIdIdx !== -1 ? row[siteIdIdx] : "";
    const sName = siteNameIdx !== -1 ? row[siteNameIdx] : "";
    const prov = provinceIdx !== -1 ? row[provinceIdx] : "";
    const city = cityIdx !== -1 ? row[cityIdx] : "";
    const mc = mcIdx !== -1 ? row[mcIdx] : "";
    const vendor = vendorIdx !== -1 ? row[vendorIdx] : "";
    const sow = sowIdx !== -1 ? row[sowIdx] : "";
    const nanoC = ncIdx !== -1 ? row[ncIdx] : "";

    // Marker
    const marker = {
      siteId,
      siteName: sName,
      lat,
      lng,
      province: prov,
      ranVendor: vendor,
      mc,
      city,
      sow,
      nc: nanoC,
    };

    // Date fields
    marker.dates = {
      rfcBF: rfcBFIdx !== -1 ? parseExcelDate(row[rfcBFIdx]) : null,
      surveyBF: surveyBFIdx !== -1 ? parseExcelDate(row[surveyBFIdx]) : null,
      surveyAF: surveyAFIdx !== -1 ? parseExcelDate(row[surveyAFIdx]) : null,
      mosBF: mosBFIdx !== -1 ? parseExcelDate(row[mosBFIdx]) : null,
      mosAF: mosAFIdx !== -1 ? parseExcelDate(row[mosAFIdx]) : null,
      mosFF: mosFFIdx !== -1 ? parseExcelDate(row[mosFFIdx]) : null,
      cutoverBF: cutoverBFIdx !== -1 ? parseExcelDate(row[cutoverBFIdx]) : null, // mapped from cutover_ff
      cutoverAF: cutoverAFIdx !== -1 ? parseExcelDate(row[cutoverAFIdx]) : null,
      cutoverFF: cutoverFFIdx !== -1 ? parseExcelDate(row[cutoverFFIdx]) : null,
      siteDismantleBF: siteDismantleBFIdx !== -1 ? parseExcelDate(row[siteDismantleBFIdx]) : null, // mapped from site_dismantle_ff
      siteDismantleAF: siteDismantleAFIdx !== -1 ? parseExcelDate(row[siteDismantleAFIdx]) : null,
      siteDismantleFF: siteDismantleFFIdx !== -1 ? parseExcelDate(row[siteDismantleFFIdx]) : null,
    };
    markers.push(marker);

    // Site
    const siteObj = {
      siteId,
      siteName: sName,
      mc,
      province: prov,
      city,
      vendor,
      sow,
      nc: nanoC,
    };
    sites.push(siteObj);

    // Filters
    if (prov) filters.provinceList.add(prov);
    if (city) filters.cityList.add(city);
    if (mc) filters.mcList.add(mc);
    if (vendor) filters.vendorList.add(vendor);
    if (sow) filters.sowList.add(sow);
    if (nanoC) filters.ncList.add(nanoC);

    // Province to Cities mapping
    if (prov && city) {
      if (!provinceToCities.has(prov)) {
        provinceToCities.set(prov, new Set());
      }
      provinceToCities.get(prov).add(city);
    }

    // Pivot Data (Aggregation per Province)
    if (prov) {
      if (!pivotData[prov]) {
        pivotData[prov] = {
          zone: prov,
          M1: 0,
          M2: 0,
          M3: 0,
          M4: 0,
          M5: 0,
          M6: 0,
          M7: 0,
          M8: 0,
          M9: 0,
        };
      }
      // Contoh agregasi, sesuaikan dengan kebutuhan
      pivotData[prov].M1 += 1;
      // Tambahkan logika agregasi lain sesuai kebutuhan
    }
  });

  // 7) Konversi Set => Array untuk filters
  const filterArrays = {
    provinceList: Array.from(filters.provinceList).sort(),
    cityList: Array.from(filters.cityList).sort(),
    mcList: Array.from(filters.mcList).sort(),
    vendorList: Array.from(filters.vendorList).sort(),
    sowList: Array.from(filters.sowList).sort(),
    ncList: Array.from(filters.ncList).sort(),
  };

  // 8) Konversi pivotData dari objek ke array
  const pivotDataArray = Object.values(pivotData);

  // 9) Build chartData (monthly grouping)
  const chartData = buildChartDataFromMarkers(markers);

  // 10) Konversi provinceToCities Map ke object
  const provinceToCitiesObj = {};
  for (let [prov, cities] of provinceToCities.entries()) {
    provinceToCitiesObj[prov] = Array.from(cities).sort();
  }

  return {
    markers,
    sites,
    pivotData: pivotDataArray,
    filters: filterArrays,
    chartData,
    provinceToCities: provinceToCitiesObj,
  };
}

module.exports = {
  processDataFromExcelBuffer,
  buildChartDataFromMarkers,
};
