import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { processDataFromExcel } from './dataFormatter';
import MapComponent from './MapComponent'; 
import { Container, Row, Col, Table, Card, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const [mapMarkers, setMapMarkers] = useState([]);
  const [planVsActualData, setPlanVsActualData] = useState({ labels: [], plan: [], actual: [] });
  const [vendorData, setVendorData] = useState([]);
  const [deliverySummary, setDeliverySummary] = useState([]);
  const [fileName, setFileName] = useState('Choose file...');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name); // Menampilkan nama file yang dipilih
      const reader = new FileReader();

      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets['Data'];

        // Memproses data menggunakan dataFormatter.js
        const { formattedData, markers, vendorSummary, deliveryPlanSummary } = processDataFromExcel(sheet);

        setMapMarkers(markers);
        setPlanVsActualData(formattedData);
        setVendorData(vendorSummary);
        setDeliverySummary(deliveryPlanSummary);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  // Data untuk chart plan vs actual
  const planVsActualChartData = {
    labels: planVsActualData.labels,
    datasets: [
      {
        label: 'Plan',
        data: planVsActualData.plan,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Actual',
        data: planVsActualData.actual,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  return (
    <Container fluid className="dashboard-container">
      <h1 className="my-4 text-center">Dashboard Proyek</h1>

      <Form.Group controlId="fileUpload" className="mb-4">
        <Form.Label>Upload Excel File:</Form.Label>
        <div className="custom-file">
          <Form.Control 
            type="file" 
            accept=".xlsx" 
            className="custom-file-input"
            onChange={handleFileUpload} 
          />
          <Form.Label className="custom-file-label">{fileName}</Form.Label>
        </div>
      </Form.Group>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="card-title">Map Distribution</h2>
              <MapComponent mapMarkers={mapMarkers} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="card-title">Delivery Plan</h2>
              {planVsActualData.labels.length > 0 ? (
                <Bar data={planVsActualChartData} />
              ) : (
                <p>No data available</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="card-title">Vendor Summary</h2>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Vendor</th>
                    <th>Scope</th>
                    <th>OA Actual</th>
                    <th>OA %</th>
                  </tr>
                </thead>
                <tbody>
                  {vendorData.map((vendor, index) => (
                    <tr key={index}>
                      <td>{vendor.vendor}</td>
                      <td>{vendor.scope}</td>
                      <td>{vendor.actual}</td>
                      <td>{vendor.percentage}</td>
                    </tr>
                  ))}
                  {/* Tambahkan baris untuk Grand Total */}
                  <tr className="table-success">
                    <td><strong>Grand Total</strong></td>
                    <td><strong>{vendorData.reduce((sum, vendor) => sum + vendor.scope, 0)}</strong></td>
                    <td><strong>{vendorData.reduce((sum, vendor) => sum + vendor.actual, 0)}</strong></td>
                    <td><strong>{vendorData.length > 0 ? `${((vendorData.reduce((sum, vendor) => sum + vendor.actual, 0) / vendorData.reduce((sum, vendor) => sum + vendor.scope, 0)) * 100).toFixed(2)}%` : 'N/A'}</strong></td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="card-title">Delivery Plan Summary</h2>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Plan</th>
                    <th>Actual</th>
                  </tr>
                </thead>
                <tbody>
                  {deliverySummary.map((summary, index) => (
                    <tr key={index}>
                      <td>{summary.year}</td>
                      <td>{summary.plan}</td>
                      <td>{summary.actual}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
