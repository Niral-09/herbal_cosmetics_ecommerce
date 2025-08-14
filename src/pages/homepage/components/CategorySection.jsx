import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const CategorySection = () => {
  const categories = [
    {
      id: 1,
      name: "Hair Care",
      description: "Natural shampoos, conditioners & treatments",
      image: "https://images.pixabay.com/photos/2020/05/11/06/20/hair-5158152_1280.jpg",
      productCount: 45,
      icon: "Sparkles",
      color: "from-green-400 to-green-600"
    },
    {
      id: 2,
      name: "Skin Care",
      description: "Organic creams, serums & cleansers",
      image: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      productCount: 67,
      icon: "Heart",
      color: "from-pink-400 to-pink-600"
    },
    {
      id: 3,
      name: "Hygiene",
      description: "Natural soaps, sanitizers & body care",
      image: "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800",
      productCount: 32,
      icon: "Droplets",
      color: "from-blue-400 to-blue-600"
    },
    {
      id: 4,
      name: "All Products",
      description: "Complete collection of herbal cosmetics",
      image: "https://images.pixabay.com/photos/2019/07/15/12/35/soap-4339235_1280.jpg",
      productCount: 144,
      icon: "Package",
      color: "from-purple-400 to-purple-600"
    }
  ];

  const handleCategoryClick = (category) => {
    // Navigate to product catalog with category filter
    const categoryParam = category?.name === 'All Products' ? '' : `?category=${encodeURIComponent(category?.name?.toLowerCase())}`;
    window.location.href = `/product-catalog${categoryParam}`;
  };

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully curated collection of natural and organic beauty products
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories?.map((category) => (
            <div
              key={category?.id}
              onClick={() => handleCategoryClick(category)}
              className="group relative bg-card rounded-2xl overflow-hidden shadow-natural hover:shadow-natural-lg transition-natural cursor-pointer transform hover:-translate-y-1"
            >
              {/* Background Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={category?.image}
                  alt={category?.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-natural-slow"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${category?.color} opacity-80 group-hover:opacity-70 transition-natural`}></div>
                
                {/* Icon */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Icon name={category?.icon} size={20} color="white" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading font-semibold text-xl text-foreground group-hover:text-primary transition-natural">
                    {category?.name}
                  </h3>
                  <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {category?.productCount}
                  </span>
                </div>
                
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {category?.description}
                </p>
                
                <div className="flex items-center text-primary group-hover:text-secondary transition-natural">
                  <span className="text-sm font-medium">Explore Collection</span>
                  <Icon name="ArrowRight" size={16} className="ml-2 group-hover:translate-x-1 transition-natural" />
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-2xl transition-natural pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 text-muted-foreground">
            <Icon name="Leaf" size={20} color="currentColor" />
            <span className="text-sm">All products are 100% natural and cruelty-free</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;