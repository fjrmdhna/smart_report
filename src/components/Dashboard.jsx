// src/components/Dashboard.jsx
import React from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import Filter from "./Filter";
import ProgressChart from "./ProgressChart";
import PivotSummary from "./PivotSummary";
import SiteDataTable from "./SiteDataTable";
import CoverageMap from "./CoverageMap";

const Dashboard = ({
  fileName,
  handleFileUpload,
  filters,
  provinceToCities,
  selectedFilters,
  handleFilterChange,
  pivotData,
  chartData,
  sites,
  markersForMap,
  sitesPagination,
  handleSitesPageChange,
}) => {
  return (
    <Container fluid className="py-4">
      {/* Upload File */}
      <Form.Group controlId="fileUpload" className="mb-4">
        <Form.Label>Upload Excel File:</Form.Label>
        <Form.Control type="file" accept=".xlsx" onChange={handleFileUpload} />
        <Form.Text className="text-muted">{fileName}</Form.Text>
      </Form.Group>

      {/* Row pertama: Filter, Chart, Map */}
      <Row className="mb-4 g-4">
        <Col xs={12} md={3}>
          <Card className="h-100" style={{ minWidth: "250px" }}>
            <Card.Body>
              <Filter
                filters={filters}
                provinceToCities={provinceToCities}
                selectedFilters={selectedFilters}
                setSelectedFilters={handleFilterChange}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card className="h-100">
            <Card.Body style={{ height: "400px" }}>
              {/* Chart bulanan + onClick => detail harian */}
              <ProgressChart chartData={chartData} getDailyData={null} /> {/* getDailyData is not implemented */}
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={5}>
          <Card className="h-100">
            <Card.Body style={{ height: "400px" }}>
              <CoverageMap markers={markersForMap} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Row kedua: PivotSummary & SiteDataTable */}
      <Row className="mb-4 g-4">
        <Col xs={12} md={6}>
          <Card className="h-100">
            <Card.Header>Pivot Summary by MC</Card.Header>
            <Card.Body>
              <PivotSummary pivotData={pivotData} />
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card className="h-100">
            <Card.Header>Site Data</Card.Header>
            <Card.Body>
              <SiteDataTable sites={sites} />
              {/* Pagination Controls for Sites */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <Button
                  variant="secondary"
                  onClick={() => handleSitesPageChange(sitesPagination.page - 1)}
                  disabled={sitesPagination.page === 1}
                >
                  Previous
                </Button>
                <span>
                  Page {sitesPagination.page} of {sitesPagination.totalPages}
                </span>
                <Button
                  variant="secondary"
                  onClick={() => handleSitesPageChange(sitesPagination.page + 1)}
                  disabled={sitesPagination.page === sitesPagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
