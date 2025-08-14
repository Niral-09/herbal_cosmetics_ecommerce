import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AdminSidebar from '../../components/ui/AdminSidebar';
import AdminNotificationCenter from '../../components/ui/AdminNotificationCenter';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import MetricCard from './components/MetricCard';
import SalesChart from './components/SalesChart';
import RecentOrdersTable from './components/RecentOrdersTable';
import LowStockAlert from './components/LowStockAlert';
import QuickActions from './components/QuickActions';
import TopProductsChart from './components/TopProductsChart';

const AdminDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleNotificationToggle = () => {
    setNotificationOpen(!notificationOpen);
  };

  const handleLogout = () => {
    console.log('Admin logout');
    window.location.href = '/homepage';
  };

  const dashboardMetrics = [
    {
      title: "Total Sales",
      value: "₹8,45,230",
      change: "+12.5%",
      changeType: "positive",
      icon: "TrendingUp",
      color: "text-success"
    },
    {
      title: "Total Orders",
      value: 1247,
      change: "+8.2%",
      changeType: "positive",
      icon: "ShoppingBag",
      color: "text-primary"
    },
    {
      title: "New Customers",
      value: 89,
      change: "+15.3%",
      changeType: "positive",
      icon: "Users",
      color: "text-accent"
    },
    {
      title: "Low Stock Items",
      value: 12,
      change: "-3",
      changeType: "negative",
      icon: "AlertTriangle",
      color: "text-warning"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - HerbalCare</title>
        <meta name="description" content="Comprehensive admin dashboard for HerbalCare herbal cosmetics ecommerce platform with sales analytics, order management, and inventory oversight." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Admin Sidebar */}
        <AdminSidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={handleSidebarToggle}
        />

        {/* Main Content */}
        <div className={`transition-natural ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          {/* Top Header */}
          <header className="bg-card border-b border-border shadow-natural sticky top-0 z-30">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-heading font-bold text-foreground">
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Welcome back! Here's what's happening with your store today.
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                    <Icon name="Clock" size={16} />
                    <span>
                      {currentTime?.toLocaleDateString('en-IN', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span>
                      {currentTime?.toLocaleTimeString('en-IN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  
                  <AdminNotificationCenter 
                    isOpen={notificationOpen}
                    onToggle={handleNotificationToggle}
                  />
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} color="white" />
                    </div>
                    <div className="hidden md:block">
                      <div className="text-sm font-medium text-foreground">Admin User</div>
                      <div className="text-xs text-muted-foreground">admin@herbalcare.com</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="LogOut"
                      onClick={handleLogout}
                      className="text-muted-foreground hover:text-error"
                    />
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="p-6 space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardMetrics?.map((metric, index) => (
                <MetricCard
                  key={index}
                  title={metric?.title}
                  value={metric?.value}
                  change={metric?.change}
                  changeType={metric?.changeType}
                  icon={metric?.icon}
                  color={metric?.color}
                />
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SalesChart />
              <TopProductsChart />
            </div>

            {/* Tables and Alerts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <RecentOrdersTable />
              </div>
              <div className="space-y-6">
                <LowStockAlert />
              </div>
            </div>

            {/* Quick Actions */}
            <QuickActions />

            {/* Footer */}
            <footer className="mt-12 pt-6 border-t border-border">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div className="text-sm text-muted-foreground">
                  © {new Date()?.getFullYear()} HerbalCare Admin Panel. All rights reserved.
                </div>
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <button className="hover:text-foreground transition-natural">
                    System Status
                  </button>
                  <button className="hover:text-foreground transition-natural">
                    Documentation
                  </button>
                  <button className="hover:text-foreground transition-natural">
                    Support
                  </button>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;