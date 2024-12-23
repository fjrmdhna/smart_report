// src/components/SiteDataTable.jsx
import React from "react";
import { FixedSizeList as List } from "react-window";
import PropTypes from "prop-types";

const SiteDataTable = ({ sites }) => {
  if (!sites || sites.length === 0) {
    return <div>No site data available.</div>;
  }

  const Row = ({ index, style }) => {
    const site = sites[index];
    return (
      <div style={{ ...style, display: "flex", borderBottom: "1px solid #dee2e6" }}>
        <div style={{ flex: "1 1 100px", padding: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{site.siteId}</div>
        <div style={{ flex: "2 1 200px", padding: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{site.siteName}</div>
        <div style={{ flex: "1 1 100px", padding: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{site.mc}</div>
        {/* Tambahkan kolom lain sesuai kebutuhan */}
      </div>
    );
  };

  return (
    <div style={{ height: "400px", width: "100%", overflow: "auto" }}>
      <div style={{ display: "flex", fontWeight: "bold", borderBottom: "2px solid #000", padding: "8px" }}>
        <div style={{ flex: "1 1 100px" }}>Site ID</div>
        <div style={{ flex: "2 1 200px" }}>Site Name</div>
        <div style={{ flex: "1 1 100px" }}>MC</div>
        {/* Tambahkan header kolom lain sesuai kebutuhan */}
      </div>
      <List
        height={350}
        itemCount={sites.length}
        itemSize={35}
        width={"100%"}
      >
        {Row}
      </List>
    </div>
  );
};

SiteDataTable.propTypes = {
  sites: PropTypes.array.isRequired,
};

export default SiteDataTable;
