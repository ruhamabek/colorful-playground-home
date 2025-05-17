import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
        // Filter out current user and parent profiles (childrenCount > 0)
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

  // Filter profiles based on role
  const filteredProfiles = profiles.filter((profile) => {
    if (filter === "all") {
      // Show all except parents (already filtered out)
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

  // Determine profile role with icons
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
    // const { getALLconnectMutation, responseMutation } = Payment();
    // console.log("this is mentore is", action, "this is image ", image);
    const response = await AskMutation.mutateAsync({ action, image });

    console.log("this is response", response);
    toast.success(`${response}`);
  };

  // Handle view profile details
  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-wrap justify-center gap-4 mb-8">
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
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary text-white">
                    {profile.userid?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  {getProfileRole(profile)}
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={profile.isVerified ? "default" : "secondary"}
                    >
                      {profile.isVerified ? "Verified" : "Pending"}
                    </Badge>
                    {profile.experience > 0 && (
                      <Badge variant="outline">
                        {profile.experience} yr exp
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.educationUrl && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Education Level:</p>
                    <p className="text-sm capitalize">
                      {profile.educationLevel}
                    </p>
                  </div>
                )}
                {profile.plateNum && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Vehicle Details:</p>
                    <p className="text-sm">
                      {profile.carType} ({profile.plateNum})
                    </p>
                    <p className="text-sm">
                      {profile.drivingExperience} years driving
                    </p>
                  </div>
                )}
                {profile.certifications?.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Certifications:</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.certifications.map(
                        (cert: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {cert}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-sm font-medium">Contact:</p>
                  <p className="text-sm">{profile.phoneNum}</p>
                  <p className="text-sm text-muted-foreground">
                    {profile.address}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => handleViewProfile(profile.userid)}
                  className="flex items-center gap-2"
                >
                  View Details <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() =>
                    session
                      ? handleConnect(profile?.userid, profile?.profileUrl)
                      : navigate("/sign-up")
                  }
                >
                  ask for service
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseProfiles;
