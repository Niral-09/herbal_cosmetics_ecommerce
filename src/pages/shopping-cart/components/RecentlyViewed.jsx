import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RecentlyViewed = ({ recentItems, onAddToCart }) => {
  const handleProductClick = (productId) => {
    window.location.href = `/product-detail/${productId}`;
  };

  const handleAddToCart = (item) => {
    onAddToCart(item);
  };

  if (recentItems?.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-semibold text-xl text-foreground">
          Recently Viewed
        </h2>
        <Button
          variant="ghost"
          size="sm"
          iconName="History"
          iconPosition="left"
          onClick={() => window.location.href = '/recently-viewed'}
        >
          View All
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {recentItems?.slice(0, 6)?.map((item) => (
          <div
            key={item?.id}
            className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-natural-lg transition-natural group"
          >
            <div 
              className="aspect-square bg-muted overflow-hidden cursor-pointer"
              onClick={() => handleProductClick(item?.id)}
            >
              <Image
                src={item?.image}
                alt={item?.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-natural"
              />
            </div>
            
            <div className="p-3">
              <div className="mb-2">
                <p className="text-xs text-primary font-medium mb-1">
                  {item?.brand}
                </p>
                <h3 
                  className="font-medium text-sm text-foreground mb-1 line-clamp-2 cursor-pointer hover:text-primary transition-natural"
                  onClick={() => handleProductClick(item?.id)}
                >
                  {item?.name}
                </h3>
              </div>

              <div className="flex items-center space-x-1 mb-2">
                <div className="flex items-center">
                  {[...Array(5)]?.map((_, i) => (
                    <Icon
                      key={i}
                      name="Star"
                      size={10}
                      color={i < Math.floor(item?.rating) ? "#F59E0B" : "#E5E7EB"}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  ({item?.rating})
                </span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-sm text-foreground">
                    ₹{item?.price?.toFixed(2)}
                  </span>
                  {item?.originalPrice && item?.originalPrice > item?.price && (
                    <span className="text-xs text-muted-foreground line-through">
                      ₹{item?.originalPrice?.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <Button
                variant="outline"
                size="xs"
                fullWidth
                onClick={() => handleAddToCart(item)}
                iconName="Plus"
                iconPosition="left"
                disabled={!item?.inStock}
              >
                {item?.inStock ? 'Add' : 'Out of Stock'}
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* Quick Actions */}
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.location.href = '/product-catalog'}
          iconName="Search"
          iconPosition="left"
        >
          Browse More Products
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.location.href = '/product-catalog?sort=popular'}
          iconName="TrendingUp"
          iconPosition="left"
        >
          Popular Items
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.location.href = '/product-catalog?featured=true'}
          iconName="Star"
          iconPosition="left"
        >
          Featured Products
        </Button>
      </div>
    </div>
  );
};

export default RecentlyViewed;