// src/components/PlanVsActual.js
import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Mendaftarkan komponen Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Nama bulan dalam Bahasa Indonesia
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

/**
 * Mengonversi 'MM-YYYY' menjadi 'NamaBulan-YYYY'
 * @param {string} label 
 * @returns {string}
 */
const convertLabel = (label) => {
  const [month, year] = label.split('-');
  const monthIndex = parseInt(month, 10) - 1;
  const monthName = monthNames[monthIndex] || 'Unknown';
  return `${monthName}-${year}`;
};

const PlanVsActual = ({ data }) => {
  const convertedLabels = useMemo(() => 
    data.labels.map(label => convertLabel(label)), 
    [data.labels]
  );

  const chartData = useMemo(() => ({
    labels: convertedLabels,
    datasets: [
      {
        label: 'Plan RFI',
        data: data.planRFI,
        backgroundColor: '#FFCB05',
        borderColor: '#FFCB05',
        borderWidth: 1,
      },
      {
        label: 'Actual RFI',
        data: data.actualRFI,
        backgroundColor: '#32BCAD',
        borderColor: '#32BCAD',
        borderWidth: 1,
      },
      {
        label: 'Plan RFS',
        data: data.planRFS,
        backgroundColor: '#FFD700',
        borderColor: '#FFD700',
        borderWidth: 1,
      },
      {
        label: 'Actual RFS',
        data: data.actualRFS,
        backgroundColor: '#1E90FF',
        borderColor: '#1E90FF',
        borderWidth: 1,
      },
    ],
  }), [convertedLabels, data.planRFI, data.actualRFI, data.planRFS, data.actualRFS]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false, // Mengizinkan chart menyesuaikan ukuran kontainer
    plugins: {
      legend: { 
        position: 'top', 
        labels: { 
          boxWidth: 20, 
          padding: 15, 
          font: { size: 12 } 
        } 
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y}`
        }
      }
    },
    scales: {
      x: {
        title: { 
          display: true, 
          text: 'Month-Year', 
          font: { size: 14, weight: 'bold' } 
        },
        ticks: { 
          font: { size: 12 },
          maxRotation: 45, // Mengurangi rotasi label pada sumbu X
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6, // Membatasi jumlah tick maksimum
        },
      },
      y: {
        title: { 
          display: true, 
          text: 'Total', 
          font: { size: 14, weight: 'bold' } 
        },
        beginAtZero: true,
        ticks: { stepSize: 1, font: { size: 12 } },
      },
    },
    interaction: { mode: 'index', intersect: false },
    animation: { duration: 1000, easing: 'easeOutQuart' },
  }), []);

  return (
    <div style={{ width: '100%', height: '100%' }}> {/* Menyesuaikan ukuran dengan kontainer */}
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default PlanVsActual;
