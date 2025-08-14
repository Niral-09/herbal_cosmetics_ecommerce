import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const CategorySection = () => {
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const handleCategoryClick = (category) => {
    const slug = category?.slug || category?.name?.toLowerCase();
    window.location.href = `/product-catalog?category=${encodeURIComponent(slug)}`;
  };

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/v1/categories?hierarchical=false');
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : (data?.items || []));
      } catch (e) {
        console.error('Failed to load categories', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);


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

        {loading && <div>Loading...</div>}
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
                  src={category?.image_url || 'https://picsum.photos/400/300'}
                  alt={category?.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-natural-slow"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/30 to-transparent transition-natural`}></div>

                {/* Icon */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Icon name={category?.icon || 'Sparkles'} size={20} color="white" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading font-semibold text-xl text-foreground group-hover:text-primary transition-natural">
                    {category?.name}
                  </h3>
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