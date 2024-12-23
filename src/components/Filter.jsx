// src/components/Filter.js
import React, { useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";

const Filter = ({ filters = {}, provinceToCities = {}, selectedFilters, setSelectedFilters }) => {
  const [cityOptions, setCityOptions] = useState([]);

  useEffect(() => {
    if (selectedFilters.province && selectedFilters.province !== "All") {
      setCityOptions(provinceToCities[selectedFilters.province] || []);
      // Jika kota yang dipilih tidak ada di list kota baru, reset ke "All"
      if (!provinceToCities[selectedFilters.province]?.includes(selectedFilters.city)) {
        setSelectedFilters((prev) => ({
          ...prev,
          city: "All",
        }));
      }
    } else {
      setCityOptions(filters.cityList || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters.province, provinceToCities, filters.cityList]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSelectedFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Form>
      <Row>
        {/* Province */}
        <Col md={12} className="mb-2">
          <Form.Group controlId="province">
            <Form.Label>Province</Form.Label>
            <Form.Control
              as="select"
              name="province"
              value={selectedFilters.province || "All"}
              onChange={handleFilterChange}
            >
              <option value="All">ALL</option>
              {filters.provinceList &&
                filters.provinceList.map((prov, idx) => (
                  <option key={idx} value={prov}>
                    {prov}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>
        </Col>

        {/* City */}
        <Col md={12} className="mb-2">
          <Form.Group controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              as="select"
              name="city"
              value={selectedFilters.city || "All"}
              onChange={handleFilterChange}
              disabled={selectedFilters.province === "All"}
            >
              <option value="All">ALL</option>
              {cityOptions &&
                cityOptions.map((city, idx) => (
                  <option key={idx} value={city}>
                    {city}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>
        </Col>

        {/* MC */}
        <Col md={12} className="mb-2">
          <Form.Group controlId="mc">
            <Form.Label>MC</Form.Label>
            <Form.Control
              as="select"
              name="mc"
              value={selectedFilters.mc || "All"}
              onChange={handleFilterChange}
            >
              <option value="All">ALL</option>
              {filters.mcList &&
                filters.mcList.map((mc, idx) => (
                  <option key={idx} value={mc}>
                    {mc}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>
        </Col>

        {/* Vendor */}
        <Col md={12} className="mb-2">
          <Form.Group controlId="vendor">
            <Form.Label>Vendor</Form.Label>
            <Form.Control
              as="select"
              name="vendor"
              value={selectedFilters.vendor || "All"}
              onChange={handleFilterChange}
            >
              <option value="All">ALL</option>
              {filters.vendorList &&
                filters.vendorList.map((vendor, idx) => (
                  <option key={idx} value={vendor}>
                    {vendor}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>
        </Col>

        {/* SOW */}
        <Col md={12} className="mb-2">
          <Form.Group controlId="sow">
            <Form.Label>SOW</Form.Label>
            <Form.Control
              as="select"
              name="sow"
              value={selectedFilters.sow || "All"}
              onChange={handleFilterChange}
            >
              <option value="All">ALL</option>
              {filters.sowList &&
                filters.sowList.map((sow, idx) => (
                  <option key={idx} value={sow}>
                    {sow}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>
        </Col>

        {/* NC */}
        <Col md={12} className="mb-2">
          <Form.Group controlId="nc">
            <Form.Label>NC</Form.Label>
            <Form.Control
              as="select"
              name="nc"
              value={selectedFilters.nc || "All"}
              onChange={handleFilterChange}
            >
              <option value="All">ALL</option>
              {filters.ncList &&
                filters.ncList.map((nc, idx) => (
                  <option key={idx} value={nc}>
                    {nc}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;