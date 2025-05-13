
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, MessageSquare, LogOut, User, Settings, Home, Briefcase, Users, BookOpen, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { toast } from "sonner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [providerType, setProviderType] = useState("nanny"); // Default to nanny, but in real app would come from auth
  
  // In a real app, this data would be fetched from an API based on the provider's ID
  const appointments = {
    nanny: [
      { id: 1, title: "Morning Care - Smith Family", time: "7:30 AM - 12:30 PM", date: "Today", familyName: "Smith" },
      { id: 2, title: "Evening Care - Johnson Family", time: "4:00 PM - 8:00 PM", date: "Today", familyName: "Johnson" },
      { id: 3, title: "Full Day Care - Davis Family", time: "8:00 AM - 6:00 PM", date: "Tomorrow", familyName: "Davis" }
    ],
    tutor: [
      { id: 1, title: "Math Tutoring - Emma Wilson", time: "3:30 PM - 4:30 PM", date: "Today", subject: "Mathematics" },
      { id: 2, title: "English Session - James Brown", time: "5:00 PM - 6:00 PM", date: "Today", subject: "English" },
      { id: 3, title: "Science Lesson - Olivia Martinez", time: "4:00 PM - 5:00 PM", date: "Tomorrow", subject: "Chemistry" }
    ],
    driver: [
      { id: 1, title: "School Pickup - 3 Children", time: "3:00 PM - 4:00 PM", date: "Today", locations: "Lincoln Elementary → Home" },
      { id: 2, title: "Soccer Practice Transport", time: "5:00 PM - 6:30 PM", date: "Today", locations: "Home → Sports Center → Home" },
      { id: 3, title: "Morning School Drop-off", time: "7:30 AM - 8:30 AM", date: "Tomorrow", locations: "2 Homes → Washington Middle School" }
    ]
  };

  const providerIcons = {
    nanny: <Users className="mr-3" />,
    tutor: <BookOpen className="mr-3" />,
    driver: <Car className="mr-3" />
  };

  const handleLogout = () => {
    toast.success("Logged out successfully", {
      description: "You have been logged out of your account"
    });
    
    // Redirect to home page after logout
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const getProviderTypeTitle = () => {
    const titles = {
      nanny: "Nanny",
      tutor: "Tutor",
      driver: "Driver"
    };
    return titles[providerType as keyof typeof titles];
  };

  // For demo purposes only - in a real app, this would come from auth
  const handleProviderTypeChange = (value: string) => {
    setProviderType(value);
  };

  const renderAppointmentDetails = (appointment: any) => {
    if (providerType === "nanny") {
      return (
        <div className="text-sm text-gray-500 mt-1">
          <span className="font-medium">{appointment.familyName} Family</span>
        </div>
      );
    } else if (providerType === "tutor") {
      return (
        <div className="text-sm text-gray-500 mt-1">
          <span className="font-medium">Subject: {appointment.subject}</span>
        </div>
      );
    } else if (providerType === "driver") {
      return (
        <div className="text-sm text-gray-500 mt-1">
          <span className="font-medium">{appointment.locations}</span>
        </div>
      );
    }
    return null;
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
          
          <a href="#schedule" className="block px-6 py-3 text-gray-600 hover:text-kidcare-magenta hover:bg-kidcare-light-pink/50 border-l-4 border-transparent hover:border-kidcare-magenta/50 transition-all">
            <div className="flex items-center">
              <CalendarDays size={20} className="mr-3" />
              Schedule
            </div>
          </a>
          
          <a href="#clients" className="block px-6 py-3 text-gray-600 hover:text-kidcare-magenta hover:bg-kidcare-light-pink/50 border-l-4 border-transparent hover:border-kidcare-magenta/50 transition-all">
            <div className="flex items-center">
              <Users size={20} className="mr-3" />
              Clients
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
            {/* Provider type selector (for demo purposes) */}
            <div className="mb-6 mt-12 md:mt-0">
              <Select onValueChange={handleProviderTypeChange} defaultValue={providerType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select provider type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nanny">Nanny Dashboard</SelectItem>
                  <SelectItem value="tutor">Tutor Dashboard</SelectItem>
                  <SelectItem value="driver">Driver Dashboard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Welcome, Service Provider!</h1>
            <p className="text-gray-600 mb-8">Your {getProviderTypeTitle()} dashboard</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Upcoming Appointments */}
              <div className="col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                  <CalendarDays size={20} className="mr-2 text-kidcare-magenta" />
                  Your Upcoming Appointments
                </h2>
                <div className="divide-y divide-gray-100">
                  {appointments[providerType as keyof typeof appointments].map((appointment) => (
                    <div key={appointment.id} className="py-3 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-800">{appointment.title}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock size={14} className="mr-1" />
                          {appointment.time}
                        </div>
                        {renderAppointmentDetails(appointment)}
                      </div>
                      <div className="text-sm bg-kidcare-light-pink text-kidcare-magenta py-1 px-3 rounded-full">
                        {appointment.date}
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-kidcare-magenta hover:bg-kidcare-purple">
                  Manage Schedule
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
            
            {/* Services & Stats */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Your Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {providerType === "nanny" && (
                  <>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                      <div className="flex items-center">
                        <div className="rounded-full bg-blue-100 p-3">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-800">3</h3>
                          <p className="text-gray-500 text-sm">Families</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                      <div className="flex items-center">
                        <div className="rounded-full bg-green-100 p-3">
                          <CalendarDays className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-800">28</h3>
                          <p className="text-gray-500 text-sm">Hours This Week</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                      <div className="flex items-center">
                        <div className="rounded-full bg-purple-100 p-3">
                          <MessageSquare className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-800">5</h3>
                          <p className="text-gray-500 text-sm">New Messages</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {providerType === "tutor" && (
                  <>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                      <div className="flex items-center">
                        <div className="rounded-full bg-blue-100 p-3">
                          <BookOpen className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-800">4</h3>
                          <p className="text-gray-500 text-sm">Subjects</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                      <div className="flex items-center">
                        <div className="rounded-full bg-green-100 p-3">
                          <Users className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-800">7</h3>
                          <p className="text-gray-500 text-sm">Students</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                      <div className="flex items-center">
                        <div className="rounded-full bg-purple-100 p-3">
                          <CalendarDays className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-800">15</h3>
                          <p className="text-gray-500 text-sm">Hours This Week</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {providerType === "driver" && (
                  <>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                      <div className="flex items-center">
                        <div className="rounded-full bg-blue-100 p-3">
                          <Car className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-800">12</h3>
                          <p className="text-gray-500 text-sm">Trips This Week</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                      <div className="flex items-center">
                        <div className="rounded-full bg-green-100 p-3">
                          <Users className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-800">5</h3>
                          <p className="text-gray-500 text-sm">Families</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                      <div className="flex items-center">
                        <div className="rounded-full bg-purple-100 p-3">
                          <Clock className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-800">18</h3>
                          <p className="text-gray-500 text-sm">Hours on Road</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-8 mb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto py-3 justify-start">
                  <CalendarDays className="mr-2 h-5 w-5" />
                  Update Availability
                </Button>
                <Button variant="outline" className="h-auto py-3 justify-start">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Message Clients
                </Button>
                <Button variant="outline" className="h-auto py-3 justify-start">
                  <Briefcase className="mr-2 h-5 w-5" />
                  View Jobs
                </Button>
                <Button variant="outline" className="h-auto py-3 justify-start">
                  <User className="mr-2 h-5 w-5" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
