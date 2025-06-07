import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    users: 0,
    bikes: 0,
    bookings: 0,
    revenue: 0,
  });

  const [dailyUsers, setDailyUsers] = useState([]);
  const [dailyRentals, setDailyRentals] = useState([]);
  const [bikeCategories, setBikeCategories] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  async function fetchStats() {
    // Users
    const { count: userCount } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true });
    // Bikes
    const { count: bikeCount } = await supabase
      .from('bikes')
      .select('id', { count: 'exact', head: true });
    // Bookings & Revenue
    const { data: bookingsData } = await supabase
      .from('bookings')
      .select('total_amount');
    const bookings = bookingsData ? bookingsData.length : 0;
    const revenue = bookingsData ? bookingsData.reduce((sum, b) => sum + (b.total_amount || 0), 0) : 0;
    setStats({
      users: userCount || 0,
      bikes: bikeCount || 0,
      bookings,
      revenue,
    });
  }

  useEffect(() => {
    fetchStats();
    const channel = supabase
      .channel('dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bikes' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, fetchStats)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    async function fetchChartData() {
      // Daily New Users (group by created_at date)
      const { data: usersData } = await supabase
        .from('profiles')
        .select('created_at');
      if (usersData) {
        const daily = {};
        usersData.forEach(u => {
          const date = u.created_at.slice(0, 10);
          daily[date] = (daily[date] || 0) + 1;
        });
        setDailyUsers(Object.entries(daily).map(([date, users]) => ({ date, users })));
      }
      // Daily Rentals (group by created_at date)
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('created_at');
      if (bookingsData) {
        const daily = {};
        bookingsData.forEach(b => {
          const date = b.created_at.slice(0, 10);
          daily[date] = (daily[date] || 0) + 1;
        });
        setDailyRentals(Object.entries(daily).map(([date, rentals]) => ({ date, rentals })));
      }
      // Bike Categories (group by type)
      const { data: bikesData } = await supabase
        .from('bikes')
        .select('type');
      if (bikesData) {
        const categories = {};
        bikesData.forEach(b => {
          categories[b.type] = (categories[b.type] || 0) + 1;
        });
        setBikeCategories(Object.entries(categories).map(([name, value]) => ({ name, value })));
      }
      // Monthly Revenue (group by month from bookings)
      const { data: revenueData } = await supabase
        .from('bookings')
        .select('created_at,total_amount');
      if (revenueData) {
        const monthly = {};
        revenueData.forEach(b => {
          const month = b.created_at.slice(0, 7); // YYYY-MM
          monthly[month] = (monthly[month] || 0) + (b.total_amount || 0);
        });
        setMonthlyRevenue(Object.entries(monthly).map(([month, revenue]) => ({ month, revenue })));
      }
    }
    fetchChartData();
    // Optionally, subscribe to real-time changes and refetch
  }, []);

  const cards = [
    {
      label: 'Total Users',
      value: stats.users,
      icon: <Users className="text-blue-500" size={32} />,
    },
    {
      label: 'Total Bikes',
      value: stats.bikes,
      icon: <Bike className="text-green-500" size={32} />,
    },
    {
      label: 'Total Bookings',
      value: stats.bookings,
      icon: <Calendar className="text-yellow-500" size={32} />,
    },
    {
      label: 'Total Revenue',
      value: `₹${stats.revenue.toLocaleString()}`,
      icon: <DollarSign className="text-purple-500" size={32} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{card.label}</p>
                <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
              </div>
              <div className="p-3 rounded-full bg-gray-100 flex items-center justify-center">
                {card.icon}
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