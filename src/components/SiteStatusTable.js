// src/components/SiteStatusTable.js
import React from 'react';

const SiteStatusTable = ({ data }) => {
  return (
    <div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Site Status</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([status, count], idx) => (
            <tr key={idx}>
              <td>{status}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SiteStatusTable;
