import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const CartMiniWidget = ({ itemCount = 0, isOpen = false, onToggle }) => {
  const [cartItems] = useState([
    {
      id: 1,
      name: 'Herbal Face Cream',
      price: 29.99,
      quantity: 2,
      image: '/assets/images/product1.jpg'
    },
    {
      id: 2,
      name: 'Natural Body Lotion',
      price: 24.99,
      quantity: 1,
      image: '/assets/images/product2.jpg'
    }
  ]);

  const totalAmount = cartItems?.reduce((sum, item) => sum + (item?.price * item?.quantity), 0);

  const handleQuantityChange = (itemId, newQuantity) => {
    console.log(`Update item ${itemId} quantity to ${newQuantity}`);
  };

  const handleRemoveItem = (itemId) => {
    console.log(`Remove item ${itemId} from cart`);
  };

  const handleViewCart = () => {
    window.location.href = '/shopping-cart';
  };

  const handleCheckout = () => {
    window.location.href = '/checkout';
  };

  return (
    <div className="relative">
      {/* Cart Button */}
      <button
        onClick={onToggle}
        className="relative p-2 text-muted-foreground hover:text-foreground transition-natural"
      >
        <Icon name="ShoppingCart" size={20} />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </button>
      {/* Cart Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-natural-lg z-50 animate-scale-in">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-lg text-popover-foreground">
                Shopping Cart
              </h3>
              <span className="text-sm text-muted-foreground">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>

            {cartItems?.length === 0 ? (
              <div className="text-center py-8">
                <Icon name="ShoppingCart" size={48} color="currentColor" className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">Your cart is empty</p>
                <Button variant="outline" onClick={() => window.location.href = '/product-catalog'}>
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cartItems?.map((item) => (
                    <div key={item?.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-natural">
                      <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                        <Icon name="Package" size={20} color="currentColor" className="text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-popover-foreground truncate">
                          {item?.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          ${item?.price?.toFixed(2)} each
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item?.id, item?.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-muted hover:bg-border flex items-center justify-center transition-natural"
                          disabled={item?.quantity <= 1}
                        >
                          <Icon name="Minus" size={12} />
                        </button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item?.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item?.id, item?.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-muted hover:bg-border flex items-center justify-center transition-natural"
                        >
                          <Icon name="Plus" size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item?.id)}
                        className="p-1 text-muted-foreground hover:text-error transition-natural"
                      >
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-popover-foreground">Total:</span>
                    <span className="font-heading font-semibold text-lg text-popover-foreground">
                      ${totalAmount?.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <Button
                      variant="default"
                      fullWidth
                      onClick={handleCheckout}
                      iconName="CreditCard"
                      iconPosition="left"
                    >
                      Checkout
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={handleViewCart}
                    >
                      View Cart
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartMiniWidget;