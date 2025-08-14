import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const QuickViewModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !product) return null;

  const handleAddToCart = async () => {
    setIsLoading(true);
    await onAddToCart({
      ...product,
      variant: product?.variants?.[selectedVariant],
      quantity
    });
    setIsLoading(false);
    onClose();
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={16}
        color={index < Math.floor(rating) ? "#F59E0B" : "#E5E7EB"}
        className={index < Math.floor(rating) ? "fill-current" : ""}
      />
    ));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg shadow-natural-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-natural"
        >
          <Icon name="X" size={16} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 max-h-[90vh] overflow-y-auto">
          {/* Product Image */}
          <div className="relative aspect-square lg:aspect-auto">
            <Image
              src={product?.image}
              alt={product?.name}
              className="w-full h-full object-cover"
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product?.isNew && (
                <span className="bg-success text-success-foreground text-xs font-medium px-2 py-1 rounded-full">
                  New
                </span>
              )}
              {product?.discount && (
                <span className="bg-error text-error-foreground text-xs font-medium px-2 py-1 rounded-full">
                  -{product?.discount}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="p-6 lg:p-8 space-y-6">
            {/* Category & Name */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">{product?.category}</p>
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-3">
                {product?.name}
              </h2>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {renderStars(product?.rating)}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product?.rating} ({product?.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="font-heading font-bold text-3xl text-foreground">
                ₹{product?.variants ? product?.variants?.[selectedVariant]?.price?.toFixed(2) : product?.price?.toFixed(2)}
              </span>
              {product?.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ₹{product?.originalPrice?.toFixed(2)}
                </span>
              )}
              {product?.discount && (
                <span className="bg-error/10 text-error text-sm font-medium px-2 py-1 rounded">
                  Save ₹{(product?.originalPrice - product?.price)?.toFixed(2)}
                </span>
              )}
            </div>

            {/* Variants */}
            {product?.variants && (
              <div>
                <h3 className="font-medium text-foreground mb-3">Size:</h3>
                <div className="flex gap-2">
                  {product?.variants?.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVariant(index)}
                      className={`px-4 py-2 rounded-lg border transition-natural ${
                        selectedVariant === index
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      {variant?.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="font-medium text-foreground mb-2">Description:</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {product?.description}
              </p>
            </div>

            {/* Key Benefits */}
            {product?.benefits && (
              <div>
                <h3 className="font-medium text-foreground mb-2">Key Benefits:</h3>
                <ul className="space-y-1">
                  {product?.benefits?.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Check" size={14} color="#22C55E" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground mb-2">Quantity:</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-lg border border-border hover:border-primary flex items-center justify-center transition-natural disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon name="Minus" size={16} />
                  </button>
                  <span className="font-medium text-lg w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                    className="w-10 h-10 rounded-lg border border-border hover:border-primary flex items-center justify-center transition-natural disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon name="Plus" size={16} />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="default"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  onClick={handleAddToCart}
                  iconName="ShoppingCart"
                  iconPosition="left"
                >
                  Add to Cart - ₹{((product?.variants ? product?.variants?.[selectedVariant]?.price : product?.price) * quantity)?.toFixed(2)}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  iconName="Heart"
                  iconPosition="left"
                >
                  Wishlist
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="Truck" size={16} />
                <span>Free shipping on orders over ₹500</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="RotateCcw" size={16} />
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="Shield" size={16} />
                <span>100% authentic products</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;