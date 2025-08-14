import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const EmptyCart = ({ onContinueShopping }) => {
  const suggestedProducts = [
    {
      id: 1,
      name: "Herbal Face Cream",
      price: 29.99,
      originalPrice: 39.99,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop",
      rating: 4.5,
      category: "Skincare"
    },
    {
      id: 2,
      name: "Natural Body Lotion",
      price: 24.99,
      originalPrice: 29.99,
      image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&h=300&fit=crop",
      rating: 4.3,
      category: "Body Care"
    },
    {
      id: 3,
      name: "Organic Shampoo",
      price: 19.99,
      originalPrice: 24.99,
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop",
      rating: 4.7,
      category: "Hair Care"
    }
  ];

  const categories = [
    { name: "Hair Care", icon: "Scissors", href: "/product-catalog?category=hair" },
    { name: "Skin Care", icon: "Sparkles", href: "/product-catalog?category=skin" },
    { name: "Body Care", icon: "Heart", href: "/product-catalog?category=body" },
    { name: "Hygiene", icon: "Droplets", href: "/product-catalog?category=hygiene" }
  ];

  const handleProductClick = (productId) => {
    window.location.href = `/product-detail/${productId}`;
  };

  const handleCategoryClick = (href) => {
    window.location.href = href;
  };

  return (
    <div className="text-center py-12">
      {/* Empty Cart Icon */}
      <div className="mb-8">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="ShoppingCart" size={48} color="currentColor" className="text-muted-foreground" />
        </div>
        <h2 className="font-heading font-semibold text-2xl text-foreground mb-2">
          Your cart is empty
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Looks like you haven't added any herbal cosmetics to your cart yet. 
          Discover our natural beauty products and start your wellness journey.
        </p>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <Button
          variant="default"
          onClick={onContinueShopping}
          iconName="ArrowLeft"
          iconPosition="left"
          className="sm:w-auto"
        >
          Continue Shopping
        </Button>
        <Button
          variant="outline"
          onClick={() => window.location.href = '/product-catalog?featured=true'}
          iconName="Star"
          iconPosition="left"
          className="sm:w-auto"
        >
          View Featured Products
        </Button>
      </div>
      {/* Category Quick Links */}
      <div className="mb-12">
        <h3 className="font-heading font-semibold text-lg text-foreground mb-6">
          Shop by Category
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {categories?.map((category) => (
            <button
              key={category?.name}
              onClick={() => handleCategoryClick(category?.href)}
              className="p-6 bg-card border border-border rounded-lg hover:shadow-natural-lg transition-natural group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-natural">
                <Icon name={category?.icon} size={24} color="currentColor" className="text-primary" />
              </div>
              <p className="font-medium text-foreground">{category?.name}</p>
            </button>
          ))}
        </div>
      </div>
      {/* Suggested Products */}
      <div>
        <h3 className="font-heading font-semibold text-lg text-foreground mb-6">
          You might like these
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {suggestedProducts?.map((product) => (
            <div
              key={product?.id}
              className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-natural-lg transition-natural group cursor-pointer"
              onClick={() => handleProductClick(product?.id)}
            >
              <div className="aspect-square bg-muted overflow-hidden">
                <Image
                  src={product?.image}
                  alt={product?.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-natural"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-primary font-medium mb-1">
                  {product?.category}
                </p>
                <h4 className="font-medium text-foreground mb-2 truncate">
                  {product?.name}
                </h4>
                <div className="flex items-center space-x-1 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)]?.map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={12}
                        color={i < Math.floor(product?.rating) ? "#F59E0B" : "#E5E7EB"}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({product?.rating})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-foreground">
                      ₹{product?.price}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{product?.originalPrice}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Plus"
                    iconPosition="left"
                    onClick={(e) => {
                      e?.stopPropagation();
                      console.log('Add to cart:', product?.id);
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Newsletter Signup */}
      <div className="mt-12 p-8 bg-muted rounded-lg max-w-2xl mx-auto">
        <Icon name="Mail" size={32} color="currentColor" className="mx-auto mb-4 text-primary" />
        <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
          Stay updated with our latest products
        </h3>
        <p className="text-muted-foreground mb-6">
          Get exclusive offers and be the first to know about new herbal cosmetics.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button
            variant="default"
            iconName="Send"
            iconPosition="left"
            className="sm:w-auto"
          >
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;