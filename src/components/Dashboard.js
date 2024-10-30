// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import {
  processDataFromExcel,
  applyFilters,
  generatePlanVsActualData,
} from '../utils/dataFormatter';
import Filter from './Filter';
import PlanVsActual from './PlanVsActual';
import CoverageMap from './CoverageMap';
import SiteStatusTable from './SiteStatusTable';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const [data, setData] = useState({ markers: [], filters: [], siteStatus: {} }); // State to store processed data
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [planVsActualData, setPlanVsActualData] = useState({
    labels: [],
    planRFI: [],
    actualRFI: [],
    planRFS: [],
    actualRFS: [],
  });
  const [filteredSiteStatus, setFilteredSiteStatus] = useState({}); // Add this state
  const [selectedFilters, setSelectedFilters] = useState({
    region: 'All',
    priority: 'All',
    siteCategory: 'All',
    ranVendor: 'All',
    program: 'All',
  });
  const [fileName, setFileName] = useState('Please Choose a file...');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = await processDataFromExcel(event.target.result);
        setData(result);
        setFilteredMarkers(result.markers); // Initially, all markers are displayed
        setFilteredSiteStatus(result.siteStatus); // Initially, siteStatus from all data
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Update filteredMarkers when selectedFilters change
  useEffect(() => {
    if (data.markers) {
      const newFilteredMarkers = applyFilters(data.markers, selectedFilters);
      setFilteredMarkers(newFilteredMarkers);
    }
  }, [selectedFilters, data.markers]);

  // Update planVsActualData and filteredSiteStatus when filteredMarkers change
  useEffect(() => {
    if (filteredMarkers) {
      const newPlanVsActualData = generatePlanVsActualData(filteredMarkers);
      setPlanVsActualData(newPlanVsActualData);

      // Calculate siteStatus based on filteredMarkers
      const statusCounts = {};
      filteredMarkers.forEach((marker) => {
        const status = marker.status || 'Unknown';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      setFilteredSiteStatus(statusCounts);
    }
  }, [filteredMarkers]);

  const handleFilterChange = (updatedFilter) => {
    setSelectedFilters(updatedFilter);
  };

  return (
    <Container fluid style={{ padding: '20px' }}>
      <Form.Group controlId="fileUpload" className="mb-4">
        <Form.Label>Upload Excel File:</Form.Label>
        <Form.Control type="file" accept=".xlsx" onChange={handleFileUpload} />
        <Form.Text className="text-muted">{fileName}</Form.Text>
      </Form.Group>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="h-100">
            <Card.Body>
              <Filter
                filters={data.filters}
                selectedFilters={selectedFilters}
                setSelectedFilters={handleFilterChange}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={9}>
          <Card className="h-100">
            <Card.Body>
              <PlanVsActual data={planVsActualData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <CoverageMap markers={filteredMarkers} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <SiteStatusTable data={filteredSiteStatus} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
