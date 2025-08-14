import React from 'react';
import Header from '../../components/ui/Header';
import HeroBanner from './components/HeroBanner';
import CategorySection from './components/CategorySection';
import FeaturedProducts from './components/FeaturedProducts';
import TestimonialsCarousel from './components/TestimonialsCarousel';
import NewsletterSection from './components/NewsletterSection';
import Footer from './components/Footer';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Banner */}
        <HeroBanner />
        
        {/* Category Section */}
        <CategorySection />
        
        {/* Featured Products */}
        <FeaturedProducts />
        
        {/* Customer Testimonials */}
        <TestimonialsCarousel />
        
        {/* Newsletter Signup */}
        <NewsletterSection />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Homepage;