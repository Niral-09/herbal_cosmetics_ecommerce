import React from 'react';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const HeroBanner = () => {
  const heroData = {
    title: "Pure Herbal Beauty",
    subtitle: "Discover Nature\'s Secret to Radiant Skin",
    description: "Transform your beauty routine with our premium collection of organic herbal cosmetics. Made with 100% natural ingredients for healthier, glowing skin.",
    ctaText: "Shop Now",
    secondaryCtaText: "Learn More",
    backgroundImage: "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    featuredProduct: {
      name: "Herbal Glow Serum",
      originalPrice: 89.99,
      salePrice: 69.99,
      image: "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400"
    }
  };

  const handleShopNow = () => {
    window.location.href = '/product-catalog';
  };

  const handleLearnMore = () => {
    // Scroll to featured products section
    const featuredSection = document.getElementById('featured-products');
    if (featuredSection) {
      featuredSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroData?.backgroundImage}
          alt="Herbal cosmetics background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/60"></div>
      </div>
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {heroData?.title}
            </h1>
            <h2 className="text-xl sm:text-2xl lg:text-3xl text-white/90 mb-6 font-medium">
              {heroData?.subtitle}
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {heroData?.description}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                variant="default"
                size="lg"
                onClick={handleShopNow}
                className="bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-4 text-lg"
              >
                {heroData?.ctaText}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleLearnMore}
                className="border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-4 text-lg"
              >
                {heroData?.secondaryCtaText}
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-8 text-white/70">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm">100% Natural</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm">Cruelty Free</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm">Organic Certified</span>
              </div>
            </div>
          </div>

          {/* Featured Product Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-natural-lg max-w-sm w-full">
              <div className="relative mb-4">
                <Image
                  src={heroData?.featuredProduct?.image}
                  alt={heroData?.featuredProduct?.name}
                  className="w-full h-48 object-cover rounded-xl"
                />
                <div className="absolute top-3 right-3 bg-error text-white px-2 py-1 rounded-full text-xs font-medium">
                  Sale
                </div>
              </div>
              
              <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                {heroData?.featuredProduct?.name}
              </h3>
              
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl font-bold text-primary">
                  ₹{heroData?.featuredProduct?.salePrice}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  ₹{heroData?.featuredProduct?.originalPrice}
                </span>
              </div>
              
              <Button
                variant="default"
                fullWidth
                onClick={handleShopNow}
                className="bg-primary hover:bg-primary/90"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;