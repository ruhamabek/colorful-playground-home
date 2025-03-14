
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    childName: '',
    childAge: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form after showing success message
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          childName: '',
          childAge: '',
          message: ''
        });
      }, 3000);
    }, 1500);
  };

  return (
    <section id="contact" className="relative py-20 bg-white">
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-kidcare-pink/20 rounded-full filter blur-3xl -z-10"></div>
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-purple-100/30 rounded-full filter blur-3xl -z-10"></div>
      
      <div className="container-section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:pr-8"
          >
            <span className="inline-block py-1 px-3 rounded-full text-sm font-medium bg-kidcare-light-pink text-kidcare-magenta mb-4">
              Get In Touch
            </span>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Give Your Child 
              <span className="block mt-2 bg-gradient-to-r from-kidcare-magenta to-kidcare-purple bg-clip-text text-transparent">
                The Best Start In Life?
              </span>
            </h2>
            
            <p className="text-gray-600 mb-8">
              We're excited to meet you and your little one! Contact us today to schedule a tour 
              of our facilities or to learn more about our programs and enrollment process.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-kidcare-light-pink flex items-center justify-center mr-4">
                  <MapPin size={20} className="text-kidcare-magenta" />
                </div>
                <div>
                  <h4 className="font-medium text-lg mb-1">Visit Us</h4>
                  <p className="text-gray-600">123 Sunshine Avenue, Happytown, CA 91234</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-kidcare-light-pink flex items-center justify-center mr-4">
                  <Phone size={20} className="text-kidcare-magenta" />
                </div>
                <div>
                  <h4 className="font-medium text-lg mb-1">Call Us</h4>
                  <p className="text-gray-600">(123) 456-7890</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-kidcare-light-pink flex items-center justify-center mr-4">
                  <Mail size={20} className="text-kidcare-magenta" />
                </div>
                <div>
                  <h4 className="font-medium text-lg mb-1">Email Us</h4>
                  <p className="text-gray-600">hello@kidcare.example.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-kidcare-light-pink flex items-center justify-center mr-4">
                  <Clock size={20} className="text-kidcare-magenta" />
                </div>
                <div>
                  <h4 className="font-medium text-lg mb-1">Open Hours</h4>
                  <p className="text-gray-600">Monday - Friday: 7:00 AM - 6:00 PM</p>
                  <p className="text-gray-600">Weekends: Closed</p>
                </div>
              </div>
            </div>
            
            <div className="relative h-60 rounded-xl overflow-hidden shadow-md">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.1332437042367!2d-122.41941548439496!3d37.774929979659345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050fa5!2sGolden%20Gate%20Park!5e0!3m2!1sen!2sus!4v1653493861681!5m2!1sen!2sus" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
                title="KidCare location map"
              ></iframe>
            </div>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-card p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl md:text-2xl font-bold mb-6">Enroll Your Child</h3>
              
              {submitSuccess ? (
                <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-green-800 mb-2">Thank You!</h4>
                  <p className="text-green-700">
                    Your message has been sent successfully. We'll contact you shortly!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name*
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-kidcare-magenta focus:border-transparent transition-colors duration-300"
                        placeholder="Jane Smith"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address*
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-kidcare-magenta focus:border-transparent transition-colors duration-300"
                        placeholder="jane@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number*
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-kidcare-magenta focus:border-transparent transition-colors duration-300"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="childName" className="block text-sm font-medium text-gray-700 mb-1">
                        Child's Name*
                      </label>
                      <input
                        type="text"
                        id="childName"
                        name="childName"
                        required
                        value={formData.childName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-kidcare-magenta focus:border-transparent transition-colors duration-300"
                        placeholder="Alex Smith"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="childAge" className="block text-sm font-medium text-gray-700 mb-1">
                        Child's Age*
                      </label>
                      <input
                        type="text"
                        id="childAge"
                        name="childAge"
                        required
                        value={formData.childAge}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-kidcare-magenta focus:border-transparent transition-colors duration-300"
                        placeholder="3 years"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message (Optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-kidcare-magenta focus:border-transparent transition-colors duration-300"
                      placeholder="Tell us about your childcare needs..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full btn-primary flex items-center justify-center ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        Submit Enrollment Request
                        <Send size={18} className="ml-2" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
