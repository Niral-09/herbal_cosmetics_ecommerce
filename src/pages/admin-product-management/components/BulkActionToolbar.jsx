import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActionToolbar = ({ 
  selectedCount, 
  onBulkPriceUpdate, 
  onBulkCategoryChange, 
  onBulkStatusChange, 
  onBulkDelete,
  onClearSelection 
}) => {
  const [showPriceUpdate, setShowPriceUpdate] = useState(false);
  const [showCategoryChange, setShowCategoryChange] = useState(false);
  const [priceUpdateValue, setPriceUpdateValue] = useState('');
  const [priceUpdateType, setPriceUpdateType] = useState('percentage'); // 'percentage' or 'fixed'
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    { value: 'hair-care', label: 'Hair Care' },
    { value: 'skin-care', label: 'Skin Care' },
    { value: 'hygiene', label: 'Hygiene' },
    { value: 'aromatherapy', label: 'Aromatherapy' },
    { value: 'supplements', label: 'Supplements' }
  ];

  const handlePriceUpdate = () => {
    if (priceUpdateValue && !isNaN(priceUpdateValue)) {
      onBulkPriceUpdate({
        type: priceUpdateType,
        value: parseFloat(priceUpdateValue)
      });
      setPriceUpdateValue('');
      setShowPriceUpdate(false);
    }
  };

  const handleCategoryChange = () => {
    if (selectedCategory) {
      onBulkCategoryChange(selectedCategory);
      setSelectedCategory('');
      setShowCategoryChange(false);
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedCount} selected products? This action cannot be undone.`)) {
      onBulkDelete();
    }
  };

  if (selectedCount === 0) return null;

  return (
    <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Selection Info */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-accent" />
            <span className="font-medium text-foreground">
              {selectedCount} product{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            iconName="X"
            iconPosition="left"
            className="text-muted-foreground hover:text-foreground"
          >
            Clear Selection
          </Button>
        </div>

        {/* Bulk Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Price Update */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPriceUpdate(!showPriceUpdate)}
              iconName="DollarSign"
              iconPosition="left"
            >
              Update Prices
            </Button>
            
            {showPriceUpdate && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-natural-lg z-50 p-4">
                <h4 className="font-medium text-popover-foreground mb-3">Bulk Price Update</h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-popover-foreground mb-1">
                      Update Type
                    </label>
                    <select
                      value={priceUpdateType}
                      onChange={(e) => setPriceUpdateType(e?.target?.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                    >
                      <option value="percentage">Percentage Change</option>
                      <option value="fixed">Fixed Amount Change</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-popover-foreground mb-1">
                      {priceUpdateType === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'}
                    </label>
                    <input
                      type="number"
                      value={priceUpdateValue}
                      onChange={(e) => setPriceUpdateValue(e?.target?.value)}
                      placeholder={priceUpdateType === 'percentage' ? '10' : '100'}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {priceUpdateType === 'percentage' ?'Use negative values to decrease prices' :'Use negative values to decrease prices'
                      }
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handlePriceUpdate}
                      disabled={!priceUpdateValue}
                    >
                      Apply
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPriceUpdate(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Category Change */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCategoryChange(!showCategoryChange)}
              iconName="Tag"
              iconPosition="left"
            >
              Change Category
            </Button>
            
            {showCategoryChange && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-natural-lg z-50 p-4">
                <h4 className="font-medium text-popover-foreground mb-3">Change Category</h4>
                
                <div className="space-y-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e?.target?.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {categories?.map(category => (
                      <option key={category?.value} value={category?.value}>
                        {category?.label}
                      </option>
                    ))}
                  </select>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleCategoryChange}
                      disabled={!selectedCategory}
                    >
                      Apply
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCategoryChange(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Status Change */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkStatusChange('active')}
            iconName="Eye"
            iconPosition="left"
          >
            Activate
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkStatusChange('inactive')}
            iconName="EyeOff"
            iconPosition="left"
          >
            Deactivate
          </Button>

          {/* Delete */}
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            iconName="Trash2"
            iconPosition="left"
          >
            Delete Selected
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionToolbar;