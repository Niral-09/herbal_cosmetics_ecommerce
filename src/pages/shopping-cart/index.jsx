import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import CartItem from './components/CartItem';
import OrderSummary from './components/OrderSummary';
import EmptyCart from './components/EmptyCart';
import SavedItems from './components/SavedItems';
import RecentlyViewed from './components/RecentlyViewed';

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Herbal Face Cream with Aloe Vera",
      brand: "NaturalGlow",
      variant: "50ml - Sensitive Skin",
      price: 29.99,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
      inStock: true
    },
    {
      id: 2,
      name: "Natural Body Lotion",
      brand: "HerbalCare",
      variant: "200ml - All Skin Types",
      price: 24.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop",
      inStock: true
    },
    {
      id: 3,
      name: "Organic Shampoo",
      brand: "PureHerbs",
      variant: "300ml - Dry Hair",
      price: 19.99,
      quantity: 3,
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
      inStock: true
    }
  ]);

  const [savedItems, setSavedItems] = useState([
    {
      id: 4,
      name: "Herbal Hair Oil",
      brand: "NaturalGlow",
      variant: "100ml",
      price: 15.99,
      originalPrice: 19.99,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      rating: 4.2,
      inStock: true,
      discount: 20
    },
    {
      id: 5,
      name: "Natural Face Mask",
      brand: "HerbalCare",
      variant: "75ml",
      price: 22.99,
      originalPrice: 27.99,
      image: "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400&h=400&fit=crop",
      rating: 4.6,
      inStock: false
    }
  ]);

  const [recentlyViewed, setRecentlyViewed] = useState([
    {
      id: 6,
      name: "Herbal Lip Balm",
      brand: "PureHerbs",
      price: 8.99,
      originalPrice: 10.99,
      image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop",
      rating: 4.4,
      inStock: true
    },
    {
      id: 7,
      name: "Natural Deodorant",
      brand: "NaturalGlow",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      rating: 4.1,
      inStock: true
    },
    {
      id: 8,
      name: "Herbal Soap Bar",
      brand: "HerbalCare",
      price: 6.99,
      originalPrice: 8.99,
      image: "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400&h=400&fit=crop",
      rating: 4.8,
      inStock: true
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  // Calculate totals
  const subtotal = cartItems?.reduce((sum, item) => sum + (item?.price * item?.quantity), 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax - discount;

  const handleQuantityChange = (itemId, newQuantity) => {
    setCartItems(items =>
      items?.map(item =>
        item?.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(items => items?.filter(item => item?.id !== itemId));
  };

  const handleSaveForLater = (itemId) => {
    const item = cartItems?.find(item => item?.id === itemId);
    if (item) {
      setSavedItems(prev => [...prev, { ...item, rating: 4.5, inStock: true }]);
      setCartItems(items => items?.filter(item => item?.id !== itemId));
    }
  };

  const handleMoveToCart = (itemId) => {
    const item = savedItems?.find(item => item?.id === itemId);
    if (item && item?.inStock) {
      setCartItems(prev => [...prev, { ...item, quantity: 1 }]);
      setSavedItems(items => items?.filter(item => item?.id !== itemId));
    }
  };

  const handleRemoveFromSaved = (itemId) => {
    setSavedItems(items => items?.filter(item => item?.id !== itemId));
  };

  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    
    if (!promoCode?.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    // Mock promo codes
    const validPromoCodes = {
      'SAVE10': { discount: subtotal * 0.1, message: '10% discount applied!' },
      'FIRST20': { discount: subtotal * 0.2, message: '20% first-time buyer discount applied!' },
      'HERBAL15': { discount: subtotal * 0.15, message: '15% herbal products discount applied!' }
    };

    const promo = validPromoCodes?.[promoCode?.toUpperCase()];
    if (promo) {
      setDiscount(promo?.discount);
      setPromoSuccess(promo?.message);
    } else {
      setPromoError('Invalid promo code. Please try again.');
    }
  };

  const handleCheckout = () => {
    setIsCheckoutLoading(true);
    setTimeout(() => {
      window.location.href = '/checkout';
    }, 1000);
  };

  const handleContinueShopping = () => {
    window.location.href = '/product-catalog';
  };

  const handleAddToCart = (item) => {
    const existingItem = cartItems?.find(cartItem => cartItem?.id === item?.id);
    if (existingItem) {
      handleQuantityChange(item?.id, existingItem?.quantity + 1);
    } else {
      setCartItems(prev => [...prev, { ...item, quantity: 1 }]);
    }
  };

  // Update page title
  useEffect(() => {
    document.title = `Shopping Cart (${cartItems?.length}) - HerbalCare`;
  }, [cartItems?.length]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
            <a href="/homepage" className="hover:text-foreground transition-natural">
              Home
            </a>
            <Icon name="ChevronRight" size={16} />
            <span className="text-foreground">Shopping Cart</span>
          </nav>

          {cartItems?.length === 0 ? (
            <EmptyCart onContinueShopping={handleContinueShopping} />
          ) : (
            <>
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                  <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
                    Shopping Cart
                  </h1>
                  <p className="text-muted-foreground">
                    {cartItems?.length} {cartItems?.length === 1 ? 'item' : 'items'} in your cart
                  </p>
                </div>
                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  <Button
                    variant="outline"
                    onClick={handleContinueShopping}
                    iconName="ArrowLeft"
                    iconPosition="left"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>

              {/* Desktop Table Header */}
              <div className="hidden lg:block mb-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="grid grid-cols-8 gap-4 text-sm font-medium text-muted-foreground">
                    <div className="col-span-3">Product</div>
                    <div className="text-center">Price</div>
                    <div className="text-center">Quantity</div>
                    <div className="text-center">Total</div>
                    <div className="text-center">Actions</div>
                  </div>
                </div>
              </div>

              {/* Cart Content */}
              <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-8">
                  <div className="space-y-4 mb-8 lg:mb-0">
                    {cartItems?.map((item) => (
                      <CartItem
                        key={item?.id}
                        item={item}
                        onQuantityChange={handleQuantityChange}
                        onRemove={handleRemoveItem}
                        onSaveForLater={handleSaveForLater}
                      />
                    ))}
                  </div>

                  {/* Mobile Order Summary */}
                  <div className="lg:hidden mt-8">
                    <OrderSummary
                      subtotal={subtotal}
                      shipping={shipping}
                      tax={tax}
                      discount={discount}
                      total={total}
                      onCheckout={handleCheckout}
                      isCheckoutLoading={isCheckoutLoading}
                      promoCode={promoCode}
                      onPromoCodeChange={setPromoCode}
                      onApplyPromo={handleApplyPromo}
                      promoError={promoError}
                      promoSuccess={promoSuccess}
                    />
                  </div>
                </div>

                {/* Desktop Order Summary */}
                <div className="hidden lg:block lg:col-span-4">
                  <OrderSummary
                    subtotal={subtotal}
                    shipping={shipping}
                    tax={tax}
                    discount={discount}
                    total={total}
                    onCheckout={handleCheckout}
                    isCheckoutLoading={isCheckoutLoading}
                    promoCode={promoCode}
                    onPromoCodeChange={setPromoCode}
                    onApplyPromo={handleApplyPromo}
                    promoError={promoError}
                    promoSuccess={promoSuccess}
                  />
                </div>
              </div>
            </>
          )}

          {/* Saved Items */}
          <SavedItems
            savedItems={savedItems}
            onMoveToCart={handleMoveToCart}
            onRemoveFromSaved={handleRemoveFromSaved}
          />

          {/* Recently Viewed */}
          <RecentlyViewed
            recentItems={recentlyViewed}
            onAddToCart={handleAddToCart}
          />

          {/* Trust Signals */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-card border border-border rounded-lg">
              <Icon name="Shield" size={32} color="currentColor" className="mx-auto mb-3 text-primary" />
              <h3 className="font-semibold text-foreground mb-2">Secure Shopping</h3>
              <p className="text-sm text-muted-foreground">
                Your payment information is protected with SSL encryption
              </p>
            </div>
            <div className="text-center p-6 bg-card border border-border rounded-lg">
              <Icon name="Truck" size={32} color="currentColor" className="mx-auto mb-3 text-primary" />
              <h3 className="font-semibold text-foreground mb-2">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">
                Free delivery on orders above ₹999 across India
              </p>
            </div>
            <div className="text-center p-6 bg-card border border-border rounded-lg">
              <Icon name="RotateCcw" size={32} color="currentColor" className="mx-auto mb-3 text-primary" />
              <h3 className="font-semibold text-foreground mb-2">Easy Returns</h3>
              <p className="text-sm text-muted-foreground">
                30-day hassle-free return policy on all products
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShoppingCart;