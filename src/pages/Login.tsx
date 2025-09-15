import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useNotifications } from '../context/NotificationContext';
import { Recycle, Globe, Shield, Award } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'citizen' | 'worker' | 'admin' | 'committee'>('citizen');

  const navigate = useNavigate();
  const { setUser } = useUser();
  const { addNotification } = useNotifications();

 const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();

  // Demo credentials
  const demoCredentials = {
    citizen: { email: "citizen@swachh.com", password: "citizen123" },
    worker: { email: "worker@swachh.com", password: "worker123" },
    admin: { email: "admin@swachh.com", password: "admin123" },
    committee: { email: "committee@swachh.com", password: "committee123" }
  };

  const creds = demoCredentials[role];

  if (email === creds.email && password === creds.password) {
    const mockUser = {
      id: "1",
      name: email.split("@")[0],
      email,
      role,
      greenCoins: 150,
      level: 3,
      location: "New Delhi",
    };

    setUser(mockUser);
    localStorage.setItem("swachh_token", "mock-token");
window.dispatchEvent(new Event("storage")); // 🔑 Notify App.tsx that login happened
    addNotification("Login successful!", "success");

    switch (role) {
      case "worker":
        navigate("/worker-dashboard");
        break;
      case "admin":
        navigate("/admin-dashboard");
        break;
      default:
        navigate("/dashboard");
    }
  } else {
    addNotification("Invalid email or password", "error");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Branding */}
          <div className="lg:w-1/2 bg-gradient-to-br from-green-600 to-blue-600 p-8 text-white">
            <div className="h-full flex flex-col justify-center">
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <Recycle className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold">SWACHH</h1>
                    <p className="text-green-100">Smart Waste Analytics for Clean & Healthy Habitat</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Globe className="w-6 h-6 text-green-200" />
                  <div>
                    <h3 className="font-semibold">Global Impact</h3>
                    <p className="text-sm text-green-100">Join millions in creating a cleaner world</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Award className="w-6 h-6 text-yellow-300" />
                  <div>
                    <h3 className="font-semibold">Earn Rewards</h3>
                    <p className="text-sm text-green-100">Get Green Coins for eco-friendly actions</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-blue-200" />
                  <div>
                    <h3 className="font-semibold">Secure & Transparent</h3>
                    <p className="text-sm text-green-100">Blockchain-based tracking system</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="lg:w-1/2 p-8">
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-gray-600 mb-8">Sign in to continue your green journey</p>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Your Role
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  >
                    <option value="citizen">Citizen</option>
                   
                  </select>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-6 text-center">
  <p className="text-sm text-gray-600">
    Demo credentials:<br />
    Citizen → citizen@swachh.com / citizen123<br />
    
  </p>
</div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
