import React from 'react';
import Icon from '../../../components/AppIcon';

const CheckoutProgress = ({ currentStep, onStepClick }) => {
  const steps = [
    { id: 1, name: 'Shipping', icon: 'Truck' },
    { id: 2, name: 'Payment', icon: 'CreditCard' },
    { id: 3, name: 'Review', icon: 'CheckCircle' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        {steps?.map((step, index) => (
          <React.Fragment key={step?.id}>
            <button
              onClick={() => onStepClick(step?.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-natural ${
                currentStep === step?.id
                  ? 'bg-primary text-primary-foreground'
                  : currentStep > step?.id
                  ? 'bg-success text-success-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <Icon 
                name={currentStep > step?.id ? 'Check' : step?.icon} 
                size={16} 
              />
              <span className="font-medium text-sm hidden sm:inline">
                {step?.name}
              </span>
            </button>
            {index < steps?.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${
                currentStep > step?.id ? 'bg-success' : 'bg-border'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CheckoutProgress;