import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { 
  Scan, 
  BookOpen, 
  Users, 
  MapPin, 
  Award, 
  TrendingUp, 
  Calendar,
  Target,
  Coins
} from 'lucide-react';
import { Camera } from 'lucide-react';

const CitizenDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const quickActions = [
    {
      title: 'Scan Waste',
      description: 'Identify waste type and get disposal tips',
      icon: Scan,
      color: 'from-green-500 to-green-600',
      action: () => navigate('/scanner')
    },
    {
      title: 'Training',
      description: 'Learn proper waste segregation',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      action: () => navigate('/training')
    },
    
      
    {
      title: 'Track Vehicles',
      description: 'Monitor waste collection in real-time',
      icon: MapPin,
      color: 'from-orange-500 to-orange-600',
      action: () => navigate('/tracking')
    },
    {
    title: 'Complaint',
    description: 'Report issue with photo & location',
    icon: Camera,
    color: 'from-red-500 to-red-600',
    action: () => navigate('/complaint')   // new route
  }
  ];

  const achievements = [
    { title: 'Waste Warrior', description: 'Scanned 50+ items', earned: true },
    { title: 'Green Champion', description: 'Completed all training modules', earned: true },
    { title: 'Community Leader', description: 'Organized 3 cleanup drives', earned: false },
    { title: 'Eco Expert', description: 'Earned 500 Green Coins', earned: false }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-green-100 mb-4">Ready to make a difference today?</p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5" />
                <span className="font-semibold">{user?.greenCoins} Green Coins</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span className="font-semibold">Level {user?.level}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">This Week</p>
                <p className="text-2xl font-bold">+25 Coins</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickActions.map((action, index) => (
          <div
            key={index}
            onClick={action.action}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          >
            <div className={`bg-gradient-to-r ${action.color} p-6 rounded-t-xl`}>
              <action.icon className="w-8 h-8 text-white" />
            </div>
            <div className="p-6">
              <h3 className="font-bold text-lg mb-2">{action.title}</h3>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats and Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Scan className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium">Scanned plastic bottle</p>
                <p className="text-sm text-gray-600">Earned 5 Green Coins • 2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium">Completed training module</p>
                <p className="text-sm text-gray-600">Earned 10 Green Coins • 1 day ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium">Joined community challenge</p>
                <p className="text-sm text-gray-600">Plastic-free week • 2 days ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Achievements</h2>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  achievement.earned
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Award
                    className={`w-5 h-5 ${
                      achievement.earned ? 'text-yellow-500' : 'text-gray-400'
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      achievement.earned ? 'text-yellow-800' : 'text-gray-500'
                    }`}
                  >
                    {achievement.title}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Upcoming Events</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-green-500" />
              <span className="font-medium">Plastic-Free Week Challenge</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Reduce plastic usage and earn bonus coins</p>
            <p className="text-xs text-green-600 font-medium">Starts in 3 days</p>
          </div>
          
          <div className="border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Community Cleanup Drive</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Join neighbors for local area cleaning</p>
            <p className="text-xs text-blue-600 font-medium">This Saturday, 7 AM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;