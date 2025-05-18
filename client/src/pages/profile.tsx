import React, { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Edit,
  MessageSquare,
  Star,
  Check,
  User,
  MapPin,
  GraduationCap,
  Car,
  ShieldCheck,
  Briefcase,
  Zap,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/sonner";
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "react-router-dom";
import useProfile from "@/api/ProfileApi";
import Header from "@/components/Header";

const Profile = () => {
  const { data: session } = authClient.useSession();
  const { profile, isLoading, isError, error } = useProfile();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!isLoading && !profile && !isRedirecting && session) {
      setIsRedirecting(true);
      toast("Please complete your profile setup");
      navigate("/profile-setup");
    }
  }, [isLoading, profile, isRedirecting, session, navigate]);

  if (!session || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (isError) {
    console.error("Profile error:", error);
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">
          Error loading profile:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-muted-foreground">Redirecting to profile setup...</p>
      </div>
    );
  }

  const user = {
    name: session.user.name,
    avatar: profile.profileUrl || "",
    phoneNum: profile.phoneNum || "Not provided",
    address: profile.address || "Not provided",
    status: profile.status || "pending",
    childrenCount: profile.childrenCount || 0,
    childrenAges: profile.childrenAges || [],
    licenseUrl: profile.licenseUrl || "",
    carType: profile.carType || "Not specified",
    plateNum: profile.plateNum || "Not specified",
    drivingExperience: profile.drivingExperience || 0,
    insuranceUrl: profile.insuranceUrl || "",
    certifications: profile.certifications || [],
    school: profile.school || "Not specified",
    educationLevel: profile.educationLevel || "Not specified",
    educationUrl: profile.educationUrl || "",
    experience: profile.experience || 0,
    isVerified: profile.isVerified || false,
    joinDate: session.user.createdAt,
    rating: 4.8,
    reviewCount: 24,
    completedExchanges: 15,
  };

  const renderRoleSpecificFields = () => {
    const role = session?.user?.role?.toLowerCase();
    if (!role) return null;

    switch (role) {
      case "parent":
        return (
          <>
            <Header />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="text-lg font-medium">
                  {user.childrenCount}{" "}
                  {user.childrenCount === 1 ? "child" : "children"}
                </span>
              </div>
              {user.childrenAges.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium">
                    Ages: {user.childrenAges.join(", ")}
                  </span>
                </div>
              )}
            </div>
          </>
        );
      case "driver":
        return (
          <>
            <Header />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                <span className="text-lg font-medium">{user.carType}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium">
                  Plate: {user.plateNum}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium">
                  {user.drivingExperience}{" "}
                  {user.drivingExperience === 1 ? "year" : "years"} experience
                </span>
              </div>
              {user.insuranceUrl && (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span className="text-lg font-medium">
                    Insurance verified
                  </span>
                </div>
              )}
            </div>
            {user.licenseUrl && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-primary" />
                    Driver License
                  </CardTitle>
                  <CardDescription>Verified driver credentials</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => window.open(user.licenseUrl, "_blank")}
                  >
                    View Driver License
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        );
      case "tutor":
      case "nanny":
        return (
          <>
            <Header />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <span className="text-lg font-medium">
                  {user.experience} {user.experience === 1 ? "year" : "years"}{" "}
                  experience
                </span>
              </div>
              {role === "tutor" && user.school && (
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span className="text-lg font-medium">{user.school}</span>
                </div>
              )}
              {user.certifications.length > 0 && (
                <div className="col-span-2">
                  <h3 className="font-semibold mb-2">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="bg-muted/50 px-3 py-1 rounded-full text-sm"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {role === "tutor" && user.educationUrl && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Education Verification
                  </CardTitle>
                  <CardDescription>
                    Verified education credentials
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => window.open(user.educationUrl, "_blank")}
                  >
                    View Education Certificate
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" />
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="flex flex-col items-center md:items-start">
              <div className="relative">
                <div className="mb-4">
                  <Avatar className="w-32 h-32 border-4 border-primary shadow-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div
                  className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow-md cursor-pointer"
                  onClick={() => navigate("/profile-setup")}
                >
                  <Edit className="h-5 w-5" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="secondary"
                  className="gap-2 px-4 py-2 shadow-md"
                  onClick={() => navigate("/connections")}
                >
                  <MessageSquare className="h-4 w-4" /> Message
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 px-4 py-2 shadow-md"
                  onClick={() => navigate("/profile-setup")}
                >
                  <Edit className="h-4 w-4" /> Edit Profile
                </Button>
              </div>
            </div>

            <div className="flex-grow md:border-l md:pl-8 md:border-border">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h1 className="text-4xl font-extrabold">{user.name}</h1>
                  <p className="text-muted-foreground text-lg capitalize">
                    {session.user.role}
                  </p>
                </div>
                {user.isVerified && (
                  <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full mt-2 md:mt-0">
                    <Check className="h-4 w-4" />
                    <span>Verified</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-lg font-medium">{user.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <span className="text-lg font-medium">
                    Joined {new Date(user.joinDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium">{user.phoneNum}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium capitalize">
                    Status: {user.status}
                  </span>
                </div>
              </div>

              {renderRoleSpecificFields()}

              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(user.rating)
                            ? "text-amber-500 fill-amber-500"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-medium">{user.rating}</span>
                  <span className="text-muted-foreground text-sm">
                    ({user.reviewCount} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span className="text-lg font-medium">
                    {user.completedExchanges}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    Exchanges
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
