import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import CheckoutProgress from './components/CheckoutProgress';
import ShippingForm from './components/ShippingForm';
import PaymentForm from './components/PaymentForm';
import OrderReview from './components/OrderReview';
import OrderSummary from './components/OrderSummary';
import GuestCheckoutOption from './components/GuestCheckoutOption';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(0); // 0: Guest/Login, 1: Shipping, 2: Payment, 3: Review
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [formData, setFormData] = useState({
    shipping: {},
    payment: {}
  });

  // Mock cart items
  const [cartItems] = useState([
    {
      id: 1,
      name: "Herbal Face Cream with Aloe Vera",
      price: 299.99,
      quantity: 2,
      size: "50ml",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop"
    },
    {
      id: 2,
      name: "Natural Body Lotion",
      price: 249.99,
      quantity: 1,
      size: "200ml",
      image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop"
    },
    {
      id: 3,
      name: "Organic Shampoo",
      price: 199.99,
      quantity: 1,
      size: "250ml",
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop"
    }
  ]);

  // Calculate order summary
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0,
    savings: 0
  });

  useEffect(() => {
    const subtotal = cartItems?.reduce((sum, item) => sum + (item?.price * item?.quantity), 0);
    const shipping = subtotal >= 500 ? 0 : 50; // Free shipping over ₹500
    const tax = subtotal * 0.18; // 18% GST
    const discount = orderSummary?.discount || 0;
    const total = subtotal + shipping + tax - discount;
    const savings = discount + (shipping === 0 && subtotal >= 500 ? 50 : 0);

    setOrderSummary({
      subtotal,
      shipping,
      tax,
      discount,
      total,
      savings
    });
  }, [cartItems, orderSummary?.discount]);

  const handleContinueAsGuest = (email, createAccount) => {
    setFormData({
      ...formData,
      guestEmail: email,
      createAccount
    });
    setCurrentStep(1);
  };

  const handleShowLogin = () => {
    setShowLogin(true);
  };

  const handleLogin = () => {
    // Mock login
    setIsAuthenticated(true);
    setShowLogin(false);
    setCurrentStep(1);
  };

  const handleStepClick = (step) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleApplyCoupon = (code, discountPercent) => {
    const discountAmount = (orderSummary?.subtotal * discountPercent) / 100;
    setOrderSummary({
      ...orderSummary,
      discount: discountAmount
    });
  };

  const handlePlaceOrder = () => {
    // Mock order placement
    alert(`Order placed successfully! Order ID: HC-${Date.now()}`);
    window.location.href = '/homepage';
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <GuestCheckoutOption
            onContinueAsGuest={handleContinueAsGuest}
            onShowLogin={handleShowLogin}
          />
        );
      case 1:
        return (
          <ShippingForm
            onNext={handleNextStep}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 2:
        return (
          <PaymentForm
            onNext={handleNextStep}
            onBack={handlePrevStep}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 3:
        return (
          <OrderReview
            onBack={handlePrevStep}
            onPlaceOrder={handlePlaceOrder}
            formData={formData}
            cartItems={cartItems}
            orderSummary={orderSummary}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <button
                onClick={() => window.location.href = '/shopping-cart'}
                className="p-2 hover:bg-muted rounded-lg transition-natural"
              >
                <Icon name="ArrowLeft" size={20} />
              </button>
              <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
                Checkout
              </h1>
            </div>
            
            {/* Security Badge */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Shield" size={16} className="text-success" />
              <span>Secure checkout powered by SSL encryption</span>
            </div>
          </div>

          {/* Progress Indicator */}
          {currentStep > 0 && (
            <CheckoutProgress
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {renderCurrentStep()}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4">
              <OrderSummary
                cartItems={cartItems}
                orderSummary={orderSummary}
                onApplyCoupon={handleApplyCoupon}
              />
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                  <Icon name="Shield" size={24} className="text-success" />
                </div>
                <h3 className="font-medium text-foreground">Secure Payment</h3>
                <p className="text-sm text-muted-foreground">
                  Your payment information is encrypted and secure
                </p>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="Truck" size={24} className="text-primary" />
                </div>
                <h3 className="font-medium text-foreground">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Free shipping on orders above ₹500
                </p>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Icon name="RotateCcw" size={24} className="text-accent" />
                </div>
                <h3 className="font-medium text-foreground">Easy Returns</h3>
                <p className="text-sm text-muted-foreground">
                  30-day hassle-free return policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-xl text-foreground">
                Sign In
              </h2>
              <button
                onClick={() => setShowLogin(false)}
                className="p-1 hover:bg-muted rounded-lg transition-natural"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Email address"
                className="w-full p-3 border border-border rounded-lg bg-input text-foreground"
                defaultValue="customer@herbalcare.com"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 border border-border rounded-lg bg-input text-foreground"
                defaultValue="password123"
              />
              
              <Button
                variant="default"
                fullWidth
                onClick={handleLogin}
                iconName="LogIn"
                iconPosition="left"
              >
                Sign In
              </Button>
            </form>
            
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Demo credentials: customer@herbalcare.com / password123
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;