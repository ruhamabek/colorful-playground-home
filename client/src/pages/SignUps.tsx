import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const formSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "First name must be at least 2 characters" }),
    lastName: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
    termsAndConditions: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

const RoleSelectionCard = ({
  role,
  isSelected,
  onClick,
}: {
  role: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const roleData = {
    parent: {
      icon: "👨‍👩‍👧‍👦",
      title: "Parent",
      description: "Find caregivers for your children",
    },
    nanny: {
      icon: "👶",
      title: "Nanny",
      description: "Offer childcare services",
    },
    driver: {
      icon: "🚗",
      title: "Driver",
      description: "Provide transportation services",
    },
    tutor: {
      icon: "📚",
      title: "Tutor",
      description: "Teach academic subjects",
    },
  }[role];

  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      className={`h-full p-6 flex flex-col items-center gap-2 transition-all ${
        isSelected ? "border-primary ring-2 ring-primary" : ""
      }`}
      onClick={onClick}
      type="button"
    >
      <span className="text-2xl">{roleData.icon}</span>
      <span className="font-semibold">{roleData.title}</span>
      <span className="text-sm text-muted-foreground">
        {roleData.description}
      </span>
    </Button>
  );
};

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAndConditions: false,
    },
  });

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setShowForm(true);
  };

  const handleBackToRoleSelection = () => {
    setShowForm(false);
    setSelectedRole(null);
  };

  const handleGoogleSignUp = async () => {
    if (!selectedRole) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select your role first",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/profile-setup`,
        state: { role: selectedRole },
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign up with Google",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!selectedRole) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select your role",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
        role: selectedRole,
      });

      navigate("/profile-setup");
      toast({
        title: "Account created successfully",
        description: "You can now complete your profile.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Please check your details and try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showForm) {
    return (
      <div className="flex min-h-screen bg-muted/30">
        {/* Left Side - Platform Information */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 to-secondary/5 relative">
          <div className="absolute inset-0 flex items-center justify-center p-10">
            <div className="max-w-xl">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold">Welcome to SkillSwap</h1>
                  <p className="text-muted-foreground">
                    Connect with a community of learners and educators to
                    exchange skills and knowledge.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-primary"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Join a thriving community</h3>
                      <p className="text-sm text-muted-foreground">
                        Connect with thousands of members looking to exchange
                        skills.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-primary"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12" />
                        <circle cx="17" cy="7" r="5" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Teach what you know</h3>
                      <p className="text-sm text-muted-foreground">
                        Share your expertise and grow as an educator.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-primary"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-4-4-3z" />
                        <path d="M12 19h9" />
                        <path d="M12 13v6" />
                        <path d="M7 13v6" />
                        <path d="M3 13v6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Learn new skills</h3>
                      <p className="text-sm text-muted-foreground">
                        Acquire valuable knowledge from experienced peers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Role Selection */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Join SkillSwap as...</h1>
              <p className="text-muted-foreground">
                Select your role to continue registration
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <RoleSelectionCard
                role="parent"
                isSelected={selectedRole === "parent"}
                onClick={() => handleRoleSelect("parent")}
              />
              <RoleSelectionCard
                role="nanny"
                isSelected={selectedRole === "nanny"}
                onClick={() => handleRoleSelect("nanny")}
              />
              <RoleSelectionCard
                role="driver"
                isSelected={selectedRole === "driver"}
                onClick={() => handleRoleSelect("driver")}
              />
              <RoleSelectionCard
                role="tutor"
                isSelected={selectedRole === "tutor"}
                onClick={() => handleRoleSelect("tutor")}
              />
            </div>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link
                to="/sign-in"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Left Side - Platform Information (same as above) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 to-secondary/5 relative">
        <div className="absolute inset-0 flex items-center justify-center p-10">
          <div className="max-w-xl">
            <Button
              variant="ghost"
              onClick={handleBackToRoleSelection}
              className="flex items-center gap-2 px-0"
              type="button"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to role selection
            </Button>
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">Create Account</h1>
                <p className="text-muted-foreground">
                  Complete your details to join our community.
                </p>
              </div>

              <div className="space-y-6">
                {/* Same platform info cards as above */}

                <div className="bg-background p-4 rounded-lg border flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full text-lg">
                    {selectedRole === "parent" && "👨‍👩‍👧‍👦"}
                    {selectedRole === "nanny" && "👶"}
                    {selectedRole === "driver" && "🚗"}
                    {selectedRole === "tutor" && "📚"}
                  </div>
                  <div>
                    <p className="font-medium">Registering as {selectedRole}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedRole === "parent" &&
                        "Find caregivers for your children"}
                      {selectedRole === "nanny" && "Offer childcare services"}
                      {selectedRole === "driver" &&
                        "Provide transportation services"}
                      {selectedRole === "tutor" && "Teach academic subjects"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-center">
            {/* <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-muted-foreground">
              Complete your details to join our community
            </p> */}
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Form fields remain exactly the same */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            placeholder="John"
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
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            placeholder="Doe"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="you@example.com"
                          className="pl-10"
                          type="email"
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
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
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
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
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
                name="termsAndConditions"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to the{" "}
                        <Link
                          to="/terms"
                          className="text-primary hover:underline"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          to="/privacy"
                          className="text-primary hover:underline"
                        >
                          Privacy Policy
                        </Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
