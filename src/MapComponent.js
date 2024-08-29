import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom Icon untuk Marker
const customIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapComponent = ({ mapMarkers }) => {
  return (
    <div className="map-container">
      <MapContainer center={[-2.5, 118]} zoom={5} style={{ height: "300px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerClusterGroup>
          {mapMarkers.map((marker, index) => {
            // Debugging untuk memastikan bahwa data marker termasuk region tersedia
            console.log('Marker data:', marker);

            return (
              <Marker key={index} position={[marker.lat, marker.lng]} icon={customIcon}>
                <Popup>
                  <div>
                    <strong>Site Name:</strong> {marker.siteName || 'N/A'}<br />
                    <strong>Region:</strong> {marker.region || 'N/A'}<br />
                    <strong>Vendor:</strong> {marker.vendor || 'N/A'}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
      <div className="map-total">
        <p>Total: {mapMarkers.length}</p>
      </div>
    </div>
  );
};

export default MapComponent;
