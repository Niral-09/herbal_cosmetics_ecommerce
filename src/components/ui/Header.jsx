import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItemCount] = useState(3);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCartClick = () => {
    window.location.href = '/shopping-cart';
  };

  const handleLogoClick = () => {
    window.location.href = '/homepage';
  };

  const navigationItems = [
    { name: 'Home', href: '/homepage', icon: 'Home' },
    { name: 'Products', href: '/product-catalog', icon: 'Package' },
    { name: 'Cart', href: '/shopping-cart', icon: 'ShoppingCart', badge: cartItemCount },
    { name: 'Checkout', href: '/checkout', icon: 'CreditCard' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-natural">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={handleLogoClick}
              className="flex items-center space-x-2 transition-natural hover:opacity-80"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Leaf" size={20} color="white" />
              </div>
              <span className="font-heading font-semibold text-xl text-foreground">
                HerbalCare
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems?.map((item) => (
              <a
                key={item?.name}
                href={item?.href}
                className="relative flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-natural"
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.name}</span>
                {item?.badge && item?.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                    {item?.badge}
                  </span>
                )}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              iconName="Search"
              iconPosition="left"
              className="text-muted-foreground hover:text-foreground"
            >
              Search
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="User"
              iconPosition="left"
            >
              Account
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={handleCartClick}
              className="relative p-2 text-muted-foreground hover:text-foreground transition-natural"
            >
              <Icon name="ShoppingCart" size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-muted-foreground hover:text-foreground transition-natural"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border shadow-natural-lg animate-slide-in">
          <div className="px-4 py-3 space-y-1">
            {navigationItems?.map((item) => (
              <a
                key={item?.name}
                href={item?.href}
                className="flex items-center justify-between px-3 py-3 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-natural"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <Icon name={item?.icon} size={20} />
                  <span>{item?.name}</span>
                </div>
                {item?.badge && item?.badge > 0 && (
                  <span className="bg-accent text-accent-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                    {item?.badge}
                  </span>
                )}
              </a>
            ))}
            <div className="border-t border-border pt-3 mt-3 space-y-1">
              <button className="flex items-center space-x-3 w-full px-3 py-3 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-natural">
                <Icon name="Search" size={20} />
                <span>Search Products</span>
              </button>
              <button className="flex items-center space-x-3 w-full px-3 py-3 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-natural">
                <Icon name="User" size={20} />
                <span>My Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;