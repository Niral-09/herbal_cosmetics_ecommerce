import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FeaturedProducts = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/v1/products');
        const data = await res.json();
        setItems(Array.isArray(data?.items) ? data.items : data);
      } catch (e) {
        console.error('Failed to load featured products', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const itemsPerSlide = 3;
  const totalSlides = Math.ceil((items?.length || 0) / itemsPerSlide) || 1;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleAddToCart = (product) => {
    console.log('Add to cart:', product);
    // Add to cart logic here
  };

  const handleQuickView = (product) => {
    console.log('Quick view:', product);
    // Quick view modal logic here
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars?.push(<Icon key={i} name="Star" size={14} className="text-warning fill-current" />);
    }

    if (hasHalfStar) {
      stars?.push(<Icon key="half" name="StarHalf" size={14} className="text-warning fill-current" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars?.push(<Icon key={`empty-${i}`} name="Star" size={14} className="text-muted-foreground" />);
    }

    return stars;
  };

  const getCurrentProducts = () => {
    const startIndex = currentSlide * itemsPerSlide;
    return items?.slice(startIndex, startIndex + itemsPerSlide);
  };

  return (
    <section id="featured-products" className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover our most popular herbal cosmetics
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={prevSlide}
              className="w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center hover:bg-muted transition-natural"
              disabled={currentSlide === 0}
            >
              <Icon name="ChevronLeft" size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center hover:bg-muted transition-natural"
              disabled={currentSlide === totalSlides - 1}
            >
              <Icon name="ChevronRight" size={20} />
            </button>
          </div>
        </div>

        {/* Products Carousel */}
        <div className="relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getCurrentProducts()?.map((product) => (
              <div
                key={product?.id}
                className="group bg-card rounded-2xl overflow-hidden shadow-natural hover:shadow-natural-lg transition-natural"
              >
                {/* Product Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={product?.images?.[0]?.image_url || product?.image_url || ''}
                    alt={product?.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-natural-slow"
                  />

                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-natural">
                    <button
                      onClick={() => handleQuickView(product)}
                      className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-natural"
                    >
                      <Icon name="Eye" size={16} />
                    </button>
                    <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-natural">
                      <Icon name="Heart" size={16} />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-natural">
                    {product?.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center space-x-1">
                      {renderStars(product?.rating)}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product?.rating} ({product?.reviews})
                    </span>
                  </div>

                  {/* Ingredients */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {product?.ingredients?.slice(0, 2)?.map((ingredient, index) => (
                      <span
                        key={index}
                        className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full"
                      >
                        {ingredient}
                      </span>
                    ))}
                    {product?.ingredients?.length > 2 && (
                      <span className="text-xs text-muted-foreground px-2 py-1">
                        +{product?.ingredients?.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-primary">
                        ₹{product?.price}
                      </span>
                      {product?.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          ₹{product?.originalPrice}
                        </span>
                      )}
                    </div>
                    {product?.originalPrice && (
                      <span className="text-sm font-medium text-success">
                        Save ₹{(product?.originalPrice - product?.price)?.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    variant="default"
                    fullWidth
                    onClick={() => handleAddToCart(product)}
                    iconName="ShoppingCart"
                    iconPosition="left"
                    className="bg-primary hover:bg-primary/90"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Navigation Dots */}
        <div className="flex justify-center space-x-2 mt-8 md:hidden">
          {Array.from({ length: totalSlides })?.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-natural ${
                currentSlide === index ? 'bg-primary' : 'bg-muted-foreground'
              }`}
            />
          ))}
        </div>

        {/* View All Products CTA */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.location.href = '/product-catalog'}
            iconName="ArrowRight"
            iconPosition="right"
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;