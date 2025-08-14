import React from 'react';


const QuickActions = () => {
  const quickActions = [
    {
      title: "Add New Product",
      description: "Create a new product listing",
      icon: "Plus",
      color: "bg-primary",
      href: "/admin-product-management",
      action: () => window.location.href = '/admin-product-management'
    },
    {
      title: "Process Orders",
      description: "Review and update order status",
      icon: "Package",
      color: "bg-secondary",
      href: "#",
      action: () => console.log('Process orders')
    },
    {
      title: "Customer Support",
      description: "Handle customer inquiries",
      icon: "MessageCircle",
      color: "bg-accent",
      href: "#",
      action: () => console.log('Customer support')
    },
    {
      title: "View Analytics",
      description: "Detailed sales and performance reports",
      icon: "BarChart3",
      color: "bg-success",
      href: "#",
      action: () => console.log('View analytics')
    },
    {
      title: "Manage Categories",
      description: "Organize product categories",
      icon: "FolderOpen",
      color: "bg-warning",
      href: "#",
      action: () => console.log('Manage categories')
    },
    {
      title: "System Settings",
      description: "Configure system preferences",
      icon: "Settings",
      color: "bg-muted-foreground",
      href: "#",
      action: () => console.log('System settings')
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-natural">
      <div className="mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">Quick Actions</h3>
        <p className="text-sm text-muted-foreground">Common administrative tasks and shortcuts</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions?.map((action, index) => (
          <button
            key={index}
            onClick={action?.action}
            className="group p-4 border border-border rounded-lg hover:border-primary/20 hover:bg-muted/30 transition-natural text-left"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className={`p-2 rounded-lg ${action?.color} text-white group-hover:scale-110 transition-natural`}>
                <div className="w-5 h-5 flex items-center justify-center">
                  {action?.icon === 'Plus' && <span className="text-lg font-bold">+</span>}
                  {action?.icon === 'Package' && <span className="text-sm">📦</span>}
                  {action?.icon === 'MessageCircle' && <span className="text-sm">💬</span>}
                  {action?.icon === 'BarChart3' && <span className="text-sm">📊</span>}
                  {action?.icon === 'FolderOpen' && <span className="text-sm">📁</span>}
                  {action?.icon === 'Settings' && <span className="text-sm">⚙️</span>}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-natural">
                  {action?.title}
                </h4>
              </div>
            </div>
            <p className="text-xs text-muted-foreground group-hover:text-foreground transition-natural">
              {action?.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;