import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LowStockAlert = () => {
  const [lowStockItems] = useState([
    {
      id: 1,
      name: "Herbal Face Cream",
      sku: "HFC-001",
      currentStock: 5,
      minStock: 20,
      category: "Skincare",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop"
    },
    {
      id: 2,
      name: "Natural Body Lotion",
      sku: "NBL-002",
      currentStock: 8,
      minStock: 25,
      category: "Body Care",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop"
    },
    {
      id: 3,
      name: "Organic Shampoo",
      sku: "OS-003",
      currentStock: 0,
      minStock: 15,
      category: "Hair Care",
      price: 19.99,
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop"
    },
    {
      id: 4,
      name: "Herbal Lip Balm",
      sku: "HLB-004",
      currentStock: 12,
      minStock: 30,
      category: "Lip Care",
      price: 9.99,
      image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop"
    }
  ]);

  const getStockStatus = (current, min) => {
    if (current === 0) return { label: 'Out of Stock', color: 'text-error', bgColor: 'bg-error/10', borderColor: 'border-error/20' };
    if (current <= min * 0.3) return { label: 'Critical', color: 'text-error', bgColor: 'bg-error/10', borderColor: 'border-error/20' };
    if (current <= min * 0.6) return { label: 'Low', color: 'text-warning', bgColor: 'bg-warning/10', borderColor: 'border-warning/20' };
    return { label: 'Normal', color: 'text-success', bgColor: 'bg-success/10', borderColor: 'border-success/20' };
  };

  const handleRestockProduct = (productId) => {
    console.log('Restock product:', productId);
    window.location.href = '/admin-product-management';
  };

  const handleViewProduct = (productId) => {
    console.log('View product:', productId);
    window.location.href = '/admin-product-management';
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-natural">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Icon name="AlertTriangle" size={20} className="text-warning" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground">Low Stock Alerts</h3>
              <p className="text-sm text-muted-foreground">{lowStockItems?.length} products need attention</p>
            </div>
          </div>
          <Button variant="outline" size="sm" iconName="Package" iconPosition="left">
            Manage Inventory
          </Button>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {lowStockItems?.map((item) => {
            const status = getStockStatus(item?.currentStock, item?.minStock);
            return (
              <div key={item?.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-natural">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                    <Icon name="Package" size={20} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-sm text-foreground">{item?.name}</h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${status?.bgColor} ${status?.color} ${status?.borderColor}`}>
                        {status?.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>SKU: {item?.sku}</span>
                      <span>Category: {item?.category}</span>
                      <span>Price: ₹{item?.price}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">
                      {item?.currentStock} / {item?.minStock}
                    </div>
                    <div className="text-xs text-muted-foreground">Current / Min</div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="Eye"
                      onClick={() => handleViewProduct(item?.id)}
                    />
                    <Button
                      variant="outline"
                      size="xs"
                      iconName="Plus"
                      iconPosition="left"
                      onClick={() => handleRestockProduct(item?.id)}
                    >
                      Restock
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {lowStockItems?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={48} className="mx-auto mb-4 text-success" />
            <h4 className="font-medium text-foreground mb-2">All Products Well Stocked</h4>
            <p className="text-sm text-muted-foreground">No products require immediate attention</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LowStockAlert;