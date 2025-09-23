import React, { useState, useRef } from "react";
import {
  Camera,
  Upload,
  Scan,
  CheckCircle,
  Info,
  Recycle,
  Leaf,
  AlertTriangle,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import { useNotifications } from "../context/NotificationContext";
import Webcam from "react-webcam";

interface ScanResult {
  name: string;
  category: string;
  bin: {
    name: string;
    color: string;
    icon: string;
  };
  tips: string;
  coins: number;
  icon: string;
  severity: string;
  confidence?: number;
  timestamp: Date;
  id: number;
}

const WasteScanner: React.FC = () => {
  const [scannedItem, setScannedItem] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraIntervalId, setCameraIntervalId] = useState<NodeJS.Timer | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const { updateGreenCoins } = useUser();
  const { addNotification } = useNotifications();

  // 🔹 Icon helper for waste type
  const getIcon = (wasteType: string) => {
    if (wasteType.toLowerCase().includes("plastic")) return "🧴";
    if (wasteType.toLowerCase().includes("metal")) return "🥤";
    if (wasteType.toLowerCase().includes("glass")) return "🍾";
    if (wasteType.toLowerCase().includes("paper")) return "📄";
    if (wasteType.toLowerCase().includes("battery")) return "🔋";
    if (wasteType.toLowerCase().includes("food")) return "🍎";
    return "♻️";
  };

  // 🔹 Bin icons
  const binIcons: Record<string, JSX.Element> = {
    recycle: <Recycle className="w-5 h-5" />,
    leaf: <Leaf className="w-5 h-5" />,
    "alert-triangle": <AlertTriangle className="w-5 h-5" />,
  };

  // 🔹 Function to send image to server
  const sendFrameToServer = async (blob: Blob) => {
    const formData = new FormData();
    formData.append("file", blob, "frame.jpg");

    setIsScanning(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Prediction failed");

      const data = await res.json();

      const scanResult: ScanResult = {
        name: data.waste_type,
        category: data.category,
        bin: data.bin,
        tips: data.tip,
        coins: data.recyclable ? 5 : 2,
        icon: getIcon(data.waste_type),
        severity: data.recyclable ? "low" : "high",
        confidence: data.confidence,
        timestamp: new Date(),
        id: Date.now(),
      };

      setScannedItem(scanResult);
      setScanHistory((prev) => [scanResult, ...prev.slice(0, 9)]);
      updateGreenCoins(scanResult.coins);
      addNotification(`Earned ${scanResult.coins} Green Coins!`, "success");
    } catch (error) {
      console.error("Error scanning:", error);
    } finally {
      setIsScanning(false);
    }
  };

  // 🔹 Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await sendFrameToServer(file);
  };

  // 🔹 Open camera and start continuous detection
  const handleOpenCamera = () => {
    setIsCameraOpen(true);
    const interval = setInterval(async () => {
      if (!webcamRef.current) return;
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      const res = await fetch(imageSrc);
      const blob = await res.blob();
      await sendFrameToServer(blob);
    }, 1500); // every 1.5s
    setCameraIntervalId(interval);
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
    if (cameraIntervalId) clearInterval(cameraIntervalId);
  };

  const getBinColor = (binName: string) => {
    switch (binName) {
      case "Blue Bin":
        return "text-blue-600 bg-blue-100";
      case "Green Bin":
        return "text-green-600 bg-green-100";
      case "No Bin":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Scan className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Waste Scanner</h1>
          <p className="text-gray-600">
            Scan items to learn proper disposal methods and earn Green Coins
          </p>
        </div>

        {/* Scanner */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center">
            {isScanning ? (
              <div className="py-16">
                <div className="animate-spin w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-lg font-medium text-gray-700">Analyzing item...</p>
                <p className="text-sm text-gray-500">
                  AI is identifying waste type and disposal method
                </p>
              </div>
            ) : (
              <div className="py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                  {/* Take Photo / Live Camera */}
                  <button
                    onClick={handleOpenCamera}
                    className="flex flex-col items-center space-y-3 p-6 border-2 border-dashed border-green-300 rounded-xl hover:border-green-400 hover:bg-green-50 transition-colors"
                  >
                    <Camera className="w-8 h-8 text-green-500" />
                    <span className="font-medium text-gray-700">Take Photo</span>
                  </button>

                  {/* Upload Image */}
                  <button
                    onClick={() => document.getElementById("uploadInput")?.click()}
                    className="flex flex-col items-center space-y-3 p-6 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-blue-500" />
                    <span className="font-medium text-gray-700">Upload Image</span>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <input
                  id="uploadInput"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <p className="text-sm text-gray-500 mt-4">
                  Supports JPG, PNG formats. AI powered by advanced image recognition.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Live Camera Overlay */}
        {isCameraOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={400}
                videoConstraints={{ facingMode: "environment" }}
              />
              <button
                onClick={handleCloseCamera}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg w-full"
              >
                Close Camera
              </button>
            </div>
          </div>
        )}

        {/* Result Display */}
        {scannedItem && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-start space-x-4">
              <div className="text-6xl">{scannedItem.icon}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h2 className="text-2xl font-bold text-gray-800">{scannedItem.name}</h2>
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getBinColor(
                      scannedItem.bin.name
                    )}`}
                  >
                    {binIcons[scannedItem.bin.icon]}
                    {scannedItem.bin.name}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                    {scannedItem.category}
                  </span>
                  <span className={`text-sm font-medium ${getSeverityColor(scannedItem.severity)}`}>
                    Priority: {scannedItem.severity.toUpperCase()}
                  </span>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-2">
                    <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-800 mb-1">Disposal Instructions</h3>
                      <p className="text-blue-700">{scannedItem.tips}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🪙</span>
                    <span className="font-bold text-green-600">+{scannedItem.coins} Green Coins</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    Scanned {scannedItem.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History */}
        {scanHistory.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Scans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scanHistory.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getBinColor(
                          item.bin.name
                        )}`}
                      >
                        {binIcons[item.bin.icon]}
                        {item.bin.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-green-600 font-medium">+{item.coins} coins</span>
                    <span className="text-gray-500">{item.timestamp.toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WasteScanner;
