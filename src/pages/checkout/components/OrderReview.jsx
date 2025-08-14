import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const OrderReview = ({ onBack, onPlaceOrder, formData, cartItems, orderSummary }) => {
  const getPaymentMethodDisplay = () => {
    const method = formData?.payment?.method;
    switch (method) {
      case 'card':
        return `Card ending in ${formData?.payment?.cardNumber?.slice(-4) || '****'}`;
      case 'upi':
        return `UPI: ${formData?.payment?.upiId || 'Not specified'}`;
      case 'netbanking':
        return `Net Banking: ${formData?.payment?.bank || 'Not selected'}`;
      case 'wallet':
        return `${formData?.payment?.wallet || 'Digital Wallet'}`;
      default:
        return 'Payment method not selected';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="CheckCircle" size={20} className="text-primary" />
        <h2 className="font-heading font-semibold text-xl text-foreground">
          Review Your Order
        </h2>
      </div>
      {/* Order Items */}
      <div className="mb-6">
        <h3 className="font-medium text-foreground mb-4">Order Items</h3>
        <div className="space-y-4">
          {cartItems?.map((item) => (
            <div key={item?.id} className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
              <div className="w-16 h-16 bg-background rounded-lg overflow-hidden">
                <Image
                  src={item?.image}
                  alt={item?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{item?.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Size: {item?.size} | Quantity: {item?.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-foreground">₹{item?.price?.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">
                  ₹{(item?.price / item?.quantity)?.toFixed(2)} each
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Shipping Information */}
      <div className="mb-6">
        <h3 className="font-medium text-foreground mb-4">Shipping Address</h3>
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="font-medium text-foreground">{formData?.shipping?.fullName}</p>
          <p className="text-sm text-muted-foreground">{formData?.shipping?.address}</p>
          <p className="text-sm text-muted-foreground">
            {formData?.shipping?.city}, {formData?.shipping?.state} - {formData?.shipping?.pincode}
          </p>
          <p className="text-sm text-muted-foreground">{formData?.shipping?.phone}</p>
        </div>
      </div>
      {/* Payment Information */}
      <div className="mb-6">
        <h3 className="font-medium text-foreground mb-4">Payment Method</h3>
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-foreground">{getPaymentMethodDisplay()}</p>
        </div>
      </div>
      {/* Order Summary */}
      <div className="mb-6">
        <h3 className="font-medium text-foreground mb-4">Order Summary</h3>
        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">₹{orderSummary?.subtotal?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-foreground">
              {orderSummary?.shipping === 0 ? 'Free' : `₹${orderSummary?.shipping?.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (GST)</span>
            <span className="text-foreground">₹{orderSummary?.tax?.toFixed(2)}</span>
          </div>
          {orderSummary?.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-success">Discount</span>
              <span className="text-success">-₹{orderSummary?.discount?.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-border pt-2 mt-2">
            <div className="flex justify-between font-medium">
              <span className="text-foreground">Total</span>
              <span className="text-foreground text-lg">₹{orderSummary?.total?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Terms and Conditions */}
      <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-accent mt-0.5" />
          <div className="text-sm text-foreground">
            <p className="mb-2">By placing this order, you agree to our:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Terms and Conditions</li>
              <li>• Privacy Policy</li>
              <li>• Return and Refund Policy</li>
            </ul>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          iconName="ArrowLeft"
          iconPosition="left"
          className="w-full md:w-auto"
        >
          Back to Payment
        </Button>
        <Button
          variant="default"
          onClick={onPlaceOrder}
          iconName="ShoppingBag"
          iconPosition="left"
          className="w-full md:flex-1 bg-success hover:bg-success/90"
        >
          Place Order - ₹{orderSummary?.total?.toFixed(2)}
        </Button>
      </div>
    </div>
  );
};

export default OrderReview;