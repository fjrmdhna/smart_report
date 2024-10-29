// src/App.js
import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Notification from './components/Notification'; // Pastikan Anda memiliki komponen ini
import Planning from './components/Planning';         // Pastikan Anda memiliki komponen ini
import MyNavbar from './Navbar';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './Navbar.css';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  return (
    <Router>
      <div className="App">
        <MyNavbar />
        <div className="main-content"> {/* Kontainer utama untuk konten halaman */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/planning" element={<Planning />} />
            {/* Tambahkan route lainnya di sini jika diperlukan */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
