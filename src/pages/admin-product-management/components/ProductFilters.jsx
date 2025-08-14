import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ProductFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  searchQuery, 
  onSearchChange 
}) => {
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'hair-care', label: 'Hair Care' },
    { value: 'skin-care', label: 'Skin Care' },
    { value: 'hygiene', label: 'Hygiene' },
    { value: 'aromatherapy', label: 'Aromatherapy' },
    { value: 'supplements', label: 'Supplements' }
  ];

  const brands = [
    { value: '', label: 'All Brands' },
    { value: 'herbal-essence', label: 'Herbal Essence' },
    { value: 'nature-care', label: 'Nature Care' },
    { value: 'organic-beauty', label: 'Organic Beauty' },
    { value: 'pure-herbs', label: 'Pure Herbs' },
    { value: 'green-life', label: 'Green Life' }
  ];

  const stockStatuses = [
    { value: '', label: 'All Stock Status' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low-stock', label: 'Low Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' }
  ];

  const productStatuses = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'draft', label: 'Draft' }
  ];

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '') || searchQuery !== '';

  return (
    <div className="bg-card rounded-lg border border-border shadow-natural p-6 mb-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Input
            type="search"
            placeholder="Search products, SKU, or brand..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e?.target?.value)}
            className="pl-10"
          />
          <Icon 
            name="Search" 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
        </div>
      </div>
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Category</label>
          <select
            value={filters?.category}
            onChange={(e) => onFilterChange('category', e?.target?.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            {categories?.map(category => (
              <option key={category?.value} value={category?.value}>
                {category?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Brand</label>
          <select
            value={filters?.brand}
            onChange={(e) => onFilterChange('brand', e?.target?.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            {brands?.map(brand => (
              <option key={brand?.value} value={brand?.value}>
                {brand?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Status Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Stock Status</label>
          <select
            value={filters?.stockStatus}
            onChange={(e) => onFilterChange('stockStatus', e?.target?.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            {stockStatuses?.map(status => (
              <option key={status?.value} value={status?.value}>
                {status?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Product Status Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Status</label>
          <select
            value={filters?.status}
            onChange={(e) => onFilterChange('status', e?.target?.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            {productStatuses?.map(status => (
              <option key={status?.value} value={status?.value}>
                {status?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Min Price (₹)</label>
          <input
            type="number"
            placeholder="0"
            value={filters?.minPrice}
            onChange={(e) => onFilterChange('minPrice', e?.target?.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Max Price (₹)</label>
          <input
            type="number"
            placeholder="10000"
            value={filters?.maxPrice}
            onChange={(e) => onFilterChange('maxPrice', e?.target?.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
            min="0"
          />
        </div>
      </div>
      {/* Filter Actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {hasActiveFilters && (
            <span className="flex items-center space-x-1">
              <Icon name="Filter" size={14} />
              <span>Filters applied</span>
            </span>
          )}
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
            className="text-muted-foreground hover:text-foreground"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;