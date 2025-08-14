import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ShippingForm = ({ onNext, formData, setFormData }) => {
  const [savedAddresses] = useState([
    {
      id: 1,
      name: "Home",
      fullName: "Priya Sharma",
      address: "123 Green Valley Apartments",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      phone: "+91 9876543210"
    },
    {
      id: 2,
      name: "Office",
      fullName: "Priya Sharma",
      address: "456 Business Park, Andheri East",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400069",
      phone: "+91 9876543210"
    }
  ]);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddress, setShowNewAddress] = useState(false);

  const stateOptions = [
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'tamil-nadu', label: 'Tamil Nadu' },
    { value: 'gujarat', label: 'Gujarat' }
  ];

  const handleAddressSelect = (address) => {
    setSelectedAddress(address?.id);
    setFormData({
      ...formData,
      shipping: {
        fullName: address?.fullName,
        address: address?.address,
        city: address?.city,
        state: address?.state,
        pincode: address?.pincode,
        phone: address?.phone
      }
    });
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      shipping: {
        ...formData?.shipping,
        [field]: value
      }
    });
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    onNext();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Truck" size={20} className="text-primary" />
        <h2 className="font-heading font-semibold text-xl text-foreground">
          Shipping Information
        </h2>
      </div>
      {/* Saved Addresses */}
      {savedAddresses?.length > 0 && !showNewAddress && (
        <div className="mb-6">
          <h3 className="font-medium text-foreground mb-4">Choose saved address</h3>
          <div className="space-y-3">
            {savedAddresses?.map((address) => (
              <button
                key={address?.id}
                onClick={() => handleAddressSelect(address)}
                className={`w-full text-left p-4 rounded-lg border transition-natural ${
                  selectedAddress === address?.id
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-foreground">{address?.name}</span>
                      {selectedAddress === address?.id && (
                        <Icon name="Check" size={16} className="text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-foreground">{address?.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {address?.address}, {address?.city}, {address?.state} - {address?.pincode}
                    </p>
                    <p className="text-sm text-muted-foreground">{address?.phone}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowNewAddress(true)}
            iconName="Plus"
            iconPosition="left"
            className="mt-4"
          >
            Add New Address
          </Button>
        </div>
      )}
      {/* New Address Form */}
      {(showNewAddress || savedAddresses?.length === 0) && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={formData?.shipping?.fullName || ''}
              onChange={(e) => handleInputChange('fullName', e?.target?.value)}
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+91 9876543210"
              value={formData?.shipping?.phone || ''}
              onChange={(e) => handleInputChange('phone', e?.target?.value)}
              required
            />
          </div>

          <Input
            label="Address"
            type="text"
            placeholder="House no, Building name, Street"
            value={formData?.shipping?.address || ''}
            onChange={(e) => handleInputChange('address', e?.target?.value)}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="City"
              type="text"
              placeholder="Enter city"
              value={formData?.shipping?.city || ''}
              onChange={(e) => handleInputChange('city', e?.target?.value)}
              required
            />
            <Select
              label="State"
              placeholder="Select state"
              options={stateOptions}
              value={formData?.shipping?.state || ''}
              onChange={(value) => handleInputChange('state', value)}
              required
            />
            <Input
              label="PIN Code"
              type="text"
              placeholder="400001"
              value={formData?.shipping?.pincode || ''}
              onChange={(e) => handleInputChange('pincode', e?.target?.value)}
              required
            />
          </div>

          {showNewAddress && (
            <Button
              variant="outline"
              onClick={() => setShowNewAddress(false)}
              iconName="ArrowLeft"
              iconPosition="left"
              className="mr-4"
            >
              Back to Saved Addresses
            </Button>
          )}

          <Button
            type="submit"
            variant="default"
            iconName="ArrowRight"
            iconPosition="right"
            className="w-full md:w-auto"
          >
            Continue to Payment
          </Button>
        </form>
      )}
      {/* Continue with Selected Address */}
      {selectedAddress && !showNewAddress && (
        <Button
          onClick={onNext}
          variant="default"
          iconName="ArrowRight"
          iconPosition="right"
          className="w-full md:w-auto"
        >
          Continue to Payment
        </Button>
      )}
    </div>
  );
};

export default ShippingForm;