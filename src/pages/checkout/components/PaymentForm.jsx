import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const PaymentForm = ({ onNext, onBack, formData, setFormData }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [saveCard, setSaveCard] = useState(false);

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: 'CreditCard',
      description: 'Visa, Mastercard, RuPay'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: 'Smartphone',
      description: 'PhonePe, Google Pay, Paytm'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: 'Building',
      description: 'All major banks supported'
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: 'Wallet',
      description: 'Paytm, Amazon Pay'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      payment: {
        ...formData?.payment,
        [field]: value
      }
    });
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    setFormData({
      ...formData,
      payment: {
        ...formData?.payment,
        method: paymentMethod
      }
    });
    onNext();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="CreditCard" size={20} className="text-primary" />
        <h2 className="font-heading font-semibold text-xl text-foreground">
          Payment Method
        </h2>
      </div>
      {/* Security Badge */}
      <div className="flex items-center space-x-2 mb-6 p-3 bg-success/10 border border-success/20 rounded-lg">
        <Icon name="Shield" size={16} className="text-success" />
        <span className="text-sm text-success font-medium">
          Your payment information is secure and encrypted
        </span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Method Selection */}
        <div>
          <h3 className="font-medium text-foreground mb-4">Select Payment Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {paymentMethods?.map((method) => (
              <button
                key={method?.id}
                type="button"
                onClick={() => setPaymentMethod(method?.id)}
                className={`p-4 rounded-lg border text-left transition-natural ${
                  paymentMethod === method?.id
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon name={method?.icon} size={20} className="text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{method?.name}</p>
                    <p className="text-xs text-muted-foreground">{method?.description}</p>
                  </div>
                  {paymentMethod === method?.id && (
                    <Icon name="Check" size={16} className="text-primary ml-auto" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Card Details Form */}
        {paymentMethod === 'card' && (
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-foreground">Card Details</h4>
            
            <Input
              label="Card Number"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={formData?.payment?.cardNumber || ''}
              onChange={(e) => handleInputChange('cardNumber', e?.target?.value)}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry Date"
                type="text"
                placeholder="MM/YY"
                value={formData?.payment?.expiryDate || ''}
                onChange={(e) => handleInputChange('expiryDate', e?.target?.value)}
                required
              />
              <Input
                label="CVV"
                type="text"
                placeholder="123"
                value={formData?.payment?.cvv || ''}
                onChange={(e) => handleInputChange('cvv', e?.target?.value)}
                required
              />
            </div>

            <Input
              label="Cardholder Name"
              type="text"
              placeholder="Name on card"
              value={formData?.payment?.cardholderName || ''}
              onChange={(e) => handleInputChange('cardholderName', e?.target?.value)}
              required
            />

            <Checkbox
              label="Save this card for future purchases"
              checked={saveCard}
              onChange={(e) => setSaveCard(e?.target?.checked)}
            />
          </div>
        )}

        {/* UPI Details */}
        {paymentMethod === 'upi' && (
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-foreground">UPI Details</h4>
            <Input
              label="UPI ID"
              type="text"
              placeholder="yourname@paytm"
              value={formData?.payment?.upiId || ''}
              onChange={(e) => handleInputChange('upiId', e?.target?.value)}
              required
            />
          </div>
        )}

        {/* Net Banking */}
        {paymentMethod === 'netbanking' && (
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-foreground">Select Your Bank</h4>
            <select
              className="w-full p-3 border border-border rounded-lg bg-input text-foreground"
              value={formData?.payment?.bank || ''}
              onChange={(e) => handleInputChange('bank', e?.target?.value)}
              required
            >
              <option value="">Choose your bank</option>
              <option value="sbi">State Bank of India</option>
              <option value="hdfc">HDFC Bank</option>
              <option value="icici">ICICI Bank</option>
              <option value="axis">Axis Bank</option>
              <option value="kotak">Kotak Mahindra Bank</option>
            </select>
          </div>
        )}

        {/* Wallet Selection */}
        {paymentMethod === 'wallet' && (
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-foreground">Select Wallet</h4>
            <div className="grid grid-cols-2 gap-3">
              {['Paytm', 'Amazon Pay', 'PhonePe', 'Google Pay']?.map((wallet) => (
                <button
                  key={wallet}
                  type="button"
                  onClick={() => handleInputChange('wallet', wallet)}
                  className={`p-3 rounded-lg border text-center transition-natural ${
                    formData?.payment?.wallet === wallet
                      ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                  }`}
                >
                  {wallet}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            iconName="ArrowLeft"
            iconPosition="left"
            className="w-full md:w-auto"
          >
            Back to Shipping
          </Button>
          <Button
            type="submit"
            variant="default"
            iconName="ArrowRight"
            iconPosition="right"
            className="w-full md:flex-1"
          >
            Review Order
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;