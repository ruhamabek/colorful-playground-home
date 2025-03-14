
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, MessageSquare, LogOut, User, Settings, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    
    // Redirect to home page after logout
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-white border-r border-gray-200 hidden md:block"
      >
        <div className="p-6">
          <div className="flex items-center">
            <div className="relative h-8 w-8">
              <div className="absolute top-0 left-0 h-full w-full rounded-full bg-kidcare-magenta"></div>
              <div className="absolute bottom-0 left-3 h-5 w-5 rounded-bl-full bg-kidcare-purple"></div>
            </div>
            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-kidcare-magenta to-kidcare-purple bg-clip-text text-transparent">
              KidCare
            </span>
          </div>
        </div>
        
        <nav className="mt-6">
          <a href="#dashboard" className="block px-6 py-3 text-kidcare-magenta font-medium bg-kidcare-light-pink border-l-4 border-kidcare-magenta">
            <div className="flex items-center">
              <Home size={20} className="mr-3" />
              Dashboard
            </div>
          </a>
          
          <a href="#appointments" className="block px-6 py-3 text-gray-600 hover:text-kidcare-magenta hover:bg-kidcare-light-pink/50 border-l-4 border-transparent hover:border-kidcare-magenta/50 transition-all">
            <div className="flex items-center">
              <CalendarDays size={20} className="mr-3" />
              Appointments
            </div>
          </a>
          
          <a href="#messages" className="block px-6 py-3 text-gray-600 hover:text-kidcare-magenta hover:bg-kidcare-light-pink/50 border-l-4 border-transparent hover:border-kidcare-magenta/50 transition-all">
            <div className="flex items-center">
              <MessageSquare size={20} className="mr-3" />
              Messages
            </div>
          </a>
          
          <a href="#profile" className="block px-6 py-3 text-gray-600 hover:text-kidcare-magenta hover:bg-kidcare-light-pink/50 border-l-4 border-transparent hover:border-kidcare-magenta/50 transition-all">
            <div className="flex items-center">
              <User size={20} className="mr-3" />
              Profile
            </div>
          </a>
          
          <a href="#settings" className="block px-6 py-3 text-gray-600 hover:text-kidcare-magenta hover:bg-kidcare-light-pink/50 border-l-4 border-transparent hover:border-kidcare-magenta/50 transition-all">
            <div className="flex items-center">
              <Settings size={20} className="mr-3" />
              Settings
            </div>
          </a>
        </nav>
        
        <div className="absolute bottom-0 w-64 p-6">
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </Button>
        </div>
      </motion.aside>
      
      {/* Mobile top nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-10 border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative h-8 w-8">
              <div className="absolute top-0 left-0 h-full w-full rounded-full bg-kidcare-magenta"></div>
              <div className="absolute bottom-0 left-3 h-5 w-5 rounded-bl-full bg-kidcare-purple"></div>
            </div>
            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-kidcare-magenta to-kidcare-purple bg-clip-text text-transparent">
              KidCare
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-500"
            onClick={handleLogout}
          >
            <LogOut size={18} />
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8 md:py-12 md:pl-8 lg:pl-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-12 md:mt-0">Welcome, Parent!</h1>
            <p className="text-gray-600 mb-8">Here's your childcare dashboard</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Upcoming Appointments */}
              <div className="col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                  <CalendarDays size={20} className="mr-2 text-kidcare-magenta" />
                  Upcoming Appointments
                </h2>
                <div className="divide-y divide-gray-100">
                  {[
                    { id: 1, title: "Daycare Drop-off", time: "8:30 AM - 9:00 AM", date: "Today" },
                    { id: 2, title: "Parent-Teacher Meeting", time: "4:00 PM - 4:30 PM", date: "Tomorrow" },
                    { id: 3, title: "Swimming Class", time: "10:00 AM - 11:30 AM", date: "Friday, June 10" }
                  ].map((appointment) => (
                    <div key={appointment.id} className="py-3 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-800">{appointment.title}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock size={14} className="mr-1" />
                          {appointment.time}
                        </div>
                      </div>
                      <div className="text-sm bg-kidcare-light-pink text-kidcare-magenta py-1 px-3 rounded-full">
                        {appointment.date}
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-kidcare-magenta hover:bg-kidcare-purple">
                  Schedule New Appointment
                </Button>
              </div>
              
              {/* Calendar */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                  <CalendarDays size={20} className="mr-2 text-kidcare-magenta" />
                  Calendar
                </h2>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {[
                { title: "Manage Children", icon: <User className="h-5 w-5" />, color: "bg-blue-500" },
                { title: "Message Staff", icon: <MessageSquare className="h-5 w-5" />, color: "bg-green-500" },
                { title: "View Schedule", icon: <Clock className="h-5 w-5" />, color: "bg-purple-500" }
              ].map((action, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className={`${action.color} text-white p-3 rounded-full inline-flex mb-4`}>
                    {action.icon}
                  </div>
                  <h3 className="font-semibold text-gray-800">{action.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">Quick access to manage your childcare needs</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
