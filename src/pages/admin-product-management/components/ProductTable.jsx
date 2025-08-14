import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProductTable = ({ 
  products, 
  selectedProducts, 
  onSelectProduct, 
  onSelectAll, 
  onEditProduct, 
  onDuplicateProduct, 
  onArchiveProduct, 
  onQuickStockUpdate,
  sortConfig,
  onSort 
}) => {
  const [stockUpdateValues, setStockUpdateValues] = useState({});

  const handleStockUpdate = (productId, newStock) => {
    if (newStock >= 0) {
      onQuickStockUpdate(productId, newStock);
      setStockUpdateValues(prev => ({ ...prev, [productId]: '' }));
    }
  };

  const handleStockInputChange = (productId, value) => {
    setStockUpdateValues(prev => ({ ...prev, [productId]: value }));
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'text-error bg-error/10' };
    if (stock <= 10) return { label: 'Low Stock', color: 'text-warning bg-warning/10' };
    return { label: 'In Stock', color: 'text-success bg-success/10' };
  };

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    })?.format(price);
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-natural overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="w-12 p-4">
                <input
                  type="checkbox"
                  checked={selectedProducts?.length === products?.length && products?.length > 0}
                  onChange={onSelectAll}
                  className="rounded border-border"
                />
              </th>
              <th className="text-left p-4 font-medium text-foreground">Product</th>
              {['sku', 'category', 'price', 'stock', 'status']?.map((column) => (
                <th key={column} className="text-left p-4 font-medium text-foreground">
                  <button
                    onClick={() => onSort(column)}
                    className="flex items-center space-x-1 hover:text-primary transition-natural"
                  >
                    <span className="capitalize">{column === 'sku' ? 'SKU' : column}</span>
                    <Icon name={getSortIcon(column)} size={14} />
                  </button>
                </th>
              ))}
              <th className="text-right p-4 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products?.map((product) => {
              const stockStatus = getStockStatus(product?.stock);
              return (
                <tr key={product?.id} className="hover:bg-muted/50 transition-natural">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts?.includes(product?.id)}
                      onChange={() => onSelectProduct(product?.id)}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={product?.image}
                          alt={product?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{product?.name}</h3>
                        <p className="text-sm text-muted-foreground">{product?.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground font-mono text-sm">{product?.sku}</td>
                  <td className="p-4 text-muted-foreground">{product?.category}</td>
                  <td className="p-4 font-medium text-foreground">{formatPrice(product?.price)}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={stockUpdateValues?.[product?.id] || product?.stock}
                        onChange={(e) => handleStockInputChange(product?.id, e?.target?.value)}
                        onBlur={(e) => {
                          const newValue = parseInt(e?.target?.value);
                          if (newValue !== product?.stock && !isNaN(newValue)) {
                            handleStockUpdate(product?.id, newValue);
                          }
                        }}
                        className="w-16 px-2 py-1 text-sm border border-border rounded focus:ring-2 focus:ring-ring focus:border-transparent"
                        min="0"
                      />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus?.color}`}>
                        {stockStatus?.label}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product?.status === 'active' ?'text-success bg-success/10' :'text-muted-foreground bg-muted'
                    }`}>
                      {product?.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditProduct(product)}
                        iconName="Edit"
                        className="h-8 w-8"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDuplicateProduct(product)}
                        iconName="Copy"
                        className="h-8 w-8"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onArchiveProduct(product?.id)}
                        iconName="Archive"
                        className="h-8 w-8 text-muted-foreground hover:text-warning"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-border">
        {products?.map((product) => {
          const stockStatus = getStockStatus(product?.stock);
          return (
            <div key={product?.id} className="p-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={selectedProducts?.includes(product?.id)}
                  onChange={() => onSelectProduct(product?.id)}
                  className="mt-1 rounded border-border"
                />
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={product?.image}
                    alt={product?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-foreground truncate">{product?.name}</h3>
                      <p className="text-sm text-muted-foreground">{product?.brand}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product?.status === 'active' ?'text-success bg-success/10' :'text-muted-foreground bg-muted'
                    }`}>
                      {product?.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">SKU:</span>
                      <span className="ml-1 font-mono">{product?.sku}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Category:</span>
                      <span className="ml-1">{product?.category}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Price:</span>
                      <span className="ml-1 font-medium">{formatPrice(product?.price)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Stock:</span>
                      <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${stockStatus?.color}`}>
                        {product?.stock} - {stockStatus?.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <input
                        type="number"
                        value={stockUpdateValues?.[product?.id] || product?.stock}
                        onChange={(e) => handleStockInputChange(product?.id, e?.target?.value)}
                        onBlur={(e) => {
                          const newValue = parseInt(e?.target?.value);
                          if (newValue !== product?.stock && !isNaN(newValue)) {
                            handleStockUpdate(product?.id, newValue);
                          }
                        }}
                        className="w-16 px-2 py-1 text-sm border border-border rounded focus:ring-2 focus:ring-ring focus:border-transparent"
                        min="0"
                      />
                      <span className="text-xs text-muted-foreground">units</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditProduct(product)}
                        iconName="Edit"
                        className="h-8 w-8"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDuplicateProduct(product)}
                        iconName="Copy"
                        className="h-8 w-8"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onArchiveProduct(product?.id)}
                        iconName="Archive"
                        className="h-8 w-8 text-muted-foreground hover:text-warning"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductTable;