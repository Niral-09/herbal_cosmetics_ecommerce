import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const SavedItems = ({ savedItems, onMoveToCart, onRemoveFromSaved }) => {
  const [movingItems, setMovingItems] = useState(new Set());

  const handleMoveToCart = async (itemId) => {
    setMovingItems(prev => new Set([...prev, itemId]));
    
    // Simulate API call
    setTimeout(() => {
      onMoveToCart(itemId);
      setMovingItems(prev => {
        const newSet = new Set(prev);
        newSet?.delete(itemId);
        return newSet;
      });
    }, 500);
  };

  const handleRemove = (itemId) => {
    onRemoveFromSaved(itemId);
  };

  if (savedItems?.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-semibold text-xl text-foreground">
          Saved for Later ({savedItems?.length})
        </h2>
        <Button
          variant="ghost"
          size="sm"
          iconName="Heart"
          iconPosition="left"
          onClick={() => window.location.href = '/wishlist'}
        >
          View Wishlist
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {savedItems?.map((item) => (
          <div
            key={item?.id}
            className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-natural-lg transition-natural"
          >
            <div className="aspect-square bg-muted overflow-hidden relative">
              <Image
                src={item?.image}
                alt={item?.name}
                className="w-full h-full object-cover"
              />
              {item?.discount && (
                <div className="absolute top-2 left-2 bg-error text-error-foreground text-xs font-medium px-2 py-1 rounded">
                  {item?.discount}% OFF
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="mb-2">
                <p className="text-xs text-primary font-medium mb-1">
                  {item?.brand}
                </p>
                <h3 className="font-medium text-foreground mb-1 line-clamp-2">
                  {item?.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item?.variant}
                </p>
              </div>

              <div className="flex items-center space-x-1 mb-3">
                <div className="flex items-center">
                  {[...Array(5)]?.map((_, i) => (
                    <Icon
                      key={i}
                      name="Star"
                      size={12}
                      color={i < Math.floor(item?.rating) ? "#F59E0B" : "#E5E7EB"}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  ({item?.rating})
                </span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-foreground">
                    ₹{item?.price?.toFixed(2)}
                  </span>
                  {item?.originalPrice && item?.originalPrice > item?.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{item?.originalPrice?.toFixed(2)}
                    </span>
                  )}
                </div>
                {item?.inStock ? (
                  <span className="text-xs text-success font-medium">In Stock</span>
                ) : (
                  <span className="text-xs text-error font-medium">Out of Stock</span>
                )}
              </div>

              <div className="space-y-2">
                <Button
                  variant="default"
                  size="sm"
                  fullWidth
                  loading={movingItems?.has(item?.id)}
                  disabled={!item?.inStock}
                  onClick={() => handleMoveToCart(item?.id)}
                  iconName="ShoppingCart"
                  iconPosition="left"
                >
                  {movingItems?.has(item?.id) ? 'Moving...' : 'Move to Cart'}
                </Button>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemove(item?.id)}
                    iconName="Trash2"
                    iconPosition="left"
                    className="flex-1 text-error hover:text-error"
                  >
                    Remove
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.href = `/product-detail/${item?.id}`}
                    iconName="Eye"
                    iconPosition="left"
                    className="flex-1"
                  >
                    View
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Show More Button */}
      {savedItems?.length > 4 && (
        <div className="text-center mt-6">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/wishlist'}
            iconName="ArrowRight"
            iconPosition="right"
          >
            View All Saved Items
          </Button>
        </div>
      )}
    </div>
  );
};

export default SavedItems;