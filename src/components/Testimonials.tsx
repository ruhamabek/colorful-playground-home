
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Parent of Alex, 4",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    stars: 5,
    quote: "KidCare has been a blessing for our family. The staff is incredibly attentive and my son has flourished under their care. I've seen tremendous growth in his social skills and early learning abilities."
  },
  {
    name: "Michael Rodriguez",
    role: "Parent of Sophia, 3",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    stars: 5,
    quote: "We tried several daycares before finding KidCare, and the difference is night and day. The structured learning environment combined with plenty of play time gives my daughter the perfect balance."
  },
  {
    name: "Emily Chen",
    role: "Parent of Twins",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    stars: 5,
    quote: "Having twins meant finding childcare was doubly important - and challenging! KidCare has exceeded our expectations. Their team manages the unique dynamics wonderfully, and our boys love going there."
  },
  {
    name: "David Williams",
    role: "Parent of Olivia, 4",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    stars: 5,
    quote: "The level of communication from KidCare is exceptional. I always know what my daughter is learning, how she's doing, and the activities she's enjoying. It's given me great peace of mind as a working parent."
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoplay) {
      interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 5000);
    }
    
    return () => clearInterval(interval);
  }, [autoplay]);
  
  const handlePrev = () => {
    setAutoplay(false);
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };
  
  const handleNext = () => {
    setAutoplay(false);
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  return (
    <section 
      id="testimonials" 
      className="relative py-20 bg-kidcare-light-pink/30"
    >
      <div className="absolute top-0 left-0 w-full h-32 bg-white -z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-white -z-10"></div>
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-purple-100/60 rounded-full filter blur-3xl -z-10"></div>
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-pink-100/60 rounded-full filter blur-3xl -z-10"></div>
      
      <div className="container-section">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block py-1 px-3 rounded-full text-sm font-medium bg-kidcare-light-pink text-kidcare-magenta mb-4"
          >
            Testimonials
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            What Parents Are
            <span className="block mt-2 bg-gradient-to-r from-kidcare-magenta to-kidcare-purple bg-clip-text text-transparent">
              Saying About Us
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 text-lg"
          >
            Don't just take our word for it. Hear from the families who trust us with their precious little ones every day.
          </motion.p>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          {/* Testimonial Slider */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="testimonial-card glass-card p-8 md:p-10 shadow-lg">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center">
                        <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                          <img 
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{testimonial.name}</h4>
                          <p className="text-gray-600">{testimonial.role}</p>
                        </div>
                      </div>
                      <div className="flex">
                        {[...Array(testimonial.stars)].map((_, i) => (
                          <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    
                    <div className="relative">
                      <Quote size={40} className="absolute text-kidcare-magenta/10 -top-3 -left-3" />
                      <p className="text-gray-700 relative z-10">{testimonial.quote}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setAutoplay(false);
                  setActiveIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'bg-kidcare-magenta w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Arrow Controls */}
          <button
            onClick={handlePrev}
            className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors duration-300"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors duration-300"
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} className="text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
