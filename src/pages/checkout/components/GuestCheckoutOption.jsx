import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const GuestCheckoutOption = ({ onContinueAsGuest, onShowLogin }) => {
  const [guestEmail, setGuestEmail] = useState('');
  const [createAccount, setCreateAccount] = useState(false);

  const handleGuestCheckout = (e) => {
    e?.preventDefault();
    if (guestEmail?.trim()) {
      onContinueAsGuest(guestEmail, createAccount);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="text-center mb-6">
        <Icon name="User" size={32} className="mx-auto mb-3 text-primary" />
        <h2 className="font-heading font-semibold text-xl text-foreground mb-2">
          Checkout Options
        </h2>
        <p className="text-muted-foreground">
          Continue as guest or sign in to your account
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Guest Checkout */}
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Continue as Guest</h3>
          <form onSubmit={handleGuestCheckout} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e?.target?.value)}
              description="We'll send order updates to this email"
              required
            />
            
            <Checkbox
              label="Create an account for faster checkout next time"
              checked={createAccount}
              onChange={(e) => setCreateAccount(e?.target?.checked)}
            />

            <Button
              type="submit"
              variant="default"
              fullWidth
              iconName="ArrowRight"
              iconPosition="right"
            >
              Continue as Guest
            </Button>
          </form>
        </div>

        {/* Sign In */}
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Returning Customer</h3>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="text-sm font-medium text-foreground">Benefits of signing in:</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Faster checkout with saved addresses</li>
                <li>• Order tracking and history</li>
                <li>• Exclusive member discounts</li>
                <li>• Wishlist and recommendations</li>
              </ul>
            </div>

            <Button
              variant="outline"
              fullWidth
              onClick={onShowLogin}
              iconName="LogIn"
              iconPosition="left"
            >
              Sign In to Your Account
            </Button>

            <div className="text-center">
              <button className="text-sm text-primary hover:text-primary/80 transition-natural">
                Forgot your password?
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Trust Indicators */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Shield" size={14} className="text-success" />
            <span>Secure Checkout</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Truck" size={14} className="text-primary" />
            <span>Free Shipping ₹500+</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="RotateCcw" size={14} className="text-accent" />
            <span>30-Day Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestCheckoutOption;