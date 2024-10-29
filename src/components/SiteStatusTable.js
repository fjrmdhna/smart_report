// src/components/SiteStatusTable.js
import React from 'react';

const SiteStatusTable = ({ data }) => {
  return (
    <div>
      <h3>Site Status</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>No.</th>
            <th>Site Status</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(data).length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">No data available.</td>
            </tr>
          ) : (
            Object.entries(data).map(([status, count], idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{status}</td>
                <td>{count}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SiteStatusTable;
