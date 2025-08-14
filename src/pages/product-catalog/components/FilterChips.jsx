import React from 'react';
import Icon from '../../../components/AppIcon';

const FilterChips = ({ activeFilters, onRemoveFilter, onClearAll }) => {
  const getFilterChips = () => {
    const chips = [];

    // Price range chip
    if (activeFilters?.priceRange?.min > 0 || activeFilters?.priceRange?.max < 5000) {
      chips?.push({
        id: 'price',
        label: `₹${activeFilters?.priceRange?.min} - ₹${activeFilters?.priceRange?.max}`,
        type: 'priceRange'
      });
    }

    // Category chips
    (activeFilters?.categories || [])?.forEach(category => {
      const categoryLabels = {
        'hair': 'Hair Care',
        'skin': 'Skin Care',
        'hygiene': 'Personal Hygiene',
        'makeup': 'Natural Makeup'
      };
      chips?.push({
        id: category,
        label: categoryLabels?.[category] || category,
        type: 'categories'
      });
    });

    // Skin type chips
    (activeFilters?.skinTypes || [])?.forEach(skinType => {
      const skinTypeLabels = {
        'oily': 'Oily Skin',
        'dry': 'Dry Skin',
        'combination': 'Combination',
        'sensitive': 'Sensitive',
        'normal': 'Normal'
      };
      chips?.push({
        id: skinType,
        label: skinTypeLabels?.[skinType] || skinType,
        type: 'skinTypes'
      });
    });

    // Ingredient chips
    (activeFilters?.ingredients || [])?.forEach(ingredient => {
      const ingredientLabels = {
        'aloe-vera': 'Aloe Vera',
        'turmeric': 'Turmeric',
        'neem': 'Neem',
        'coconut-oil': 'Coconut Oil',
        'tea-tree': 'Tea Tree'
      };
      chips?.push({
        id: ingredient,
        label: ingredientLabels?.[ingredient] || ingredient,
        type: 'ingredients'
      });
    });

    // Brand chips
    (activeFilters?.brands || [])?.forEach(brand => {
      const brandLabels = {
        'herbal-essence': 'Herbal Essence',
        'nature-care': 'Nature Care',
        'organic-beauty': 'Organic Beauty',
        'pure-herbs': 'Pure Herbs'
      };
      chips?.push({
        id: brand,
        label: brandLabels?.[brand] || brand,
        type: 'brands'
      });
    });

    return chips;
  };

  const chips = getFilterChips();

  if (chips?.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground font-medium">
        Active filters:
      </span>
      {chips?.map((chip) => (
        <div
          key={`${chip?.type}-${chip?.id}`}
          className="inline-flex items-center gap-1 bg-accent/10 text-accent border border-accent/20 rounded-full px-3 py-1 text-sm"
        >
          <span>{chip?.label}</span>
          <button
            onClick={() => onRemoveFilter(chip?.type, chip?.id)}
            className="hover:bg-accent/20 rounded-full p-0.5 transition-natural"
          >
            <Icon name="X" size={12} />
          </button>
        </div>
      ))}
      {chips?.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-sm text-muted-foreground hover:text-foreground underline transition-natural"
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export default FilterChips;