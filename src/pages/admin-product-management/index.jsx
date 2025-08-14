import React, { useState, useEffect, useMemo } from 'react';

import Button from '../../components/ui/Button';
import AdminSidebar from '../../components/ui/AdminSidebar';
import AdminNotificationCenter from '../../components/ui/AdminNotificationCenter';
import ProductTable from './components/ProductTable';
import ProductFilters from './components/ProductFilters';
import BulkActionToolbar from './components/BulkActionToolbar';
import ProductFormModal from './components/ProductFormModal';
import Pagination from './components/Pagination';

const AdminProductManagement = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    stockStatus: '',
    status: '',
    minPrice: '',
    maxPrice: ''
  });

  // Mock products data
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Herbal Face Cream",
      brand: "herbal-essence",
      sku: "HFC-001",
      category: "skin-care",
      price: 299.99,
      comparePrice: 399.99,
      stock: 45,
      status: "active",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
      shortDescription: "Natural herbal face cream for all skin types",
      description: `This premium herbal face cream is formulated with natural ingredients to nourish and protect your skin.\n\nPerfect for daily use, it provides deep moisturization while maintaining your skin's natural balance.`,
      ingredients: "Aloe Vera, Turmeric, Neem, Coconut Oil, Shea Butter",
      usage: "Apply gently on clean face twice daily",
      benefits: "Moisturizes, protects, and rejuvenates skin naturally",
      images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop"]
    },
    {
      id: 2,
      name: "Natural Body Lotion",
      brand: "nature-care",
      sku: "NBL-002",
      category: "skin-care",
      price: 249.99,
      comparePrice: null,
      stock: 8,
      status: "active",
      image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop",
      shortDescription: "Organic body lotion with essential oils",
      description: `Luxurious body lotion made with organic ingredients and essential oils.\n\nProvides long-lasting hydration and leaves skin feeling soft and smooth.`,
      ingredients: "Organic Coconut Oil, Lavender Oil, Vitamin E, Cocoa Butter",
      usage: "Apply on clean skin after shower",
      benefits: "Deep hydration, smooth texture, pleasant fragrance",
      images: ["https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop"]
    },
    {
      id: 3,
      name: "Organic Shampoo",
      brand: "organic-beauty",
      sku: "OS-003",
      category: "hair-care",
      price: 199.99,
      comparePrice: 249.99,
      stock: 0,
      status: "active",
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
      shortDescription: "Sulfate-free organic shampoo for healthy hair",
      description: `Gentle sulfate-free shampoo made with organic herbs and natural cleansers.\n\nSuitable for all hair types and safe for daily use.`,
      ingredients: "Organic Argan Oil, Rosemary Extract, Aloe Vera, Tea Tree Oil",
      usage: "Apply to wet hair, lather, and rinse thoroughly",
      benefits: "Cleanses gently, strengthens hair, adds natural shine",
      images: ["https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop"]
    },
    {
      id: 4,
      name: "Herbal Hair Oil",
      brand: "pure-herbs",
      sku: "HHO-004",
      category: "hair-care",
      price: 179.99,
      comparePrice: null,
      stock: 32,
      status: "active",
      image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop",
      shortDescription: "Traditional herbal hair oil for hair growth",
      description: `Traditional Ayurvedic hair oil blend with proven herbs for hair health.\n\nPromotes hair growth and prevents hair fall naturally.`,
      ingredients: "Coconut Oil, Brahmi, Bhringraj, Amla, Fenugreek",
      usage: "Massage into scalp and hair, leave for 30 minutes before washing",
      benefits: "Promotes growth, reduces hair fall, strengthens roots",
      images: ["https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop"]
    },
    {
      id: 5,
      name: "Natural Hand Sanitizer",
      brand: "green-life",
      sku: "NHS-005",
      category: "hygiene",
      price: 89.99,
      comparePrice: 119.99,
      stock: 67,
      status: "active",
      image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=400&h=400&fit=crop",
      shortDescription: "Alcohol-based hand sanitizer with aloe vera",
      description: `Effective hand sanitizer with 70% alcohol content and moisturizing aloe vera.\n\nKills 99.9% of germs while keeping hands soft.`,
      ingredients: "Ethyl Alcohol 70%, Aloe Vera Gel, Glycerin, Essential Oils",
      usage: "Apply small amount and rub hands until dry",
      benefits: "Kills germs, moisturizes hands, pleasant fragrance",
      images: ["https://images.unsplash.com/photo-1584362917165-526a968579e8?w=400&h=400&fit=crop"]
    },
    {
      id: 6,
      name: "Aromatherapy Essential Oil Set",
      brand: "herbal-essence",
      sku: "AEOS-006",
      category: "aromatherapy",
      price: 599.99,
      comparePrice: 799.99,
      stock: 15,
      status: "active",
      image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop",
      shortDescription: "Premium essential oils set for aromatherapy",
      description: `Complete set of 6 premium essential oils for aromatherapy and wellness.\n\nIncludes lavender, eucalyptus, peppermint, tea tree, lemon, and rosemary oils.`,
      ingredients: "100% Pure Essential Oils - Lavender, Eucalyptus, Peppermint, Tea Tree, Lemon, Rosemary",
      usage: "Use with diffuser or add few drops to carrier oil for topical use",
      benefits: "Relaxation, stress relief, mood enhancement, natural wellness",
      images: ["https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop"]
    },
    {
      id: 7,
      name: "Herbal Immunity Booster",
      brand: "nature-care",
      sku: "HIB-007",
      category: "supplements",
      price: 449.99,
      comparePrice: null,
      stock: 28,
      status: "inactive",
      image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&h=400&fit=crop",
      shortDescription: "Natural immunity booster capsules",
      description: `Herbal supplement capsules to boost natural immunity and overall health.\n\nMade with traditional Ayurvedic herbs and modern processing techniques.`,
      ingredients: "Ashwagandha, Giloy, Tulsi, Amla, Turmeric, Black Pepper",
      usage: "Take 1-2 capsules daily with warm water after meals",
      benefits: "Boosts immunity, increases energy, supports overall wellness",
      images: ["https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&h=400&fit=crop"]
    },
    {
      id: 8,
      name: "Natural Lip Balm",
      brand: "organic-beauty",
      sku: "NLB-008",
      category: "skin-care",
      price: 79.99,
      comparePrice: 99.99,
      stock: 89,
      status: "active",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
      shortDescription: "Organic lip balm with natural ingredients",
      description: `Moisturizing lip balm made with organic beeswax and natural oils.\n\nProvides long-lasting protection and keeps lips soft and smooth.`,
      ingredients: "Organic Beeswax, Coconut Oil, Shea Butter, Vitamin E, Natural Flavors",
      usage: "Apply to lips as needed throughout the day",
      benefits: "Moisturizes lips, prevents chapping, natural protection",
      images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop"]
    }
  ]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products?.filter(product => {
      const matchesSearch = searchQuery === '' || 
        product?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        product?.sku?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        product?.brand?.toLowerCase()?.includes(searchQuery?.toLowerCase());

      const matchesCategory = filters?.category === '' || product?.category === filters?.category;
      const matchesBrand = filters?.brand === '' || product?.brand === filters?.brand;
      const matchesStatus = filters?.status === '' || product?.status === filters?.status;

      const matchesStockStatus = filters?.stockStatus === '' || 
        (filters?.stockStatus === 'in-stock' && product?.stock > 10) ||
        (filters?.stockStatus === 'low-stock' && product?.stock > 0 && product?.stock <= 10) ||
        (filters?.stockStatus === 'out-of-stock' && product?.stock === 0);

      const matchesMinPrice = filters?.minPrice === '' || product?.price >= parseFloat(filters?.minPrice);
      const matchesMaxPrice = filters?.maxPrice === '' || product?.price <= parseFloat(filters?.maxPrice);

      return matchesSearch && matchesCategory && matchesBrand && matchesStatus && 
             matchesStockStatus && matchesMinPrice && matchesMaxPrice;
    });

    // Sort products
    filtered?.sort((a, b) => {
      let aValue = a?.[sortConfig?.key];
      let bValue = b?.[sortConfig?.key];

      if (typeof aValue === 'string') {
        aValue = aValue?.toLowerCase();
        bValue = bValue?.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig?.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig?.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [products, searchQuery, filters, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts?.length / itemsPerPage);
  const paginatedProducts = filteredAndSortedProducts?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      stockStatus: '',
      status: '',
      minPrice: '',
      maxPrice: ''
    });
    setSearchQuery('');
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev?.includes(productId) 
        ? prev?.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    setSelectedProducts(
      selectedProducts?.length === paginatedProducts?.length 
        ? [] 
        : paginatedProducts?.map(p => p?.id)
    );
  };

  const handleClearSelection = () => {
    setSelectedProducts([]);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleDuplicateProduct = (product) => {
    const duplicatedProduct = {
      ...product,
      id: Date.now(),
      name: `${product?.name} (Copy)`,
      sku: `${product?.sku}-COPY`
    };
    setProducts(prev => [...prev, duplicatedProduct]);
  };

  const handleArchiveProduct = (productId) => {
    if (window.confirm('Are you sure you want to archive this product?')) {
      setProducts(prev => prev?.map(p => 
        p?.id === productId ? { ...p, status: 'inactive' } : p
      ));
    }
  };

  const handleQuickStockUpdate = (productId, newStock) => {
    setProducts(prev => prev?.map(p => 
      p?.id === productId ? { ...p, stock: newStock } : p
    ));
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      // Update existing product
      setProducts(prev => prev?.map(p => 
        p?.id === editingProduct?.id ? { ...productData, id: editingProduct?.id } : p
      ));
    } else {
      // Add new product
      setProducts(prev => [...prev, { ...productData, id: Date.now() }]);
    }
    setEditingProduct(null);
  };

  const handleBulkPriceUpdate = ({ type, value }) => {
    setProducts(prev => prev?.map(p => {
      if (selectedProducts?.includes(p?.id)) {
        let newPrice = p?.price;
        if (type === 'percentage') {
          newPrice = p?.price * (1 + value / 100);
        } else {
          newPrice = p?.price + value;
        }
        return { ...p, price: Math.max(0, newPrice) };
      }
      return p;
    }));
    setSelectedProducts([]);
  };

  const handleBulkCategoryChange = (category) => {
    setProducts(prev => prev?.map(p => 
      selectedProducts?.includes(p?.id) ? { ...p, category } : p
    ));
    setSelectedProducts([]);
  };

  const handleBulkStatusChange = (status) => {
    setProducts(prev => prev?.map(p => 
      selectedProducts?.includes(p?.id) ? { ...p, status } : p
    ));
    setSelectedProducts([]);
  };

  const handleBulkDelete = () => {
    setProducts(prev => prev?.filter(p => !selectedProducts?.includes(p?.id)));
    setSelectedProducts([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Sidebar */}
      <AdminSidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      {/* Main Content */}
      <div className={`transition-natural ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
        <header className="bg-card border-b border-border shadow-natural sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">
                  Product Management
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage your herbal cosmetics inventory
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Stats */}
                <div className="hidden lg:flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-foreground">{products?.length}</div>
                    <div className="text-muted-foreground">Total Products</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-success">
                      {products?.filter(p => p?.status === 'active')?.length}
                    </div>
                    <div className="text-muted-foreground">Active</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-warning">
                      {products?.filter(p => p?.stock <= 10 && p?.stock > 0)?.length}
                    </div>
                    <div className="text-muted-foreground">Low Stock</div>
                  </div>
                </div>

                {/* Actions */}
                <AdminNotificationCenter 
                  isOpen={isNotificationOpen}
                  onToggle={() => setIsNotificationOpen(!isNotificationOpen)}
                />
                
                <Button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsProductModalOpen(true);
                  }}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Add Product
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Filters */}
          <ProductFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Bulk Actions */}
          <BulkActionToolbar
            selectedCount={selectedProducts?.length}
            onBulkPriceUpdate={handleBulkPriceUpdate}
            onBulkCategoryChange={handleBulkCategoryChange}
            onBulkStatusChange={handleBulkStatusChange}
            onBulkDelete={handleBulkDelete}
            onClearSelection={handleClearSelection}
          />

          {/* Products Table */}
          <ProductTable
            products={paginatedProducts}
            selectedProducts={selectedProducts}
            onSelectProduct={handleSelectProduct}
            onSelectAll={handleSelectAll}
            onEditProduct={handleEditProduct}
            onDuplicateProduct={handleDuplicateProduct}
            onArchiveProduct={handleArchiveProduct}
            onQuickStockUpdate={handleQuickStockUpdate}
            sortConfig={sortConfig}
            onSort={handleSort}
          />

          {/* Pagination */}
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredAndSortedProducts?.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        </main>
      </div>
      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default AdminProductManagement;