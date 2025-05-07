import React from 'react';
import { motion } from 'framer-motion';
import { Bike, Users, Calendar, DollarSign } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

// Mock data for demonstration
const dailyUsers = [
  { date: 'Mon', users: 4 },
  { date: 'Tue', users: 3 },
  { date: 'Wed', users: 5 },
  { date: 'Thu', users: 2 },
  { date: 'Fri', users: 6 },
  { date: 'Sat', users: 8 },
  { date: 'Sun', users: 7 },
];

const dailyRentals = [
  { date: 'Mon', rentals: 12 },
  { date: 'Tue', rentals: 15 },
  { date: 'Wed', rentals: 10 },
  { date: 'Thu', rentals: 18 },
  { date: 'Fri', rentals: 20 },
  { date: 'Sat', rentals: 25 },
  { date: 'Sun', rentals: 22 },
];

const bikeCategories = [
  { name: 'Sports', value: 35 },
  { name: 'Cruiser', value: 25 },
  { name: 'Adventure', value: 20 },
  { name: 'Scooter', value: 20 },
];

const monthlyRevenue = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 5000 },
  { month: 'Mar', revenue: 4500 },
  { month: 'Apr', revenue: 6000 },
  { month: 'May', revenue: 5500 },
  { month: 'Jun', revenue: 7000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DashboardOverview = () => {
  const stats = [
    {
      title: 'Total Bikes',
      value: '24',
      icon: Bike,
      color: 'bg-blue-500',
    },
    {
      title: "Today's Rentals",
      value: '12',
      icon: Calendar,
      color: 'bg-green-500',
    },
    {
      title: 'New Users',
      value: '8',
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: "Today's Revenue",
      value: '₹12,500',
      icon: DollarSign,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-full ${stat.color} text-white`}>
                <stat.icon size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily New Users */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Daily New Users</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyUsers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Daily Rentals */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Daily Rentals</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyRentals}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="rentals" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bike Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Bike Categories</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bikeCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bikeCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Monthly Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardOverview; 