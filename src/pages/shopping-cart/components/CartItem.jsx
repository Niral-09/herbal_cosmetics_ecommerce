import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CartItem = ({ item, onQuantityChange, onRemove, onSaveForLater }) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      onQuantityChange(item?.id, newQuantity);
    }
  };

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(item?.id);
      setIsRemoving(false);
      setShowRemoveConfirm(false);
    }, 500);
  };

  const handleSaveForLater = () => {
    onSaveForLater(item?.id);
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 transition-natural ${
      isRemoving ? 'opacity-50 scale-95' : ''
    }`}>
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="flex space-x-4">
          <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={item?.image}
              alt={item?.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground mb-1 truncate">
              {item?.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              {item?.variant} • {item?.brand}
            </p>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg text-foreground">
                ₹{(item?.price * item?.quantity)?.toFixed(2)}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(item?.quantity - 1)}
                  disabled={item?.quantity <= 1}
                  className="w-8 h-8 rounded-full bg-muted hover:bg-border flex items-center justify-center transition-natural disabled:opacity-50"
                >
                  <Icon name="Minus" size={14} />
                </button>
                <span className="font-medium text-foreground w-8 text-center">
                  {item?.quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(item?.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-muted hover:bg-border flex items-center justify-center transition-natural"
                >
                  <Icon name="Plus" size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSaveForLater}
              className="text-sm text-primary hover:text-primary/80 transition-natural"
            >
              Save for later
            </button>
            <button
              onClick={() => setShowRemoveConfirm(true)}
              className="text-sm text-error hover:text-error/80 transition-natural"
            >
              Remove
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            ₹{item?.price?.toFixed(2)} each
          </p>
        </div>
      </div>
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-8 gap-4 items-center">
          <div className="col-span-3 flex items-center space-x-4">
            <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={item?.image}
                alt={item?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-medium text-foreground truncate">
                {item?.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {item?.variant} • {item?.brand}
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <span className="text-foreground">₹{item?.price?.toFixed(2)}</span>
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => handleQuantityChange(item?.quantity - 1)}
              disabled={item?.quantity <= 1}
              className="w-8 h-8 rounded-full bg-muted hover:bg-border flex items-center justify-center transition-natural disabled:opacity-50"
            >
              <Icon name="Minus" size={14} />
            </button>
            <span className="font-medium text-foreground w-8 text-center">
              {item?.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item?.quantity + 1)}
              className="w-8 h-8 rounded-full bg-muted hover:bg-border flex items-center justify-center transition-natural"
            >
              <Icon name="Plus" size={14} />
            </button>
          </div>
          
          <div className="text-center">
            <span className="font-semibold text-foreground">
              ₹{(item?.price * item?.quantity)?.toFixed(2)}
            </span>
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={handleSaveForLater}
              className="p-2 text-primary hover:text-primary/80 transition-natural"
              title="Save for later"
            >
              <Icon name="Heart" size={16} />
            </button>
            <button
              onClick={() => setShowRemoveConfirm(true)}
              className="p-2 text-error hover:text-error/80 transition-natural"
              title="Remove item"
            >
              <Icon name="Trash2" size={16} />
            </button>
          </div>
        </div>
      </div>
      {/* Remove Confirmation Modal */}
      {showRemoveConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 max-w-sm w-full">
            <div className="text-center">
              <Icon name="AlertTriangle" size={48} color="currentColor" className="mx-auto mb-4 text-warning" />
              <h3 className="font-semibold text-lg text-foreground mb-2">
                Remove Item?
              </h3>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to remove "{item?.name}" from your cart?
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowRemoveConfirm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRemove}
                  className="flex-1"
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItem;