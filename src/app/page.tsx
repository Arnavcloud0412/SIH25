'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  TreePine, 
  Brain, 
  Satellite, 
  MapPin, 
  Settings, 
  ChevronDown, 
  ChevronUp,
  Menu,
  X,
  ArrowRight,
  Users,
  FileText,
  BarChart3,
  Globe,
  Twitter,
  Facebook,
  Instagram,
  Mail,
  Phone,
  Map
} from 'lucide-react';

export default function LandingPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const heroImages = [
    '/images1.jpeg',
    '/image2.jpg', 
    '/image3.jpg',
    '/image4.jpg'
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Digitization',
      description: 'Transform legacy FRA documents into structured digital records using advanced OCR and NER technologies for efficient data extraction and management.'
    },
    {
      icon: MapPin,
      title: 'The Living FRA Atlas',
      description: 'Interactive WebGIS platform providing real-time visualization of FRA claims, forest areas, and tribal communities across India with dynamic mapping capabilities.'
    },
    {
      icon: Satellite,
      title: 'Satellite-to-Asset Mapping',
      description: 'Leverage high-resolution satellite imagery and AI classification to map forest assets, land use patterns, and environmental changes for comprehensive monitoring.'
    },
    {
      icon: Settings,
      title: 'Intelligent Scheme Delivery',
      description: 'AI-driven Decision Support System that analyzes beneficiary data and recommends targeted welfare schemes for optimal FRA implementation outcomes.'
    }
  ];

  const faqData = [
    {
      question: 'How does FRA-Mitra digitize legacy records?',
      answer: 'FRA-Mitra uses advanced OCR (Optical Character Recognition) and NER (Named Entity Recognition) technologies to automatically extract structured data from scanned FRA documents, converting them into searchable digital records with high accuracy.'
    },
    {
      question: 'What satellite data is used for asset mapping?',
      answer: 'We utilize high-resolution satellite imagery from multiple sources including Landsat, Sentinel, and commercial satellites to map forest areas, land use patterns, water bodies, and infrastructure changes over time.'
    },
    {
      question: 'How does the DSS recommend schemes?',
      answer: 'Our Decision Support System analyzes beneficiary data, geographic conditions, and available schemes to provide intelligent recommendations. It considers factors like water scarcity, agricultural needs, and community requirements to suggest the most appropriate welfare programs.'
    },
    {
      question: 'Is FRA-Mitra accessible to tribal communities?',
      answer: 'Yes, FRA-Mitra is designed with accessibility in mind. We provide multilingual support, simplified interfaces, and community-friendly features to ensure tribal communities can easily access and benefit from the platform.'
    },
    {
      question: 'How secure is the data in FRA-Mitra?',
      answer: 'FRA-Mitra implements enterprise-grade security measures including data encryption, secure authentication, and compliance with Indian data protection regulations to ensure all sensitive information is protected.'
    },
    {
      question: 'Can NGOs and policymakers access the platform?',
      answer: 'Absolutely. FRA-Mitra offers different access levels for NGOs, policymakers, government officials, and community representatives, each with appropriate permissions and tools for their specific needs.'
    }
  ];

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-xl">
                <TreePine className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-xl font-bold text-gray-900">FRA-Mitra</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#home" className="text-gray-700 hover:text-green-600 transition-colors">Home</Link>
              <Link href="#about" className="text-gray-700 hover:text-green-600 transition-colors">About</Link>
              <Link href="#features" className="text-gray-700 hover:text-green-600 transition-colors">Features</Link>
              <Link href="#faq" className="text-gray-700 hover:text-green-600 transition-colors">FAQ</Link>
              <Link href="#contact" className="text-gray-700 hover:text-green-600 transition-colors">Contact</Link>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link href="/dashboard" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium">
                Login
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <Link href="#home" className="text-gray-700 hover:text-green-600 transition-colors">Home</Link>
                <Link href="#about" className="text-gray-700 hover:text-green-600 transition-colors">About</Link>
                <Link href="#features" className="text-gray-700 hover:text-green-600 transition-colors">Features</Link>
                <Link href="#faq" className="text-gray-700 hover:text-green-600 transition-colors">FAQ</Link>
                <Link href="#contact" className="text-gray-700 hover:text-green-600 transition-colors">Contact</Link>
                <Link href="/dashboard" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-center">
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Images Carousel */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={image}
                alt={`Forest background ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Empower Forest Rights with{' '}
            <span className="text-green-400">AI Innovation</span>
          </h1>
          
          <p className="text-xl sm:text-2xl mb-8 text-gray-200 leading-relaxed">
            Digitize records, map assets via satellite, visualize claims interactively, 
            and deliver targeted welfare schemes for efficient FRA implementation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard"
              className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-lg flex items-center justify-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link 
              href="#about"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors text-lg"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Image Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex space-x-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">About FRA-Mitra</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              FRA-Mitra is a comprehensive AI-powered platform that streamlines Forest Rights Act (FRA) 
              claim management across India. Our innovative system combines artificial intelligence for 
              digitization, satellite mapping for asset visualization, WebGIS for interactive mapping, 
              and intelligent Decision Support Systems for targeted scheme recommendations.
            </p>
          </div>

          {/* Key Features */}
          <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow card-hover">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <feature.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 ml-3">{feature.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-green-200">Claims Processed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-green-200">Tribal Communities</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-green-200">Forest Areas Mapped</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-green-200">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Find answers to common questions about FRA-Mitra
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {openFAQ === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform FRA Implementation?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join policymakers, NGOs, and communities in revolutionizing forest rights management
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard"
              className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-lg"
            >
              Start Your Journey
            </Link>
            <Link 
              href="#contact"
              className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition-colors text-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <TreePine className="h-6 w-6 text-green-400" />
                <span className="text-xl font-bold">FRA-Mitra</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Empowering forest rights through AI innovation and comprehensive digital solutions.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Research Papers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@fra-mitra.org</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+91-XXX-XXXX-XXXX</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Map className="h-4 w-4" />
                  <span>New Delhi, India</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 FRA-Mitra. All rights reserved. Built for Forest Rights Act monitoring and tribal community support.</p>
            <p className="mt-2">
              Research supported by Ministry of Tribal Affairs, Government of India
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}