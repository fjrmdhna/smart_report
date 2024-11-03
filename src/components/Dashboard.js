// src/components/Dashboard.js
import React from 'react';
import Filter from './Filter';
import PlanVsActual from './PlanVsActual';
import CoverageMap from './CoverageMap';
import SiteStatusTable from './SiteStatusTable';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = ({
  data,
  filteredMarkers,
  planVsActualData,
  filteredSiteStatus,
  selectedFilters,
  fileName,
  handleFileUpload,
  handleFilterChange,
}) => {
  return (
    <Container fluid style={{ padding: '20px' }}>
      <Form.Group controlId="fileUpload" className="mb-4">
        <Form.Label>Upload Excel File:</Form.Label>
        <Form.Control type="file" accept=".xlsx" onChange={handleFileUpload} />
        <Form.Text className="text-muted">{fileName}</Form.Text>
      </Form.Group>

      <Row className="mb-4">
        <Col xs={12} md={3}>
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
        <Col xs={12} md={9}>
          <Card className="h-100">
            <Card.Body style={{ height: '400px' }}>
              <PlanVsActual data={planVsActualData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={6} className="mb-4">
          <Card className="h-100">
            <Card.Body style={{ height: '400px' }}>
              <CoverageMap markers={filteredMarkers} />
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6} className="mb-4">
          <Card className="h-100">
            <Card.Body style={{ overflowY: 'auto', maxHeight: '400px' }}>
              <SiteStatusTable data={filteredSiteStatus} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
