// src/components/Filter.js
import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const Filter = ({ filters = {}, selectedFilters, setSelectedFilters }) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSelectedFilters({
      ...selectedFilters,
      [name]: value,
    });
  };

  return (
    <Form>
      <Row>
        {/* Filter Region */}
        <Col md={12} className="mb-2">
          <Form.Group controlId="region">
            <Form.Label>Region</Form.Label>
            <Form.Control
              as="select"
              name="region"
              value={selectedFilters.region}
              onChange={handleFilterChange}
            >
              <option value="All">All</option>
              {filters.regions && filters.regions.map((region, idx) => (
                <option key={idx} value={region}>{region}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>

        {/* Filter Priority */}
        <Col md={12} className="mb-2">
          <Form.Group controlId="priority">
            <Form.Label>Priority</Form.Label>
            <Form.Control
              as="select"
              name="priority"
              value={selectedFilters.priority}
              onChange={handleFilterChange}
            >
              <option value="All">All</option>
              {filters.priorities && filters.priorities.map((priority, idx) => (
                <option key={idx} value={priority}>{priority}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>

        {/* Filter Site Category */}
        <Col md={12} className="mb-2">
          <Form.Group controlId="siteCategory">
            <Form.Label>Site Category</Form.Label>
            <Form.Control
              as="select"
              name="siteCategory"
              value={selectedFilters.siteCategory}
              onChange={handleFilterChange}
            >
              <option value="All">All</option>
              {filters.siteCategories && filters.siteCategories.map((category, idx) => (
                <option key={idx} value={category}>{category}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>

        {/* Filter RAN Vendor */}
        <Col md={12} className="mb-2">
          <Form.Group controlId="ranVendor">
            <Form.Label>RAN Vendor</Form.Label>
            <Form.Control
              as="select"
              name="ranVendor"
              value={selectedFilters.ranVendor}
              onChange={handleFilterChange}
            >
              <option value="All">All</option>
              {filters.ranVendors && filters.ranVendors.map((vendor, idx) => (
                <option key={idx} value={vendor}>{vendor}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>

        {/* Filter Program */}
        <Col md={12} className="mb-2">
          <Form.Group controlId="program">
            <Form.Label>Program</Form.Label>
            <Form.Control
              as="select"
              name="program"
              value={selectedFilters.program}
              onChange={handleFilterChange}
            >
              <option value="All">All</option>
              {filters.programs && filters.programs.map((program, idx) => (
                <option key={idx} value={program}>{program}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
