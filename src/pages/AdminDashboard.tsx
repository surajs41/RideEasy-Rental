import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DashboardOverview from '@/components/admin/DashboardOverview';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <DashboardOverview />
    </AdminLayout>
  );
};

export default AdminDashboard;
