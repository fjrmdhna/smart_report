// src/components/PivotSummary.js
import React from "react";
import { Table } from "react-bootstrap";

const PivotSummary = ({ pivotData }) => {
  // pivotData contohnya:
  // [
  //   { zone: "WEST", M1: 175, M2: 687, M3: 460, ... },
  //   { zone: "EAST", M1: 401, M2: 335, M3: 638, ... }
  // ]

  if (!pivotData || pivotData.length === 0) {
    return <div>No pivot data available.</div>;
  }

  // Ambil list kolom (selain "zone") dari record pertama
  const columns = Object.keys(pivotData[0]).filter((key) => key !== "zone");

  return (
    <div style={{ overflowX: "auto" }}>
      <Table bordered hover size="sm">
        <thead>
          <tr>
            <th>ZONE</th>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pivotData.map((row, idx) => (
            <tr key={idx}>
              <td>{row.zone}</td>
              {columns.map((col) => (
                <td key={col}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default PivotSummary;
