import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
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
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
