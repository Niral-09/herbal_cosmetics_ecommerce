import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const AdminNotificationCenter = ({ isOpen = false, onToggle }) => {
  const [notifications] = useState([
    {
      id: 1,
      type: 'order',
      title: 'New Order Received',
      message: 'Order #HC-2024-001 for $89.97',
      time: '2 minutes ago',
      unread: true,
      icon: 'ShoppingBag',
      color: 'text-success'
    },
    {
      id: 2,
      type: 'inventory',
      title: 'Low Stock Alert',
      message: 'Herbal Face Cream - Only 5 units left',
      time: '15 minutes ago',
      unread: true,
      icon: 'AlertTriangle',
      color: 'text-warning'
    },
    {
      id: 3,
      type: 'customer',
      title: 'New Customer Review',
      message: '5-star review for Natural Body Lotion',
      time: '1 hour ago',
      unread: false,
      icon: 'Star',
      color: 'text-accent'
    },
    {
      id: 4,
      type: 'system',
      title: 'System Update',
      message: 'Backup completed successfully',
      time: '2 hours ago',
      unread: false,
      icon: 'CheckCircle',
      color: 'text-success'
    },
    {
      id: 5,
      type: 'inventory',
      title: 'Product Out of Stock',
      message: 'Organic Shampoo is now out of stock',
      time: '3 hours ago',
      unread: false,
      icon: 'XCircle',
      color: 'text-error'
    }
  ]);

  const unreadCount = notifications?.filter(n => n?.unread)?.length;

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
    // Handle navigation based on notification type
    switch (notification?.type) {
      case 'order':
        // Navigate to orders page
        break;
      case 'inventory':
        window.location.href = '/admin-product-management';
        break;
      case 'customer':
        // Navigate to customer reviews
        break;
      default:
        break;
    }
  };

  const handleMarkAllRead = () => {
    console.log('Mark all notifications as read');
  };

  const handleClearAll = () => {
    console.log('Clear all notifications');
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={onToggle}
        className="relative p-2 text-muted-foreground hover:text-foreground transition-natural"
      >
        <Icon name="Bell" size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-popover border border-border rounded-lg shadow-natural-lg z-50 animate-scale-in">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-lg text-popover-foreground">
                Notifications
              </h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {unreadCount} unread
                  </span>
                )}
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-primary hover:text-primary/80 transition-natural"
                >
                  Mark all read
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-2 mb-4 max-h-80 overflow-y-auto">
              {notifications?.length === 0 ? (
                <div className="text-center py-8">
                  <Icon name="Bell" size={48} color="currentColor" className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No notifications</p>
                </div>
              ) : (
                notifications?.map((notification) => (
                  <button
                    key={notification?.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full text-left p-3 rounded-lg transition-natural hover:bg-muted ${
                      notification?.unread ? 'bg-accent/5 border border-accent/20' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 ${notification?.color}`}>
                        <Icon name={notification?.icon} size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`font-medium text-sm ${
                            notification?.unread ? 'text-popover-foreground' : 'text-muted-foreground'
                          }`}>
                            {notification?.title}
                          </h4>
                          {notification?.unread && (
                            <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {notification?.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification?.time}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Footer Actions */}
            {notifications?.length > 0 && (
              <div className="border-t border-border pt-4 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  iconName="Eye"
                  iconPosition="left"
                >
                  View All Notifications
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  onClick={handleClearAll}
                  iconName="Trash2"
                  iconPosition="left"
                  className="text-muted-foreground hover:text-error"
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotificationCenter;