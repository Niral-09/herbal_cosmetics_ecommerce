import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const benefits = [
    {
      icon: "Gift",
      title: "Exclusive Offers",
      description: "Get 20% off on your first order and access to member-only deals"
    },
    {
      icon: "Zap",
      title: "Early Access",
      description: "Be the first to know about new product launches and collections"
    },
    {
      icon: "BookOpen",
      title: "Beauty Tips",
      description: "Receive weekly skincare tips and natural beauty advice from experts"
    },
    {
      icon: "Heart",
      title: "Personalized Care",
      description: "Get product recommendations based on your skin type and preferences"
    }
  ];

  const handleSubscribe = async (e) => {
    e?.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!email?.includes('@') || !email?.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      setEmail('');
    }, 1500);
  };

  if (isSubscribed) {
    return (
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12">
            <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="CheckCircle" size={40} color="white" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-white mb-4">
              Welcome to Our Community!
            </h2>
            <p className="text-xl text-white/90 mb-6">
              Thank you for subscribing! Check your inbox for a special welcome offer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="default"
                onClick={() => window.location.href = '/product-catalog'}
                className="bg-white text-primary hover:bg-white/90"
              >
                Start Shopping
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsSubscribed(false)}
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                Subscribe Another Email
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-r from-primary to-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-6">
              Join Our Natural Beauty Community
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Subscribe to our newsletter and unlock exclusive benefits, beauty tips, and special offers on our premium herbal cosmetics collection.
            </p>

            {/* Benefits Grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {benefits?.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Icon name={benefit?.icon} size={16} color="white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{benefit?.title}</h3>
                    <p className="text-sm text-white/80">{benefit?.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 text-white/80">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} />
                <span className="text-sm">No Spam</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Lock" size={16} />
                <span className="text-sm">Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={16} />
                <span className="text-sm">10K+ Subscribers</span>
              </div>
            </div>
          </div>

          {/* Newsletter Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Mail" size={32} color="white" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-2">
                Get 20% Off Your First Order
              </h3>
              <p className="text-white/90">
                Plus exclusive access to new products and beauty tips
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e?.target?.value)}
                error={error}
                className="bg-white/20 border-white/30 text-white placeholder-white/70"
              />
              
              <Button
                type="submit"
                variant="default"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
                className="bg-accent hover:bg-accent/90 text-white font-semibold py-4"
              >
                {isLoading ? 'Subscribing...' : 'Subscribe & Get 20% Off'}
              </Button>
            </form>

            <p className="text-xs text-white/70 text-center mt-4">
              By subscribing, you agree to our{' '}
              <button className="underline hover:no-underline">Privacy Policy</button>
              {' '}and{' '}
              <button className="underline hover:no-underline">Terms of Service</button>
            </p>

            {/* Social Proof */}
            <div className="flex items-center justify-center space-x-4 mt-6 pt-6 border-t border-white/20">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4]?.map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-white/30 rounded-full border-2 border-white flex items-center justify-center"
                  >
                    <Icon name="User" size={14} color="white" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/80">
                Join 10,000+ happy subscribers
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;