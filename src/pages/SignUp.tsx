
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // This is where you would normally connect to an auth service
    console.log(values);
    
    // For demonstration, we'll just show a success toast and redirect
    toast({
      title: "Account created successfully!",
      description: "Welcome to KidCare",
    });
    
    // Simulate successful registration and redirect
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-kidcare-light-pink to-white flex flex-col">
      <div className="container mx-auto max-w-md px-4 py-12 md:py-16 flex-grow flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 md:p-10"
        >
          <div className="mb-8 text-center">
            <Link to="/" className="inline-block mb-6">
              <div className="flex items-center justify-center">
                <div className="relative h-12 w-12">
                  <div className="absolute top-0 left-0 h-full w-full rounded-full bg-kidcare-magenta"></div>
                  <div className="absolute bottom-0 left-3 h-8 w-8 rounded-bl-full bg-kidcare-purple"></div>
                </div>
                <span className="ml-3 text-3xl font-bold bg-gradient-to-r from-kidcare-magenta to-kidcare-purple bg-clip-text text-transparent">
                  KidCare
                </span>
              </div>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Create an Account</h1>
            <p className="text-gray-600">Join KidCare and manage your childcare appointments</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input 
                          placeholder="John Doe" 
                          className="pl-10" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input 
                          placeholder="you@example.com" 
                          className="pl-10" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-10" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-10" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-kidcare-magenta hover:bg-kidcare-purple transition-colors mt-2"
              >
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link 
                to="/sign-in" 
                className="text-kidcare-magenta hover:text-kidcare-purple font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
      
      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} KidCare. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SignUp;
