import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProductCard = ({ product, onQuickView, onAddToCart }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    await onAddToCart(product);
    setIsLoading(false);
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={14}
        color={index < Math.floor(rating) ? "#F59E0B" : "#E5E7EB"}
        className={index < Math.floor(rating) ? "fill-current" : ""}
      />
    ));
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-natural hover:shadow-natural-lg transition-natural group">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <Image
          src={product?.image}
          alt={product?.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-natural-slow"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product?.isNew && (
            <span className="bg-success text-success-foreground text-xs font-medium px-2 py-1 rounded-full">
              New
            </span>
          )}
          {product?.discount && (
            <span className="bg-error text-error-foreground text-xs font-medium px-2 py-1 rounded-full">
              -{product?.discount}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 w-8 h-8 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-natural hover:bg-card"
        >
          <Icon
            name="Heart"
            size={16}
            color={isWishlisted ? "#EF4444" : "currentColor"}
            className={isWishlisted ? "fill-current text-error" : "text-muted-foreground"}
          />
        </button>

        {/* Quick View Button */}
        <button
          onClick={() => onQuickView(product)}
          className="absolute inset-x-2 bottom-2 bg-primary text-primary-foreground py-2 rounded-md opacity-0 group-hover:opacity-100 transition-natural hover:bg-primary/90 text-sm font-medium"
        >
          Quick View
        </button>
      </div>
      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-muted-foreground mb-1">{product?.category}</p>
        
        {/* Product Name */}
        <h3 className="font-medium text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-natural">
          {product?.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5">
            {renderStars(product?.rating)}
          </div>
          <span className="text-xs text-muted-foreground ml-1">
            ({product?.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-heading font-semibold text-lg text-foreground">
            ₹{product?.price?.toFixed(2)}
          </span>
          {product?.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{product?.originalPrice?.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          variant="default"
          size="sm"
          fullWidth
          loading={isLoading}
          onClick={handleAddToCart}
          iconName="ShoppingCart"
          iconPosition="left"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;