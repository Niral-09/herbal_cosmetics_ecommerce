import React, { useState, useEffect } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const TestimonialsCarousel = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Mumbai, India",
      rating: 5,
      text: `I've been using HerbalCare products for over 6 months now, and the transformation in my skin is incredible. The herbal face serum has completely eliminated my acne scars, and my skin feels so much healthier and radiant.`,
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      product: "Herbal Glow Face Serum",
      verified: true
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      location: "Delhi, India",
      rating: 5,
      text: `As someone with sensitive skin, finding the right products was always a challenge. HerbalCare's natural ingredients work perfectly for me. No irritation, just pure nourishment. Highly recommend to anyone looking for genuine herbal cosmetics.`,
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      product: "Organic Body Butter",
      verified: true
    },
    {
      id: 3,
      name: "Anita Patel",
      location: "Ahmedabad, India",
      rating: 5,
      text: `The hair growth oil is absolutely amazing! I was struggling with hair fall for years, and within 3 months of using this product, I can see significant improvement. My hair is thicker, stronger, and more lustrous than ever.`,
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      product: "Natural Hair Growth Oil",
      verified: true
    },
    {
      id: 4,
      name: "Vikram Singh",
      location: "Bangalore, India",
      rating: 4,
      text: `Great quality products with fast delivery. I bought the anti-aging cream for my wife, and she's been raving about it. The natural ingredients make such a difference compared to chemical-based products we used before.`,
      avatar: "https://randomuser.me/api/portraits/men/38.jpg",
      product: "Herbal Anti-Aging Cream",
      verified: true
    },
    {
      id: 5,
      name: "Meera Reddy",
      location: "Hyderabad, India",
      rating: 5,
      text: `I love everything about HerbalCare - from their eco-friendly packaging to the amazing results. The lip balm set is my favorite purchase. It keeps my lips soft and moisturized all day long, even in harsh weather.`,
      avatar: "https://randomuser.me/api/portraits/women/35.jpg",
      product: "Natural Lip Balm Set",
      verified: true
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials?.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials?.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials?.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials?.length) % testimonials?.length);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 })?.map((_, index) => (
      <Icon
        key={index}
        name="Star"
        size={16}
        className={index < rating ? "text-warning fill-current" : "text-muted-foreground"}
      />
    ));
  };

  const currentReview = testimonials?.[currentTestimonial];

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real experiences from real customers who love our herbal cosmetics
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-natural-lg">
            {/* Quote Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="Quote" size={32} className="text-primary" />
              </div>
            </div>

            {/* Rating */}
            <div className="flex justify-center items-center space-x-1 mb-6">
              {renderStars(currentReview?.rating)}
            </div>

            {/* Testimonial Text */}
            <blockquote className="text-center text-lg md:text-xl text-foreground leading-relaxed mb-8 font-medium">
              "{currentReview?.text}"
            </blockquote>

            {/* Customer Info */}
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Image
                    src={currentReview?.avatar}
                    alt={currentReview?.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  {currentReview?.verified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center">
                      <Icon name="Check" size={12} color="white" />
                    </div>
                  )}
                </div>
                <div className="text-center md:text-left">
                  <h4 className="font-heading font-semibold text-lg text-foreground">
                    {currentReview?.name}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {currentReview?.location}
                  </p>
                </div>
              </div>

              <div className="hidden md:block w-px h-12 bg-border"></div>

              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground mb-1">Purchased</p>
                <p className="font-medium text-foreground">{currentReview?.product}</p>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center hover:bg-muted transition-natural shadow-natural"
          >
            <Icon name="ChevronLeft" size={20} />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center hover:bg-muted transition-natural shadow-natural"
          >
            <Icon name="ChevronRight" size={20} />
          </button>
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          {testimonials?.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-natural ${
                currentTestimonial === index ? 'bg-primary' : 'bg-muted-foreground'
              }`}
            />
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">10,000+</div>
            <div className="text-sm text-muted-foreground">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">4.8/5</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">100%</div>
            <div className="text-sm text-muted-foreground">Natural Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">2+ Years</div>
            <div className="text-sm text-muted-foreground">Trusted Brand</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;