import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TopProductsChart = () => {
  const topProductsData = [
    { name: "Herbal Face Cream", sales: 245, revenue: 7350 },
    { name: "Natural Body Lotion", sales: 198, revenue: 4950 },
    { name: "Organic Shampoo", sales: 167, revenue: 3340 },
    { name: "Herbal Lip Balm", sales: 156, revenue: 1560 },
    { name: "Natural Face Wash", sales: 134, revenue: 2680 },
    { name: "Herbal Hair Oil", sales: 123, revenue: 2460 },
    { name: "Organic Conditioner", sales: 98, revenue: 1960 },
    { name: "Natural Moisturizer", sales: 87, revenue: 2610 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-natural-lg">
          <p className="font-medium text-popover-foreground mb-2">{label}</p>
          <p className="text-sm text-primary">
            Sales: {payload?.[0]?.value} units
          </p>
          <p className="text-sm text-secondary">
            Revenue: ₹{payload?.[1]?.value?.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-natural">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">Top Selling Products</h3>
          <p className="text-sm text-muted-foreground">Best performing products this month</p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-muted-foreground">Units Sold</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-secondary rounded-full"></div>
            <span className="text-muted-foreground">Revenue</span>
          </div>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topProductsData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="name" 
              stroke="var(--color-muted-foreground)"
              fontSize={10}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="sales" 
              fill="var(--color-primary)" 
              radius={[4, 4, 0, 0]}
              name="Units Sold"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {topProductsData?.slice(0, 4)?.map((product, index) => (
          <div key={index} className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-lg font-heading font-bold text-foreground">
              #{index + 1}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {product?.name}
            </div>
            <div className="text-sm font-medium text-primary">
              {product?.sales} units
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProductsChart;