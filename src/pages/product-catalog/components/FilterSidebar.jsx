import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterSidebar = ({ isOpen, onClose, filters, onFiltersChange, isMobile = false }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    category: true,
    skinType: true,
    ingredients: true,
    brand: true
  });

  const categories = [
    { id: 'hair', label: 'Hair Care', count: 45 },
    { id: 'skin', label: 'Skin Care', count: 67 },
    { id: 'hygiene', label: 'Personal Hygiene', count: 23 },
    { id: 'makeup', label: 'Natural Makeup', count: 34 }
  ];

  const skinTypes = [
    { id: 'oily', label: 'Oily Skin', count: 28 },
    { id: 'dry', label: 'Dry Skin', count: 35 },
    { id: 'combination', label: 'Combination', count: 42 },
    { id: 'sensitive', label: 'Sensitive', count: 19 },
    { id: 'normal', label: 'Normal', count: 31 }
  ];

  const ingredients = [
    { id: 'aloe-vera', label: 'Aloe Vera', count: 23 },
    { id: 'turmeric', label: 'Turmeric', count: 18 },
    { id: 'neem', label: 'Neem', count: 15 },
    { id: 'coconut-oil', label: 'Coconut Oil', count: 27 },
    { id: 'tea-tree', label: 'Tea Tree', count: 21 }
  ];

  const brands = [
    { id: 'herbal-essence', label: 'Herbal Essence', count: 34 },
    { id: 'nature-care', label: 'Nature Care', count: 28 },
    { id: 'organic-beauty', label: 'Organic Beauty', count: 19 },
    { id: 'pure-herbs', label: 'Pure Herbs', count: 25 }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const handlePriceChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev?.priceRange,
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const handleCheckboxChange = (category, value, checked) => {
    setLocalFilters(prev => ({
      ...prev,
      [category]: checked
        ? [...(prev?.[category] || []), value]
        : (prev?.[category] || [])?.filter(item => item !== value)
    }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    if (isMobile) {
      onClose();
    }
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      priceRange: { min: 0, max: 5000 },
      categories: [],
      skinTypes: [],
      ingredients: [],
      brands: []
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters?.priceRange?.min > 0 || localFilters?.priceRange?.max < 5000) count++;
    count += (localFilters?.categories || [])?.length;
    count += (localFilters?.skinTypes || [])?.length;
    count += (localFilters?.ingredients || [])?.length;
    count += (localFilters?.brands || [])?.length;
    return count;
  };

  const FilterSection = ({ title, items, category, isExpanded, onToggle }) => (
    <div className="border-b border-border pb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <h3 className="font-medium text-foreground">{title}</h3>
        <Icon
          name={isExpanded ? "ChevronUp" : "ChevronDown"}
          size={16}
          color="currentColor"
          className="text-muted-foreground"
        />
      </button>
      
      {isExpanded && (
        <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
          {items?.map((item) => (
            <div key={item?.id} className="flex items-center justify-between">
              <Checkbox
                label={item?.label}
                checked={(localFilters?.[category] || [])?.includes(item?.id)}
                onChange={(e) => handleCheckboxChange(category, item?.id, e?.target?.checked)}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground ml-2">
                ({item?.count})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const sidebarContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-semibold text-lg text-foreground">
          Filters
        </h2>
        <div className="flex items-center gap-2">
          {getActiveFiltersCount() > 0 && (
            <span className="bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded-full">
              {getActiveFiltersCount()}
            </span>
          )}
          {isMobile && (
            <button
              onClick={onClose}
              className="p-1 text-muted-foreground hover:text-foreground transition-natural"
            >
              <Icon name="X" size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Price Range */}
      <div className="border-b border-border pb-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full py-2 text-left"
        >
          <h3 className="font-medium text-foreground">Price Range</h3>
          <Icon
            name={expandedSections?.price ? "ChevronUp" : "ChevronDown"}
            size={16}
            color="currentColor"
            className="text-muted-foreground"
          />
        </button>
        
        {expandedSections?.price && (
          <div className="mt-3 space-y-3">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={localFilters?.priceRange?.min}
                onChange={(e) => handlePriceChange('min', e?.target?.value)}
                className="flex-1"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={localFilters?.priceRange?.max}
                onChange={(e) => handlePriceChange('max', e?.target?.value)}
                className="flex-1"
              />
            </div>
            <div className="text-xs text-muted-foreground">
              ₹{localFilters?.priceRange?.min} - ₹{localFilters?.priceRange?.max}
            </div>
          </div>
        )}
      </div>

      {/* Categories */}
      <FilterSection
        title="Categories"
        items={categories}
        category="categories"
        isExpanded={expandedSections?.category}
        onToggle={() => toggleSection('category')}
      />

      {/* Skin Type */}
      <FilterSection
        title="Skin Type"
        items={skinTypes}
        category="skinTypes"
        isExpanded={expandedSections?.skinType}
        onToggle={() => toggleSection('skinType')}
      />

      {/* Ingredients */}
      <FilterSection
        title="Key Ingredients"
        items={ingredients}
        category="ingredients"
        isExpanded={expandedSections?.ingredients}
        onToggle={() => toggleSection('ingredients')}
      />

      {/* Brands */}
      <FilterSection
        title="Brands"
        items={brands}
        category="brands"
        isExpanded={expandedSections?.brand}
        onToggle={() => toggleSection('brand')}
      />

      {/* Action Buttons */}
      {isMobile && (
        <div className="sticky bottom-0 bg-card border-t border-border pt-4 space-y-2">
          <Button
            variant="default"
            fullWidth
            onClick={handleApplyFilters}
          >
            Apply Filters ({getActiveFiltersCount()})
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={handleClearFilters}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-card border-l border-border shadow-natural-lg">
              <div className="h-full overflow-y-auto p-6">
                {sidebarContent}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div className="w-80 bg-card border border-border rounded-lg p-6 h-fit sticky top-20">
      {sidebarContent}
    </div>
  );
};

export default FilterSidebar;