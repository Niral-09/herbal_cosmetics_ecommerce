import React from 'react';
import Icon from '../../../components/AppIcon';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  const footerSections = [
    {
      title: "Shop",
      links: [
        { name: "Hair Care", href: "/product-catalog?category=hair" },
        { name: "Skin Care", href: "/product-catalog?category=skin" },
        { name: "Hygiene", href: "/product-catalog?category=hygiene" },
        { name: "All Products", href: "/product-catalog" },
        { name: "New Arrivals", href: "/product-catalog?filter=new" },
        { name: "Best Sellers", href: "/product-catalog?filter=bestseller" }
      ]
    },
    {
      title: "Customer Care",
      links: [
        { name: "Contact Us", href: "#" },
        { name: "Shipping Info", href: "#" },
        { name: "Returns & Exchanges", href: "#" },
        { name: "Size Guide", href: "#" },
        { name: "FAQ", href: "#" },
        { name: "Track Your Order", href: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Our Story", href: "#" },
        { name: "Sustainability", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Press", href: "#" },
        { name: "Blog", href: "#" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Cookie Policy", href: "#" },
        { name: "Refund Policy", href: "#" },
        { name: "Accessibility", href: "#" }
      ]
    }
  ];

  const socialLinks = [
    { name: "Facebook", icon: "Facebook", href: "#", color: "hover:text-blue-600" },
    { name: "Instagram", icon: "Instagram", href: "#", color: "hover:text-pink-600" },
    { name: "Twitter", icon: "Twitter", href: "#", color: "hover:text-blue-400" },
    { name: "YouTube", icon: "Youtube", href: "#", color: "hover:text-red-600" },
    { name: "Pinterest", icon: "Pin", href: "#", color: "hover:text-red-500" }
  ];

  const certifications = [
    { name: "100% Natural", icon: "Leaf" },
    { name: "Cruelty Free", icon: "Heart" },
    { name: "Organic Certified", icon: "Award" },
    { name: "Eco Friendly", icon: "Recycle" }
  ];

  const handleLinkClick = (href) => {
    if (href !== '#') {
      window.location.href = href;
    }
  };

  return (
    <footer className="bg-foreground text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Leaf" size={24} color="white" />
              </div>
              <span className="font-heading font-bold text-2xl">HerbalCare</span>
            </div>
            
            <p className="text-white/80 mb-6 leading-relaxed">
              Discover the power of nature with our premium collection of herbal cosmetics. 
              Made with 100% natural ingredients for healthier, more radiant skin.
            </p>

            {/* Certifications */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {certifications?.map((cert, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Icon name={cert?.icon} size={16} className="text-success" />
                  <span className="text-sm text-white/80">{cert?.name}</span>
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-white/80">
              <div className="flex items-center space-x-2">
                <Icon name="Phone" size={16} />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Mail" size={16} />
                <span>support@herbalcare.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={16} />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections?.map((section, index) => (
            <div key={index} className="lg:col-span-1">
              <h3 className="font-heading font-semibold text-lg mb-4">{section?.title}</h3>
              <ul className="space-y-3">
                {section?.links?.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <button
                      onClick={() => handleLinkClick(link?.href)}
                      className="text-white/80 hover:text-white transition-natural text-sm"
                    >
                      {link?.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-white/20 pt-8 mt-12">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h3 className="font-heading font-semibold text-lg mb-2">Stay Updated</h3>
              <p className="text-white/80 text-sm">
                Subscribe to get special offers, free giveaways, and beauty tips.
              </p>
            </div>
            <div className="flex space-x-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-primary"
              />
              <button className="px-6 py-2 bg-primary hover:bg-primary/90 rounded-lg font-medium transition-natural">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Footer */}
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-white/80">
              © {currentYear} HerbalCare. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white/80 mr-2">Follow us:</span>
              {socialLinks?.map((social, index) => (
                <button
                  key={index}
                  onClick={() => handleLinkClick(social?.href)}
                  className={`w-8 h-8 bg-white/10 rounded-full flex items-center justify-center transition-natural ${social?.color}`}
                  title={social?.name}
                >
                  <Icon name={social?.icon} size={16} />
                </button>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-white/80">We accept:</span>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-5 bg-white/20 rounded flex items-center justify-center">
                  <Icon name="CreditCard" size={12} />
                </div>
                <div className="w-8 h-5 bg-white/20 rounded flex items-center justify-center">
                  <Icon name="Smartphone" size={12} />
                </div>
                <div className="w-8 h-5 bg-white/20 rounded flex items-center justify-center">
                  <Icon name="Wallet" size={12} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;