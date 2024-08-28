import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from 'react-bootstrap';

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
          {mapMarkers.map((marker, index) => (
            <Marker key={index} position={[marker.lat, marker.lng]} icon={customIcon} />
          ))}
        </MarkerClusterGroup>
      </MapContainer>
      <div className="map-total text-center mt-2">
        <p>Total: {mapMarkers.length}</p>
      </div>
    </div>
  );
};

export default MapComponent;
