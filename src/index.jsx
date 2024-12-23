import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // CSS yang sudah diubah
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
