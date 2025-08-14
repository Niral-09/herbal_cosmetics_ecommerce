import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const SortDropdown = ({ currentSort, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: 'popularity', label: 'Most Popular', icon: 'TrendingUp' },
    { value: 'price-low', label: 'Price: Low to High', icon: 'ArrowUp' },
    { value: 'price-high', label: 'Price: High to Low', icon: 'ArrowDown' },
    { value: 'newest', label: 'Newest First', icon: 'Clock' },
    { value: 'rating', label: 'Highest Rated', icon: 'Star' },
    { value: 'name-az', label: 'Name: A to Z', icon: 'ArrowUp' },
    { value: 'name-za', label: 'Name: Z to A', icon: 'ArrowDown' }
  ];

  const currentOption = sortOptions?.find(option => option?.value === currentSort) || sortOptions?.[0];

  const handleSortSelect = (sortValue) => {
    onSortChange(sortValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:border-primary transition-natural min-w-48"
      >
        <Icon name={currentOption?.icon} size={16} color="currentColor" className="text-muted-foreground" />
        <span className="flex-1 text-left text-sm font-medium text-foreground">
          {currentOption?.label}
        </span>
        <Icon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          color="currentColor" 
          className="text-muted-foreground" 
        />
      </button>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 z-10 lg:hidden" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-natural-lg z-20 animate-scale-in">
            <div className="py-2">
              {sortOptions?.map((option) => (
                <button
                  key={option?.value}
                  onClick={() => handleSortSelect(option?.value)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-muted transition-natural ${
                    currentSort === option?.value 
                      ? 'bg-accent/10 text-accent' :'text-popover-foreground'
                  }`}
                >
                  <Icon 
                    name={option?.icon} 
                    size={16} 
                    color="currentColor" 
                    className={currentSort === option?.value ? 'text-accent' : 'text-muted-foreground'} 
                  />
                  <span className="text-sm font-medium">
                    {option?.label}
                  </span>
                  {currentSort === option?.value && (
                    <Icon name="Check" size={16} color="currentColor" className="ml-auto text-accent" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SortDropdown;