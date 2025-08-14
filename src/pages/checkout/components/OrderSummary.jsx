import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const OrderSummary = ({ cartItems, orderSummary, onApplyCoupon }) => {
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const handleApplyCoupon = () => {
    if (couponCode?.trim()) {
      // Mock coupon validation
      if (couponCode?.toUpperCase() === 'HERBAL10') {
        setCouponApplied(true);
        onApplyCoupon(couponCode, 10); // 10% discount
      } else {
        alert('Invalid coupon code');
      }
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 sticky top-4">
      <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
        Order Summary
      </h3>
      {/* Cart Items */}
      <div className="space-y-3 mb-6">
        {cartItems?.map((item) => (
          <div key={item?.id} className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden">
              <Image
                src={item?.image}
                alt={item?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-foreground truncate">
                {item?.name}
              </h4>
              <p className="text-xs text-muted-foreground">
                {item?.size} × {item?.quantity}
              </p>
            </div>
            <span className="font-medium text-sm text-foreground">
              ₹{item?.price?.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      {/* Coupon Code */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <Input
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e?.target?.value)}
            disabled={couponApplied}
            className="flex-1"
          />
          <Button
            variant="outline"
            onClick={handleApplyCoupon}
            disabled={couponApplied || !couponCode?.trim()}
            iconName={couponApplied ? "Check" : "Tag"}
            size="sm"
          >
            {couponApplied ? 'Applied' : 'Apply'}
          </Button>
        </div>
        {couponApplied && (
          <p className="text-xs text-success mt-2 flex items-center">
            <Icon name="Check" size={12} className="mr-1" />
            Coupon applied successfully!
          </p>
        )}
      </div>
      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal ({cartItems?.length} items)</span>
          <span className="text-foreground">₹{orderSummary?.subtotal?.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-foreground">
            {orderSummary?.shipping === 0 ? (
              <span className="text-success">Free</span>
            ) : (
              `₹${orderSummary?.shipping?.toFixed(2)}`
            )}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (GST 18%)</span>
          <span className="text-foreground">₹{orderSummary?.tax?.toFixed(2)}</span>
        </div>

        {orderSummary?.discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-success">Discount</span>
            <span className="text-success">-₹{orderSummary?.discount?.toFixed(2)}</span>
          </div>
        )}

        <div className="border-t border-border pt-3">
          <div className="flex justify-between font-semibold">
            <span className="text-foreground">Total</span>
            <span className="text-foreground text-lg">₹{orderSummary?.total?.toFixed(2)}</span>
          </div>
        </div>
      </div>
      {/* Savings Info */}
      {orderSummary?.savings > 0 && (
        <div className="p-3 bg-success/10 border border-success/20 rounded-lg mb-6">
          <div className="flex items-center space-x-2">
            <Icon name="Percent" size={16} className="text-success" />
            <span className="text-sm text-success font-medium">
              You're saving ₹{orderSummary?.savings?.toFixed(2)} on this order!
            </span>
          </div>
        </div>
      )}
      {/* Security Badge */}
      <div className="flex items-center justify-center space-x-2 p-3 bg-muted/50 rounded-lg">
        <Icon name="Shield" size={16} className="text-success" />
        <span className="text-xs text-muted-foreground">
          Secure checkout powered by Razorpay
        </span>
      </div>
    </div>
  );
};

export default OrderSummary;