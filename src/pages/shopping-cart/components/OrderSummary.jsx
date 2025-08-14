import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OrderSummary = ({ 
  subtotal, 
  shipping, 
  tax, 
  discount, 
  total, 
  onCheckout, 
  isCheckoutLoading,
  promoCode,
  onPromoCodeChange,
  onApplyPromo,
  promoError,
  promoSuccess
}) => {
  const handleCheckout = () => {
    onCheckout();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 sticky top-4">
      <h2 className="font-heading font-semibold text-xl text-foreground mb-6">
        Order Summary
      </h2>
      {/* Promo Code Section */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => onPromoCodeChange(e?.target?.value)}
            className="flex-1 px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={onApplyPromo}
            iconName="Tag"
            iconPosition="left"
          >
            Apply
          </Button>
        </div>
        {promoError && (
          <p className="text-error text-sm mt-2 flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {promoError}
          </p>
        )}
        {promoSuccess && (
          <p className="text-success text-sm mt-2 flex items-center">
            <Icon name="CheckCircle" size={14} className="mr-1" />
            {promoSuccess}
          </p>
        )}
      </div>
      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-foreground">
          <span>Subtotal</span>
          <span>₹{subtotal?.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-foreground">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : `₹${shipping?.toFixed(2)}`}</span>
        </div>
        
        <div className="flex justify-between text-foreground">
          <span>Tax (GST 18%)</span>
          <span>₹{tax?.toFixed(2)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-success">
            <span>Discount</span>
            <span>-₹{discount?.toFixed(2)}</span>
          </div>
        )}
        
        <div className="border-t border-border pt-3">
          <div className="flex justify-between font-semibold text-lg text-foreground">
            <span>Total</span>
            <span>₹{total?.toFixed(2)}</span>
          </div>
        </div>
      </div>
      {/* Checkout Button */}
      <Button
        variant="default"
        fullWidth
        loading={isCheckoutLoading}
        onClick={handleCheckout}
        iconName="CreditCard"
        iconPosition="left"
        className="mb-4"
      >
        Proceed to Checkout
      </Button>
      {/* Security Badges */}
      <div className="space-y-3">
        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Shield" size={14} />
            <span>Secure Checkout</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Lock" size={14} />
            <span>SSL Protected</span>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">We accept</p>
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-5 bg-muted rounded flex items-center justify-center">
              <Icon name="CreditCard" size={12} />
            </div>
            <div className="w-8 h-5 bg-muted rounded flex items-center justify-center">
              <Icon name="Smartphone" size={12} />
            </div>
            <div className="w-8 h-5 bg-muted rounded flex items-center justify-center">
              <Icon name="Wallet" size={12} />
            </div>
          </div>
        </div>
      </div>
      {/* Shipping Info */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Truck" size={16} color="currentColor" className="text-primary mt-0.5" />
          <div>
            <p className="font-medium text-sm text-foreground mb-1">
              Free Shipping
            </p>
            <p className="text-xs text-muted-foreground">
              On orders above ₹999. Delivery in 3-5 business days.
            </p>
          </div>
        </div>
      </div>
      {/* Return Policy */}
      <div className="mt-4 p-4 bg-muted rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="RotateCcw" size={16} color="currentColor" className="text-primary mt-0.5" />
          <div>
            <p className="font-medium text-sm text-foreground mb-1">
              Easy Returns
            </p>
            <p className="text-xs text-muted-foreground">
              30-day return policy on all herbal cosmetics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;