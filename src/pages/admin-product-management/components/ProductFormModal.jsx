import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Image from '../../../components/AppImage';

const ProductFormModal = ({ 
  isOpen, 
  onClose, 
  product = null, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    sku: '',
    category: '',
    price: '',
    comparePrice: '',
    stock: '',
    description: '',
    shortDescription: '',
    ingredients: '',
    usage: '',
    benefits: '',
    status: 'active',
    images: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const categories = [
    { value: 'hair-care', label: 'Hair Care' },
    { value: 'skin-care', label: 'Skin Care' },
    { value: 'hygiene', label: 'Hygiene' },
    { value: 'aromatherapy', label: 'Aromatherapy' },
    { value: 'supplements', label: 'Supplements' }
  ];

  const brands = [
    { value: 'herbal-essence', label: 'Herbal Essence' },
    { value: 'nature-care', label: 'Nature Care' },
    { value: 'organic-beauty', label: 'Organic Beauty' },
    { value: 'pure-herbs', label: 'Pure Herbs' },
    { value: 'green-life', label: 'Green Life' }
  ];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product?.name || '',
        brand: product?.brand || '',
        sku: product?.sku || '',
        category: product?.category || '',
        price: product?.price?.toString() || '',
        comparePrice: product?.comparePrice?.toString() || '',
        stock: product?.stock?.toString() || '',
        description: product?.description || '',
        shortDescription: product?.shortDescription || '',
        ingredients: product?.ingredients || '',
        usage: product?.usage || '',
        benefits: product?.benefits || '',
        status: product?.status || 'active',
        images: product?.images || []
      });
    } else {
      // Reset form for new product
      setFormData({
        name: '',
        brand: '',
        sku: '',
        category: '',
        price: '',
        comparePrice: '',
        stock: '',
        description: '',
        shortDescription: '',
        ingredients: '',
        usage: '',
        benefits: '',
        status: 'active',
        images: []
      });
    }
    setErrors({});
    setActiveTab('basic');
  }, [product, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.name?.trim()) newErrors.name = 'Product name is required';
    if (!formData?.brand) newErrors.brand = 'Brand is required';
    if (!formData?.sku?.trim()) newErrors.sku = 'SKU is required';
    if (!formData?.category) newErrors.category = 'Category is required';
    if (!formData?.price || isNaN(formData?.price) || parseFloat(formData?.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData?.stock || isNaN(formData?.stock) || parseInt(formData?.stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }
    if (!formData?.shortDescription?.trim()) {
      newErrors.shortDescription = 'Short description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData?.price),
        comparePrice: formData?.comparePrice ? parseFloat(formData?.comparePrice) : null,
        stock: parseInt(formData?.stock),
        id: product?.id || Date.now()
      };
      
      await onSave(productData);
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e?.target?.files);
    // In a real app, you would upload these files to a server
    // For now, we'll just create mock URLs
    const newImages = files?.map((file, index) => ({
      id: Date.now() + index,
      url: URL.createObjectURL(file),
      name: file?.name
    }));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev?.images, ...newImages]
    }));
  };

  const removeImage = (imageId) => {
    setFormData(prev => ({
      ...prev,
      images: prev?.images?.filter(img => img?.id !== imageId)
    }));
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: 'Info' },
    { id: 'details', label: 'Details', icon: 'FileText' },
    { id: 'images', label: 'Images', icon: 'Image' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={onClose}></div>

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-card shadow-natural-lg rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-heading font-semibold text-foreground">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              iconName="X"
            />
          </div>

          {/* Tabs */}
          <div className="border-b border-border">
            <nav className="flex space-x-8 px-6">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-natural ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 max-h-96 overflow-y-auto">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Product Name"
                      type="text"
                      value={formData?.name}
                      onChange={(e) => handleInputChange('name', e?.target?.value)}
                      error={errors?.name}
                      required
                      placeholder="Enter product name"
                    />

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Brand <span className="text-error">*</span>
                      </label>
                      <select
                        value={formData?.brand}
                        onChange={(e) => handleInputChange('brand', e?.target?.value)}
                        className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent ${
                          errors?.brand ? 'border-error' : 'border-border'
                        }`}
                        required
                      >
                        <option value="">Select Brand</option>
                        {brands?.map(brand => (
                          <option key={brand?.value} value={brand?.value}>
                            {brand?.label}
                          </option>
                        ))}
                      </select>
                      {errors?.brand && (
                        <p className="mt-1 text-sm text-error">{errors?.brand}</p>
                      )}
                    </div>

                    <Input
                      label="SKU"
                      type="text"
                      value={formData?.sku}
                      onChange={(e) => handleInputChange('sku', e?.target?.value)}
                      error={errors?.sku}
                      required
                      placeholder="Enter SKU"
                    />

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Category <span className="text-error">*</span>
                      </label>
                      <select
                        value={formData?.category}
                        onChange={(e) => handleInputChange('category', e?.target?.value)}
                        className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent ${
                          errors?.category ? 'border-error' : 'border-border'
                        }`}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories?.map(category => (
                          <option key={category?.value} value={category?.value}>
                            {category?.label}
                          </option>
                        ))}
                      </select>
                      {errors?.category && (
                        <p className="mt-1 text-sm text-error">{errors?.category}</p>
                      )}
                    </div>

                    <Input
                      label="Price (₹)"
                      type="number"
                      value={formData?.price}
                      onChange={(e) => handleInputChange('price', e?.target?.value)}
                      error={errors?.price}
                      required
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />

                    <Input
                      label="Compare Price (₹)"
                      type="number"
                      value={formData?.comparePrice}
                      onChange={(e) => handleInputChange('comparePrice', e?.target?.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      description="Original price for discount display"
                    />

                    <Input
                      label="Stock Quantity"
                      type="number"
                      value={formData?.stock}
                      onChange={(e) => handleInputChange('stock', e?.target?.value)}
                      error={errors?.stock}
                      required
                      placeholder="0"
                      min="0"
                    />

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Status
                      </label>
                      <select
                        value={formData?.status}
                        onChange={(e) => handleInputChange('status', e?.target?.value)}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Short Description <span className="text-error">*</span>
                    </label>
                    <textarea
                      value={formData?.shortDescription}
                      onChange={(e) => handleInputChange('shortDescription', e?.target?.value)}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent resize-none ${
                        errors?.shortDescription ? 'border-error' : 'border-border'
                      }`}
                      placeholder="Brief product description for listings"
                      required
                    />
                    {errors?.shortDescription && (
                      <p className="mt-1 text-sm text-error">{errors?.shortDescription}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Details Tab */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Detailed Description
                    </label>
                    <textarea
                      value={formData?.description}
                      onChange={(e) => handleInputChange('description', e?.target?.value)}
                      rows={6}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                      placeholder="Detailed product description with features and benefits"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Ingredients
                    </label>
                    <textarea
                      value={formData?.ingredients}
                      onChange={(e) => handleInputChange('ingredients', e?.target?.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                      placeholder="List all ingredients used in the product"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Usage Instructions
                    </label>
                    <textarea
                      value={formData?.usage}
                      onChange={(e) => handleInputChange('usage', e?.target?.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                      placeholder="How to use this product effectively"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Benefits
                    </label>
                    <textarea
                      value={formData?.benefits}
                      onChange={(e) => handleInputChange('benefits', e?.target?.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                      placeholder="Key benefits and advantages of using this product"
                    />
                  </div>
                </div>
              )}

              {/* Images Tab */}
              {activeTab === 'images' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Product Images
                    </label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center space-y-2"
                      >
                        <Icon name="Upload" size={32} className="text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Click to upload images or drag and drop
                        </span>
                        <span className="text-xs text-muted-foreground">
                          PNG, JPG, GIF up to 10MB each
                        </span>
                      </label>
                    </div>
                  </div>

                  {formData?.images?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Uploaded Images</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData?.images?.map((image, index) => (
                          <div key={image?.id || index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                              <Image
                                src={image?.url || image}
                                alt={`Product image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(image?.id || index)}
                              className="absolute top-2 right-2 bg-error text-error-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-natural"
                            >
                              <Icon name="X" size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                iconName="Save"
                iconPosition="left"
              >
                {product ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductFormModal;