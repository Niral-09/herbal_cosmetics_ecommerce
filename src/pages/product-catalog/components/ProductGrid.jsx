import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, isLoading, onQuickView, onAddToCart }) => {
  const LoadingSkeleton = () => (
    <div className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-square bg-muted"></div>
      <div className="p-4 space-y-3">
        <div className="h-3 bg-muted rounded w-1/3"></div>
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="flex items-center gap-1">
          <div className="h-3 bg-muted rounded w-20"></div>
          <div className="h-3 bg-muted rounded w-8"></div>
        </div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
        <div className="h-8 bg-muted rounded"></div>
      </div>
    </div>
  );

  if (isLoading && products?.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {Array.from({ length: 12 }, (_, index) => (
          <LoadingSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products?.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-12 h-12 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0H4"
            />
          </svg>
        </div>
        <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
          No products found
        </h3>
        <p className="text-muted-foreground mb-6">
          Try adjusting your filters or search terms to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {products?.map((product) => (
          <ProductCard
            key={product?.id}
            product={product}
            onQuickView={onQuickView}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
      {/* Loading More */}
      {isLoading && products?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {Array.from({ length: 4 }, (_, index) => (
            <LoadingSkeleton key={`loading-${index}`} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;