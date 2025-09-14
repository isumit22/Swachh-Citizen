import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

// Custom truck icon
const truckIcon = new L.Icon({
  iconUrl: "/icons/3543570.png", // keep inside /public/icons/
  iconSize: [50, 50],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Custom complaint icon
const complaintIcon = new L.Icon({
  iconUrl: "/icons/8027578.png", // keep inside /public/icons/
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

// Pickup icon
const pickupIcon = new L.Icon({
  iconUrl: "/icons/pivk.png", // keep inside /public/icons/
  iconSize: [60, 60],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const MapTracking: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [trackingMode, setTrackingMode] = useState<
    "vehicles" | "complaints" | "pickups"
  >("vehicles");

  const [vehicles, setVehicles] = useState([
    {
      id: "VH-001",
      driver: "Rajesh Kumar",
      status: "collecting",
      location: "Block E, Gamma 1",
      coords: { lat: 28.482434, lng: 77.502169 },
    },
    {
      id: "VH-002",
      driver: "Priya Sharma",
      status: "transit",
      location: "Block I, Alpha 2",
      coords: { lat: 28.476355, lng: 77.519853 },
    },
    {
      id: "VH-003",
      driver: "Amit Patel",
      status: "maintenance",
      location: "Nagar Palika Dadri",
      coords: { lat: 28.558393, lng: 77.549408 },
    },
  ]);

  const complaints = [
    {
      id: "CMP-001",
      type: "Overflow",
      location: "NRI City, Omega 2",
      severity: "high",
      timeReported: "1 hour ago",
      coords: { lat: 28.460314, lng: 77.514954 },
    },
    {
      id: "CMP-002",
      type: "Missed Collection",
      location: "KKC Knowledge Park 3",
      severity: "medium",
      timeReported: "12 mins ago",
      coords: { lat: 28.468942, lng: 77.491353 },
    },
  ];

  // 🚛 Updated pickup points (real locations & timings)
  const pickupPoints = [
    {
      location: "Gautam Buddha University",
      time: "6:00 AM - 6:45 AM",
      coords: { lat: 28.42, lng: 77.53 },
    },
    {
      location: "Pari Chowk",
      time: "7:15 AM - 8:00 AM",
      coords: { lat: 28.463276, lng: 77.508196 },
    },
    {
      location: "Knowledge Park II",
      time: "8:15 AM - 9:00 AM",
      coords: { lat: 28.456956, lng: 77.500189 },
    },
    {
      location: "Ecotech III Industrial Area",
      time: "9:30 AM - 10:15 AM",
      coords: { lat: 28.536429, lng: 77.46342 },
    },
    {
      location: "Sector Omega 1",
      time: "10:45 AM - 11:30 AM",
      coords: { lat: 28.454167, lng: 77.5125 },
    },
    {
      location: "Greater Noida Authority Office",
      time: "12:00 PM - 12:45 PM",
      coords: { lat: 28.4846, lng: 77.5365 },
    },
  ];

  // Move vehicles (but not maintenance)
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((v) =>
          v.status === "maintenance"
            ? v
            : {
                ...v,
                coords: {
                  lat: v.coords.lat + (Math.random() - 0.5) * 0.0005,
                  lng: v.coords.lng + (Math.random() - 0.5) * 0.0005,
                },
              }
        )
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "collecting":
        return "text-blue-600 bg-blue-100";
      case "transit":
        return "text-green-600 bg-green-100";
      case "maintenance":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Real-Time Tracking
          </h1>
          <p className="text-gray-600">
            Monitor vehicles, complaints & pickup schedules
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-2 shadow-lg">
            <button
              onClick={() => setTrackingMode("vehicles")}
              className={`px-6 py-3 rounded-lg transition-colors ${
                trackingMode === "vehicles"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                  : "text-gray-600 hover:text-orange-600"
              }`}
            >
              Vehicles
            </button>
            <button
              onClick={() => setTrackingMode("complaints")}
              className={`px-6 py-3 rounded-lg transition-colors ${
                trackingMode === "complaints"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                  : "text-gray-600 hover:text-orange-600"
              }`}
            >
              Complaints
            </button>
            <button
              onClick={() => setTrackingMode("pickups")}
              className={`px-6 py-3 rounded-lg transition-colors ${
                trackingMode === "pickups"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                  : "text-gray-600 hover:text-orange-600"
              }`}
            >
              Pickup Points
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden relative">
            <MapContainer
              center={[28.463276, 77.508196]} // default center = Pari Chowk
              zoom={13}
              className="h-96 w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />

              {trackingMode === "vehicles" &&
                vehicles.map((v) => (
                  <Marker
                    key={v.id}
                    position={[v.coords.lat, v.coords.lng]}
                    icon={truckIcon}
                  >
                    <Popup>
                      <strong>{v.id}</strong> ({v.status}) <br />
                      {v.driver} <br />
                      {v.location}
                    </Popup>
                  </Marker>
                ))}

              {trackingMode === "complaints" &&
                complaints.map((c) => (
                  <Marker
                    key={c.id}
                    position={[c.coords.lat, c.coords.lng]}
                    icon={complaintIcon}
                  >
                    <Popup>
                      <strong>{c.type}</strong> <br />
                      {c.location} <br />
                      Reported: {c.timeReported}
                    </Popup>
                  </Marker>
                ))}

              {trackingMode === "pickups" &&
                pickupPoints.map((p, i) => (
                  <Marker
                    key={i}
                    position={[p.coords.lat, p.coords.lng]}
                    icon={pickupIcon}
                  >
                    <Popup>
                      <strong>{p.location}</strong> <br />
                      Time: {p.time}
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {trackingMode === "vehicles" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Active Vehicles
                </h2>
                {vehicles.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVehicle(v)}
                    className={`mb-4 p-3 border rounded-lg hover:border-blue-400 cursor-pointer ${
                      selectedVehicle?.id === v.id
                        ? "border-blue-500 bg-blue-50"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between">
                      <span className="font-semibold">{v.id}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                          v.status
                        )}`}
                      >
                        {v.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{v.driver}</p>
                    <p className="text-xs text-gray-500">{v.location}</p>
                  </div>
                ))}
              </div>
            )}

            {trackingMode === "complaints" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Active Complaints
                </h2>
                {complaints.map((c) => (
                  <div key={c.id} className="mb-4 p-3 border rounded-lg">
                    <h3 className="font-semibold">{c.type}</h3>
                    <p className="text-sm text-gray-600">{c.location}</p>
                    <p className="text-xs text-gray-500">{c.timeReported}</p>
                  </div>
                ))}
              </div>
            )}

            {trackingMode === "pickups" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Pickup Points
                </h2>
                {pickupPoints.map((p, i) => (
                  <div key={i} className="mb-4">
                    <h3 className="font-semibold text-orange-600">
                      {p.location}
                    </h3>
                    <p className="text-sm text-gray-700">
                      Time:{" "}
                      <span className="text-gray-500">{p.time}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapTracking;
