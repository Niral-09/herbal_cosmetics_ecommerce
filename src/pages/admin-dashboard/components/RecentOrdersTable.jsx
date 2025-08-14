import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentOrdersTable = () => {
  const [orders] = useState([
    {
      id: "HC-2024-001",
      customer: "Sarah Johnson",
      email: "sarah.j@email.com",
      products: 3,
      amount: 89.97,
      status: "processing",
      date: "2025-08-14",
      time: "10:30 AM"
    },
    {
      id: "HC-2024-002",
      customer: "Michael Chen",
      email: "m.chen@email.com",
      products: 2,
      amount: 54.98,
      status: "shipped",
      date: "2025-08-14",
      time: "09:15 AM"
    },
    {
      id: "HC-2024-003",
      customer: "Emily Rodriguez",
      email: "emily.r@email.com",
      products: 1,
      amount: 29.99,
      status: "delivered",
      date: "2025-08-13",
      time: "04:45 PM"
    },
    {
      id: "HC-2024-004",
      customer: "David Wilson",
      email: "d.wilson@email.com",
      products: 4,
      amount: 119.96,
      status: "pending",
      date: "2025-08-13",
      time: "02:20 PM"
    },
    {
      id: "HC-2024-005",
      customer: "Lisa Thompson",
      email: "lisa.t@email.com",
      products: 2,
      amount: 64.98,
      status: "processing",
      date: "2025-08-13",
      time: "11:10 AM"
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
      case 'processing': return 'bg-accent/10 text-accent border-accent/20';
      case 'shipped': return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'delivered': return 'bg-success/10 text-success border-success/20';
      case 'cancelled': return 'bg-error/10 text-error border-error/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return 'Clock';
      case 'processing': return 'Package';
      case 'shipped': return 'Truck';
      case 'delivered': return 'CheckCircle';
      case 'cancelled': return 'XCircle';
      default: return 'Circle';
    }
  };

  const handleViewOrder = (orderId) => {
    console.log('View order:', orderId);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    console.log('Update order status:', orderId, newStatus);
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-natural">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Recent Orders</h3>
            <p className="text-sm text-muted-foreground">Latest customer orders and their status</p>
          </div>
          <Button variant="outline" size="sm" iconName="Eye" iconPosition="left">
            View All Orders
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium text-sm text-muted-foreground">Order ID</th>
              <th className="text-left p-4 font-medium text-sm text-muted-foreground">Customer</th>
              <th className="text-left p-4 font-medium text-sm text-muted-foreground">Products</th>
              <th className="text-left p-4 font-medium text-sm text-muted-foreground">Amount</th>
              <th className="text-left p-4 font-medium text-sm text-muted-foreground">Status</th>
              <th className="text-left p-4 font-medium text-sm text-muted-foreground">Date</th>
              <th className="text-left p-4 font-medium text-sm text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order, index) => (
              <tr key={order?.id} className={`border-b border-border hover:bg-muted/30 transition-natural ${
                index === orders?.length - 1 ? 'border-b-0' : ''
              }`}>
                <td className="p-4">
                  <div className="font-mono text-sm font-medium text-foreground">
                    {order?.id}
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <div className="font-medium text-sm text-foreground">{order?.customer}</div>
                    <div className="text-xs text-muted-foreground">{order?.email}</div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-foreground">{order?.products} items</span>
                </td>
                <td className="p-4">
                  <span className="font-medium text-sm text-foreground">₹{order?.amount?.toFixed(2)}</span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order?.status)}`}>
                    <Icon name={getStatusIcon(order?.status)} size={12} />
                    <span className="capitalize">{order?.status}</span>
                  </span>
                </td>
                <td className="p-4">
                  <div>
                    <div className="text-sm text-foreground">{order?.date}</div>
                    <div className="text-xs text-muted-foreground">{order?.time}</div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="Eye"
                      onClick={() => handleViewOrder(order?.id)}
                    />
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="Edit"
                      onClick={() => handleUpdateStatus(order?.id, 'processing')}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;