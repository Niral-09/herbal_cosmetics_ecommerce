import React, { useState } from 'react';
import Icon from '../AppIcon';

const AdminSidebar = ({ isCollapsed = false, onToggle }) => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [notifications] = useState(5);

  const menuItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      href: '/admin-dashboard',
      icon: 'LayoutDashboard',
      description: 'Overview & Analytics'
    },
    {
      id: 'products',
      name: 'Product Management',
      href: '/admin-product-management',
      icon: 'Package',
      description: 'Manage Inventory'
    },
    {
      id: 'orders',
      name: 'Orders',
      href: '#',
      icon: 'ShoppingBag',
      description: 'Order Processing',
      badge: 12
    },
    {
      id: 'customers',
      name: 'Customers',
      href: '#',
      icon: 'Users',
      description: 'Customer Management'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      href: '#',
      icon: 'BarChart3',
      description: 'Sales & Reports'
    },
    {
      id: 'settings',
      name: 'Settings',
      href: '#',
      icon: 'Settings',
      description: 'System Configuration'
    }
  ];

  const handleItemClick = (item) => {
    setActiveItem(item?.id);
    if (item?.href !== '#') {
      window.location.href = item?.href;
    }
  };

  return (
    <>
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-40 h-screen bg-card border-r border-border shadow-natural transition-natural ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Leaf" size={20} color="white" />
                </div>
                <div>
                  <h2 className="font-heading font-semibold text-lg text-foreground">
                    HerbalCare
                  </h2>
                  <p className="text-xs text-muted-foreground">Admin Panel</p>
                </div>
              </div>
            )}
            {isCollapsed && (
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
                <Icon name="Leaf" size={20} color="white" />
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems?.map((item) => (
              <button
                key={item?.id}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-natural group ${
                  activeItem === item?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                title={isCollapsed ? item?.name : ''}
              >
                <div className="flex-shrink-0 relative">
                  <Icon 
                    name={item?.icon} 
                    size={20} 
                    color={activeItem === item?.id ? 'currentColor' : 'currentColor'}
                  />
                  {item?.badge && (
                    <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-medium rounded-full h-4 w-4 flex items-center justify-center">
                      {item?.badge > 9 ? '9+' : item?.badge}
                    </span>
                  )}
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item?.name}</p>
                    <p className="text-xs opacity-75 truncate">{item?.description}</p>
                  </div>
                )}
              </button>
            ))}
          </nav>

          {/* Notifications */}
          {!isCollapsed && (
            <div className="p-4 border-t border-border">
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm text-foreground">Notifications</h3>
                  <span className="bg-accent text-accent-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  You have {notifications} pending notifications
                </p>
                <button className="text-xs text-primary hover:text-primary/80 mt-1 transition-natural">
                  View all
                </button>
              </div>
            </div>
          )}

          {/* User Profile */}
          <div className="p-4 border-t border-border">
            <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">Admin User</p>
                  <p className="text-xs text-muted-foreground truncate">admin@herbalcare.com</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`fixed top-4 z-50 bg-card border border-border rounded-lg p-2 shadow-natural hover:shadow-natural-lg transition-natural ${
          isCollapsed ? 'left-20' : 'left-68'
        }`}
        style={{ left: isCollapsed ? '4.5rem' : '17rem' }}
      >
        <Icon 
          name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
          size={16} 
          color="currentColor" 
        />
      </button>
    </>
  );
};

export default AdminSidebar;