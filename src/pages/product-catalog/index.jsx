import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/ui/Header';

import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ProductGrid from './components/ProductGrid';
import FilterSidebar from './components/FilterSidebar';
import FilterChips from './components/FilterChips';
import QuickViewModal from './components/QuickViewModal';
import SortDropdown from './components/SortDropdown';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSort, setCurrentSort] = useState('popularity');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 5000 },
    categories: [],
    skinTypes: [],
    ingredients: [],
    brands: []
  });

  // Mock product data
  const mockProducts = [
    {
      id: 1,
      name: "Herbal Aloe Vera Face Cream",
      category: "Skin Care",
      price: 299.99,
      originalPrice: 399.99,
      discount: 25,
      rating: 4.5,
      reviewCount: 128,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
      isNew: true,
      description: `A nourishing face cream enriched with pure aloe vera extract, perfect for daily moisturizing and skin protection. This lightweight formula absorbs quickly without leaving any greasy residue.`,
      benefits: [
        "Deep moisturization for 24 hours",
        "Soothes irritated and sensitive skin",
        "Natural UV protection",
        "Anti-aging properties"
      ],
      variants: [
        { size: "50ml", price: 299.99 },
        { size: "100ml", price: 499.99 },
        { size: "200ml", price: 799.99 }
      ]
    },
    {
      id: 2,
      name: "Natural Turmeric Body Lotion",
      category: "Skin Care",
      price: 249.99,
      originalPrice: 329.99,
      discount: 24,
      rating: 4.3,
      reviewCount: 95,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      isNew: false,
      description: `Luxurious body lotion infused with turmeric and natural oils to brighten and nourish your skin. Suitable for all skin types.`,
      benefits: [
        "Brightens skin tone naturally",
        "Reduces dark spots and blemishes",
        "Long-lasting hydration",
        "Anti-inflammatory properties"
      ],
      variants: [
        { size: "200ml", price: 249.99 },
        { size: "400ml", price: 449.99 }
      ]
    },
    {
      id: 3,
      name: "Organic Neem Shampoo",
      category: "Hair Care",
      price: 199.99,
      rating: 4.7,
      reviewCount: 203,
      image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&h=400&fit=crop",
      isNew: true,
      description: `Gentle cleansing shampoo with neem extract that helps control dandruff and promotes healthy hair growth.`,
      benefits: [
        "Controls dandruff effectively",
        "Strengthens hair roots",
        "Natural antibacterial properties",
        "Suitable for daily use"
      ],
      variants: [
        { size: "250ml", price: 199.99 },
        { size: "500ml", price: 349.99 }
      ]
    },
    {
      id: 4,
      name: "Tea Tree Oil Face Wash",
      category: "Skin Care",
      price: 179.99,
      rating: 4.4,
      reviewCount: 156,
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
      isNew: false,
      description: `Deep cleansing face wash with tea tree oil, perfect for oily and acne-prone skin. Removes excess oil without over-drying.`,
      benefits: [
        "Deep pore cleansing",
        "Controls excess oil production",
        "Prevents acne breakouts",
        "Refreshes and revitalizes skin"
      ],
      variants: [
        { size: "100ml", price: 179.99 },
        { size: "200ml", price: 299.99 }
      ]
    },
    {
      id: 5,
      name: "Coconut Oil Hair Mask",
      category: "Hair Care",
      price: 229.99,
      originalPrice: 279.99,
      discount: 18,
      rating: 4.6,
      reviewCount: 89,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      isNew: false,
      description: `Intensive hair treatment mask with pure coconut oil and natural proteins for deep nourishment and repair.`,
      benefits: [
        "Deep hair conditioning",
        "Repairs damaged hair",
        "Adds natural shine",
        "Prevents hair breakage"
      ],
      variants: [
        { size: "150ml", price: 229.99 },
        { size: "300ml", price: 399.99 }
      ]
    },
    {
      id: 6,
      name: "Herbal Soap Collection",
      category: "Personal Hygiene",
      price: 149.99,
      rating: 4.2,
      reviewCount: 67,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
      isNew: true,
      description: `Set of 3 handmade herbal soaps with different natural ingredients for various skin needs.`,
      benefits: [
        "100% natural ingredients",
        "Gentle on sensitive skin",
        "Long-lasting fragrance",
        "Eco-friendly packaging"
      ],
      variants: [
        { size: "3 x 100g", price: 149.99 },
        { size: "6 x 100g", price: 279.99 }
      ]
    },
    {
      id: 7,
      name: "Rose Water Toner",
      category: "Skin Care",
      price: 129.99,
      rating: 4.5,
      reviewCount: 142,
      image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&h=400&fit=crop",
      isNew: false,
      description: `Pure rose water toner that refreshes and balances your skin's pH while providing natural hydration.`,
      benefits: [
        "Balances skin pH naturally",
        "Tightens pores",
        "Refreshes and hydrates",
        "Suitable for all skin types"
      ],
      variants: [
        { size: "100ml", price: 129.99 },
        { size: "200ml", price: 219.99 }
      ]
    },
    {
      id: 8,
      name: "Ayurvedic Hair Oil",
      category: "Hair Care",
      price: 189.99,
      originalPrice: 239.99,
      discount: 21,
      rating: 4.8,
      reviewCount: 234,
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
      isNew: true,
      description: `Traditional Ayurvedic hair oil blend with 12 natural herbs for stronger, healthier hair growth.`,
      benefits: [
        "Promotes hair growth",
        "Reduces hair fall",
        "Nourishes scalp",
        "Prevents premature graying"
      ],
      variants: [
        { size: "100ml", price: 189.99 },
        { size: "200ml", price: 329.99 }
      ]
    }
  ];

  // Initialize products
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setIsLoading(false);
    };

    loadProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery?.trim()) {
      filtered = filtered?.filter(product =>
        product?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        product?.category?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Apply price filter
    filtered = filtered?.filter(product =>
      product?.price >= filters?.priceRange?.min && product?.price <= filters?.priceRange?.max
    );

    // Apply category filter
    if (filters?.categories?.length > 0) {
      filtered = filtered?.filter(product =>
        filters?.categories?.some(category => {
          const categoryMap = {
            'hair': 'Hair Care',
            'skin': 'Skin Care',
            'hygiene': 'Personal Hygiene',
            'makeup': 'Natural Makeup'
          };
          return product?.category === categoryMap?.[category];
        })
      );
    }

    // Apply sorting
    switch (currentSort) {
      case 'price-low':
        filtered?.sort((a, b) => a?.price - b?.price);
        break;
      case 'price-high':
        filtered?.sort((a, b) => b?.price - a?.price);
        break;
      case 'rating':
        filtered?.sort((a, b) => b?.rating - a?.rating);
        break;
      case 'newest':
        filtered?.sort((a, b) => b?.isNew - a?.isNew);
        break;
      case 'name-az':
        filtered?.sort((a, b) => a?.name?.localeCompare(b?.name));
        break;
      case 'name-za':
        filtered?.sort((a, b) => b?.name?.localeCompare(a?.name));
        break;
      default: // popularity
        filtered?.sort((a, b) => b?.reviewCount - a?.reviewCount);
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, filters, currentSort]);

  const handleSearch = (e) => {
    setSearchQuery(e?.target?.value);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleRemoveFilter = (filterType, filterId) => {
    if (filterType === 'priceRange') {
      setFilters(prev => ({
        ...prev,
        priceRange: { min: 0, max: 5000 }
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [filterType]: prev?.[filterType]?.filter(item => item !== filterId)
      }));
    }
  };

  const handleClearAllFilters = () => {
    setFilters({
      priceRange: { min: 0, max: 5000 },
      categories: [],
      skinTypes: [],
      ingredients: [],
      brands: []
    });
    setSearchQuery('');
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleAddToCart = async (product) => {
    // Simulate add to cart
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Added to cart:', product);
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
    // In real app, this would load more products
  };

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement?.scrollTop !== document.documentElement?.offsetHeight || isLoading) {
      return;
    }
    if (hasMore) {
      handleLoadMore();
    }
  }, [isLoading, hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
              Product Catalog
            </h1>
            <p className="text-muted-foreground">
              Discover our complete range of natural herbal cosmetics
            </p>
          </div>

          {/* Search Bar - Mobile */}
          <div className="lg:hidden mb-6">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full"
            />
          </div>

          <div className="flex gap-8">
            {/* Desktop Filter Sidebar */}
            <div className="hidden lg:block">
              <FilterSidebar
                isOpen={true}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                isMobile={false}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* Search Bar - Desktop */}
              <div className="hidden lg:block">
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="max-w-md"
                />
              </div>

              {/* Filter Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Mobile Filter Button */}
                  <Button
                    variant="outline"
                    onClick={() => setIsFilterOpen(true)}
                    iconName="Filter"
                    iconPosition="left"
                    className="lg:hidden"
                  >
                    Filters
                  </Button>

                  {/* Results Count */}
                  <span className="text-sm text-muted-foreground">
                    {filteredProducts?.length} products found
                  </span>
                </div>

                {/* Sort Dropdown */}
                <SortDropdown
                  currentSort={currentSort}
                  onSortChange={setCurrentSort}
                />
              </div>

              {/* Active Filters */}
              <FilterChips
                activeFilters={filters}
                onRemoveFilter={handleRemoveFilter}
                onClearAll={handleClearAllFilters}
              />

              {/* Product Grid */}
              <ProductGrid
                products={filteredProducts}
                isLoading={isLoading}
                onQuickView={handleQuickView}
                onAddToCart={handleAddToCart}
              />

              {/* Load More Button */}
              {!isLoading && filteredProducts?.length > 0 && hasMore && (
                <div className="text-center pt-8">
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    iconName="ChevronDown"
                    iconPosition="right"
                  >
                    Load More Products
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Mobile Filter Sidebar */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        isMobile={true}
      />
      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default ProductCatalog;