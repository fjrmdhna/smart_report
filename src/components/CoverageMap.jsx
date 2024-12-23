// src/components/CoverageMap.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

// Define a custom icon for the markers
const defaultIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const createClusterCustomIcon = (cluster) => {
  const count = cluster.getChildCount();
  let size = "large";

  if (count < 10) {
    size = "small";
  } else if (count >= 10 && count < 100) {
    size = "medium";
  }

  return L.divIcon({
    html: `<div class="cluster-icon cluster-${size}">${count}</div>`,
    className: "custom-cluster-icon",
    iconSize: L.point(40, 40, true),
  });
};

const CoverageMap = ({ markers }) => {
  // Filter valid markers
  const validMarkers = markers.filter(
    (marker) =>
      marker.lat && marker.lng && !isNaN(marker.lat) && !isNaN(marker.lng),
  );

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <MapContainer
        center={[-2.5489, 118.0149]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
        >
          {validMarkers.map((marker, index) => (
            <Marker
              key={index}
              position={[marker.lat, marker.lng]}
              icon={defaultIcon}
            >
              <Popup>
                <strong>{marker.siteName || "Unknown"}</strong>
                <br />
                Vendor: {marker.ranVendor || "Unknown"} {/* Menggunakan ranVendor */}
                <br />
                Province: {marker.province || "Unknown"} {/* Menambahkan Province */}
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default CoverageMap;

// CSS for the clustering
const clusterStyles = document.createElement("style");
clusterStyles.type = "text/css";
clusterStyles.innerHTML = `
  .cluster-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: rgba(51, 136, 255, 0.8);
    color: white;
    font-size: 12px;
    font-weight: bold;
    text-align: center;
  }
  .cluster-small {
    width: 30px;
    height: 30px;
  }
  .cluster-medium {
    width: 40px;
    height: 40px;
  }
  .cluster-large {
    width: 50px;
    height: 50px;
  }
`;
document.head.appendChild(clusterStyles);
