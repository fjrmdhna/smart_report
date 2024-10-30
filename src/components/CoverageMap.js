// src/components/CoverageMap.js
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Definisikan ikon marker ungu
const purpleIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/**
 * Komponen untuk mengatur batas peta agar mencakup semua marker.
 * @param {Array} markers - Array objek marker dengan properti lat dan lng.
 */
const SetMapBounds = ({ markers }) => {
  const map = useMap();

  useEffect(() => {
    if (markers.length === 0) return;

    // Membuat array LatLng dari marker
    const bounds = L.latLngBounds(markers.map(marker => [marker.lat, marker.lng]));

    // Mengatur peta untuk menyesuaikan batas tersebut dengan padding
    map.fitBounds(bounds, { padding: [50, 50] });

    // Optional: Mengatur zoom minimum untuk menghindari zoom terlalu dekat
    const currentZoom = map.getZoom();
    const minZoom = 5;
    if (currentZoom < minZoom) {
      map.setZoom(minZoom);
    }
  }, [markers, map]);

  return null;
};

const CoverageMap = ({ markers }) => {
  return (
    <div style={{ width: '100%', height: '100%' }}> {/* Menggunakan height: '100%' */}
      <MapContainer 
        center={[-2.5489, 118.0149]} 
        zoom={5} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <SetMapBounds markers={markers} /> {/* Komponen untuk mengatur batas peta */}
        {markers.map((marker, index) => (
          <Marker key={index} position={[marker.lat, marker.lng]} icon={purpleIcon}>
            <Popup>
              <strong>{marker.siteName}</strong><br />
              Vendor: {marker.vendor}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default CoverageMap;
