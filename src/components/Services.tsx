
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Palette, 
  Music, 
  Users, 
  Apple, 
  Moon
} from 'lucide-react';

const servicesData = [
  {
    icon: <BookOpen size={32} className="text-kidcare-magenta" />,
    title: "Early Education",
    description: "Age-appropriate curriculum designed to foster cognitive development and prepare children for school."
  },
  {
    icon: <Palette size={32} className="text-kidcare-purple" />,
    title: "Creative Arts",
    description: "Engaging activities that inspire imagination and self-expression through art, crafts, and creative play."
  },
  {
    icon: <Music size={32} className="text-kidcare-magenta" />,
    title: "Music & Movement",
    description: "Fun, interactive sessions that develop motor skills, rhythm awareness, and musical appreciation."
  },
  {
    icon: <Users size={32} className="text-kidcare-purple" />,
    title: "Social Skills",
    description: "Guided interactions that help children build confidence, communication skills, and emotional intelligence."
  },
  {
    icon: <Apple size={32} className="text-kidcare-magenta" />,
    title: "Healthy Meals",
    description: "Nutritious, balanced meals and snacks prepared daily to support growing bodies and developing minds."
  },
  {
    icon: <Moon size={32} className="text-kidcare-purple" />,
    title: "Naptime Care",
    description: "Comfortable, supervised rest periods ensuring children stay refreshed and energized throughout the day."
  }
];

const Services = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      { threshold: 0.1 }
    );

    const cardElements = document.querySelectorAll('.service-card');
    cardElements.forEach(el => observer.observe(el));

    return () => {
      cardElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <section 
      id="services" 
      className="relative py-20 bg-gradient-to-b from-white to-kidcare-light-pink/40"
      ref={sectionRef}
    >
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-pink-100 rounded-full filter blur-3xl opacity-50 -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-100 rounded-full filter blur-3xl opacity-50 -z-10"></div>
      
      <div className="container-section">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block py-1 px-3 rounded-full text-sm font-medium bg-kidcare-light-pink text-kidcare-magenta mb-4"
          >
            Our Programs
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Comprehensive Childcare 
            <span className="block mt-2 bg-gradient-to-r from-kidcare-magenta to-kidcare-purple bg-clip-text text-transparent">
              Services We Offer
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 text-lg"
          >
            We provide a wide range of activities designed to nurture your child's development while ensuring they have fun in a safe environment.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <div 
              key={index} 
              className="service-card stagger-children"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="glass-card p-8 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            href="#contact"
            className="btn-primary inline-flex"
          >
            Schedule a Tour
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default Services;
