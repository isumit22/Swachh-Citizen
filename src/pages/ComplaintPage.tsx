import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

// Location Picker Component
const LocationPicker = ({
  setPosition,
}: {
  setPosition: (pos: [number, number]) => void;
}) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const ComplaintPage: React.FC = () => {
  const navigate = useNavigate();
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [details, setDetails] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // Get user’s current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.error(err);
          setPosition([28.6139, 77.209]); // fallback → Delhi
        }
      );
    } else {
      setPosition([28.6139, 77.209]); // fallback → Delhi
    }
  }, []);

  // Preview uploaded photo
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  // Form submission
  const handleSubmit = () => {
    setMessage(
      "✅ Your complaint has been received and will be resolved within an hour."
    );
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          📍 File a Complaint
        </h1>

        {/* Map Section */}
        <div className="mb-6">
          {position ? (
            <MapContainer
              center={position}
              zoom={15}
              className="h-72 rounded-xl shadow-md"
            >
              <TileLayer
                attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position} />
              <LocationPicker setPosition={setPosition} />
            </MapContainer>
          ) : (
            <p className="text-gray-600">📡 Detecting your location...</p>
          )}
          {position && (
            <p className="text-sm text-gray-500 mt-2">
              Selected Location: {position[0].toFixed(4)},{" "}
              {position[1].toFixed(4)}
            </p>
          )}
        </div>

        {/* Complaint Form */}
        <div className="space-y-5">
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              📝 Complaint Details
            </label>
            <textarea
              className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              rows={3}
              placeholder="Describe the issue..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              📷 Upload Photo
            </label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="block w-full text-gray-600"
              onChange={handleImageChange}
            />
            {preview && (
              <div className="mt-3">
                <img
                  src={preview}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-lg border shadow-sm"
                />
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-white font-semibold rounded-lg shadow-md 
bg-gradient-to-r from-green-400 to-blue-500 
hover:from-green-500 hover:to-blue-600 
transition duration-300"
          >
            Submit Complaint
          </button>

          {message && (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg text-center shadow">
              {message}
              <p className="text-sm text-gray-500 mt-1">
                Redirecting to Dashboard...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintPage;
