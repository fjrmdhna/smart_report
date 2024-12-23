// src/components/ProgressChart.jsx
import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import PropTypes from "prop-types";

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

const ProgressChart = ({ chartData, getDailyData }) => {
  // State untuk drill-down
  const [drillDownMonth, setDrillDownMonth] = useState(null);
  const [dailyChartData, setDailyChartData] = useState(null);

  // === Data bulanan ===
  const monthlyData = {
    labels: chartData.labels, // contoh: ["11-2024","12-2024", ...]
    datasets: [
      {
        label: "Survey BF",
        backgroundColor: "#FFC107",
        data: chartData.surveyBF,
      },
      {
        label: "Survey AF",
        backgroundColor: "#FFA000",
        data: chartData.surveyAF,
      },
      {
        label: "MOS BF",
        backgroundColor: "#FF7043",
        data: chartData.mosBF,
      },
      {
        label: "MOS AF",
        backgroundColor: "#FF5722",
        data: chartData.mosAF,
      },
      {
        label: "Cutover BF",
        backgroundColor: "#2196F3",
        data: chartData.cutoverBF,
      },
      {
        label: "Cutover AF",
        backgroundColor: "#1565C0",
        data: chartData.cutoverAF,
      },
      {
        label: "Dismantle BF",
        backgroundColor: "#4CAF50",
        data: chartData.dismantleBF,
      },
      {
        label: "Dismantle AF",
        backgroundColor: "#2E7D32",
        data: chartData.dismantleAF,
      },
    ],
  };

  // === Konfigurasi chart bulanan ===
  const monthlyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (evt, elements) => {
      if (elements && elements.length > 0 && getDailyData) {
        const index = elements[0].index;
        const monthLabel = monthlyData.labels[index];
        // Panggil getDailyData untuk drill-down
        const daily = getDailyData(monthLabel);
        if (daily) {
          setDrillDownMonth(monthLabel);
          setDailyChartData(daily);
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: "Monthly Chart (Click a bar to see detail)",
      },
      legend: {
        position: "top",
        labels: {
          // Pengaturan agar legend lebih rapi
          boxWidth: 20,
          boxHeight: 15,
          padding: 10,
          font: {
            size: 12,
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 6,
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  // Tombol kembali ke tampilan bulanan
  const handleBack = () => {
    setDrillDownMonth(null);
    setDailyChartData(null);
  };

  return (
    <div style={{ height: "100%", position: "relative" }}>
      {drillDownMonth && dailyChartData ? (
        <>
          <button
            onClick={handleBack}
            style={{
              position: "absolute",
              zIndex: 9999,
              top: 0,
              left: 0,
              margin: "5px",
            }}
          >
            Back
          </button>
          <div style={{ height: "100%", paddingTop: "30px" }}>
            <Bar data={dailyChartData} options={monthlyOptions} />
          </div>
        </>
      ) : (
        <Bar data={monthlyData} options={monthlyOptions} />
      )}
    </div>
  );
};

ProgressChart.propTypes = {
  chartData: PropTypes.object.isRequired,
  getDailyData: PropTypes.func,
};

export default ProgressChart;
