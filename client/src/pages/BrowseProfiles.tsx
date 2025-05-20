import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Car, Briefcase, User, ArrowRight } from "lucide-react";
import useProfile from "@/api/ProfileApi";
import Payments from "@/api/connectionApi";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const BrowseProfiles = () => {
  const navigate = useNavigate();
  const { getALLProfileMutation } = useProfile();
  const { AskMutation } = Payments();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "tutor" | "driver" | "nanny">(
    "all"
  );
  const session = authClient.useSession();
  const loggedInUserId = session.data?.user?.id;

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProfiles = async () => {
      try {
        const response = await getALLProfileMutation.mutateAsync();
        const filteredProfiles = response.filter(
          (profile: any) =>
            profile.userid !== loggedInUserId && profile.childrenCount <= 0
        );
        setProfiles(filteredProfiles);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
  }, []);

  const filteredProfiles = profiles.filter((profile) => {
    if (filter === "all") {
      return (
        profile.educationUrl ||
        profile.plateNum ||
        profile.certifications?.length > 0
      );
    }
    if (filter === "tutor") return profile.educationUrl;
    if (filter === "driver") return profile.plateNum;
    if (filter === "nanny") return profile.certifications?.length > 0;
    return false;
  });

  const getProfileRole = (profile: any) => {
    if (profile.educationUrl) {
      return (
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-purple-500" />
          <span>Tutor</span>
        </div>
      );
    }
    if (profile.plateNum) {
      return (
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4 text-blue-500" />
          <span>Driver</span>
        </div>
      );
    }
    if (profile.certifications?.length > 0) {
      return (
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-green-500" />
          <span>Nanny</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-gray-500" />
        <span>General</span>
      </div>
    );
  };

  const handleConnect = async (action: string, image: string) => {
    const response = await AskMutation.mutateAsync({ action, image });
    toast.success(`${response}`);
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Responsive Navigation Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/lovable-uploads/86ba6735-e1a9-4ab5-af57-4a7bc2a80931.png"
            alt="KidCare Logo"
            className="h-10 w-28"
          />
        </Link>

        {/* Filter Buttons (Responsive) */}
        <div className="grid grid-cols-2 md:flex gap-2 md:gap-4">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" /> All Professionals
          </Button>
          <Button
            variant={filter === "tutor" ? "default" : "outline"}
            onClick={() => setFilter("tutor")}
            className="flex items-center gap-2"
          >
            <GraduationCap className="h-4 w-4" /> Tutors
          </Button>
          <Button
            variant={filter === "driver" ? "default" : "outline"}
            onClick={() => setFilter("driver")}
            className="flex items-center gap-2"
          >
            <Car className="h-4 w-4" /> Drivers
          </Button>
          <Button
            variant={filter === "nanny" ? "default" : "outline"}
            onClick={() => setFilter("nanny")}
            className="flex items-center gap-2"
          >
            <Briefcase className="h-4 w-4" /> Nannies
          </Button>
        </div>
      </div>

      {filteredProfiles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No professionals found matching your criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <Card
              key={profile._id}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar className="w-16 h-16 border-2 border-primary">
                  <AvatarImage
                    src={profile.profileUrl || "/default-avatar.png"}
                    alt="Profile"
                  />
                  <AvatarFallback className="bg-primary text-white">
                    {profile.userid?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">{getProfileRole(profile)}</div>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => handleViewProfile(profile.userid)}
                >
                  View Details <ArrowRight className="h-4 w-4" />
                </Button>
                {profile.status === "active" ? (
                  <Button
                    variant="default"
                    onClick={() =>
                      session
                        ? handleConnect(profile?.userid, profile?.profileUrl)
                        : navigate("/sign-up")
                    }
                  >
                    Ask for Service
                  </Button>
                ) : (
                  <Badge variant="destructive" className="text-xs">
                    Waiting for Verification
                  </Badge>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseProfiles;
