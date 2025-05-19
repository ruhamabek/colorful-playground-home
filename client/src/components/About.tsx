
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const About = () => {
  const features = [
    "Childcare professionals",
    "Regular communication with parents",
    "Structured daily routines with flexibility"
  ];

  return (
    <section id="about" className="relative py-20 bg-white">
      <div className="absolute right-0 top-1/4 w-80 h-80 bg-purple-100/60 rounded-full filter blur-3xl -z-10"></div>
      
      <div className="container-section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl">
              <div className="aspect-w-4 aspect-h-5">
                <img
                  src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Childcare professional with children"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Overlay decoration */}
            <div className="absolute -z-10 top-10 -left-10 w-full h-full border-2 border-kidcare-magenta rounded-2xl"></div>
            
            {/* Stats card */}
            <div className="absolute -right-5 -bottom-5 glass-card p-6 shadow-lg max-w-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <h4 className="text-3xl font-bold text-kidcare-magenta">15+</h4>
                  <p className="text-sm text-gray-600">Years of Experience</p>
                </div>
                <div className="text-center">
                  <h4 className="text-3xl font-bold text-kidcare-purple">100%</h4>
                  <p className="text-sm text-gray-600">Parent Satisfaction</p>
                </div>
                <div className="text-center">
                  <h4 className="text-3xl font-bold text-kidcare-magenta">50+</h4>
                  <p className="text-sm text-gray-600">Certified Staff</p>
                </div>
                <div className="text-center">
                  <h4 className="text-3xl font-bold text-kidcare-purple">900+</h4>
                  <p className="text-sm text-gray-600">Happy Children</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full text-sm font-medium bg-kidcare-light-pink text-kidcare-magenta mb-4">
              About KidCare
            </span>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              We Are Passionate About 
              <span className="block mt-2 bg-gradient-to-r from-kidcare-magenta to-kidcare-purple bg-clip-text text-transparent">
                Childhood Development
              </span>
            </h2>
            
            <p className="text-gray-600 mb-6">
              Founded in 2025, KidCare has a mission is to provide exceptional care and education in a nurturing environment 
              that fosters each child's unique development.
            </p>
            
            <p className="text-gray-600 mb-8">
              We believe every child deserves the best start in life. Our dedicated team of 
              professionals is committed to creating a safe, supportive space where children 
              can explore, learn, and grow into confident individuals.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-kidcare-pink flex items-center justify-center mr-2">
                    <Check size={12} className="text-kidcare-magenta" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
