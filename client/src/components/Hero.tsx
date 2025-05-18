
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Shield, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const Navigate = useNavigate();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          containerRef.current?.classList.add('animate');
        }
      },
      { threshold: 0.1 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center pt-20"
    >
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-kidcare-pink/20 rounded-full filter blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/30 rounded-full filter blur-3xl -z-10 transform -translate-x-1/2 translate-y-1/4"></div>
      
      <div className="container-section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="stagger-children" ref={containerRef}>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-block py-1 px-3 rounded-full text-sm font-medium bg-kidcare-light-pink text-kidcare-magenta mb-4"
            >
              Nurturing young minds with care
            </motion.span>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-balance leading-tight mb-6"
            >
              <span className="block">
                Giving your child the 
              </span>
              <span className="bg-gradient-to-r from-kidcare-magenta to-kidcare-purple bg-clip-text text-transparent">
                best start in life
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-gray-600 mb-8 max-w-lg"
            >
              At KidCare, we connect parents with trusted, professional childcare providers in their community. Find the right match for your family's needs and give your child the best opportunities to learn, play, and grow.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <a href="#contact" className="btn-primary flex items-center justify-center" onClick={() => {Navigate('/sign-up');}}>
                Enroll Your Child
                <ArrowRight size={18} className="ml-2" />
              </a>
              <a href="#services" className="btn-outline flex items-center justify-center">
                Explore Our Services
              </a>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {[
                { icon: <Heart className="text-kidcare-magenta" />, text: "Caring Environment" },
                { icon: <Shield className="text-kidcare-purple" />, text: "Safe & Secure" },
                { icon: <Clock className="text-kidcare-magenta" />, text: "Flexible Hours" }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="p-2 rounded-full bg-white shadow-sm">{item.icon}</div>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>
          
          {/* Image/Illustration */}
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-kidcare-pink/30 rounded-full filter blur-2xl -z-10"></div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-purple-200/40 rounded-full filter blur-2xl -z-10"></div>
            
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
              {/* <img
                src="/lovable-uploads/86ba6735-e1a9-4ab5-af57-4a7bc2a80931.png"
                alt="KidCare Logo"
                className="w-48 absolute top-6 right-6 z-20 animate-pulse-soft"
              /> */}
              <div className="aspect-w-4 aspect-h-3 bg-gradient-to-br from-kidcare-pink to-white p-8">
                <div className="w-full h-full rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Happy children playing"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            
            {/* Animated floating elements */}
            <div className="absolute -right-4 bottom-20 glass-card py-3 px-4 shadow-lg animate-float">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Licensed & Certified</p>
                  <p className="text-xs text-gray-500">All our facilities</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -left-4 top-20 glass-card py-3 px-4 shadow-lg animate-float" style={{ animationDelay: '2s' }}>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Early Learning</p>
                  <p className="text-xs text-gray-500">Age-appropriate programs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
