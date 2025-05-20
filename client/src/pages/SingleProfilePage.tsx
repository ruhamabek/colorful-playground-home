import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Car,
  Briefcase,
  User,
  MapPin,
  Phone,
  Shield,
  Book,
  Star,
  Clock,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useProfile from "@/api/ProfileApi";
import { toast } from "@/components/ui/use-toast";
import { authClient } from "@/lib/auth-client";

const SingleProfilePage = () => {
  const { userid } = useParams();
  const navigate = useNavigate();
  const { getsingleProfileMutation } = useProfile();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const session = authClient.useSession();
  const currentUserId = session.data?.user?.id;

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProfile = async () => {
      if (!userid) {
        setError("User ID is required");
        setLoading(false);
        return;
      }

      try {
        const response = await getsingleProfileMutation.mutateAsync(userid); // Pass userid here
        setProfile(response);
      } catch (err) {
        setError("Failed to load profile");
        toast("Could not load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userid]); // Removed getsingleProfileMutation from dependencies

  const determineRole = () => {
    if (!profile) return null;

    if (profile.educationUrl) return "tutor";
    if (profile.plateNum) return "driver";
    if (profile.certifications?.length > 0) return "nanny";
    if (profile.childrenCount > 0) return "parent";
    return "general";
  };

  const role = determineRole();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Browse
      </Button>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Sidebar */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <Card className="sticky top-6">
            <CardHeader className="items-center">
              <Avatar className="w-32 h-32 border-4 border-primary">
                <AvatarImage src={profile.profileUrl} />
                <AvatarFallback className="text-2xl">
                  {profile.userid?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-center mt-4">
                {profile.userid === currentUserId
                  ? "Your Profile"
                  : profile.name || "Profile"}
              </CardTitle>

                <div className="flex justify-center mt-4">
                  <Badge
                    variant="outline"
                    className={`px-4 py-2 text-base capitalize ${
                      profile.status === "active"
                        ? "border-blue-500 text-blue-600"
                        : profile.status === "inactive"
                        ? "border-red-500 text-red-600"
                        : "border-green-500 text-green-600"
                    }`}
                  >
                    {profile.status === "active"
                      ? "Verified"
                      : profile.status === "inactive"
                      ? "Rejected"
                      : "Pending"}
                  </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 mt-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="capitalize">{role}</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span>{profile.phoneNum || "Not provided"}</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{profile.address || "Not provided"}</span>
              </div>

              {role === "tutor" && profile.school && (
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  <span>{profile.school}</span>
                </div>
              )}

              {role === "driver" && profile.carType && (
                <div className="flex items-center gap-3">
                  <Car className="h-5 w-5 text-muted-foreground" />
                  <span>{profile.carType}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Profile Content */}
        <div className="w-full md:w-2/3 lg:w-3/4 space-y-6">
          {/* Role-Specific Sections */}
          {role === "tutor" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-purple-500" />
                  Tutor Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.educationUrl && (
                  <div>
                    <h3 className="font-medium mb-2">Education Certificate</h3>
                    <a
                      href={profile.educationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center gap-2"
                    >
                      View Certificate <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                )}

                <div>
                  <h3 className="font-medium mb-2">Education Level</h3>
                  <p className="capitalize">
                    {profile.educationLevel || "Not specified"}
                  </p>
                </div>

                {profile.experience > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Teaching Experience</h3>
                    <p>{profile.experience} years</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {role === "driver" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-blue-500" />
                  Driver Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.plateNum && (
                  <div>
                    <h3 className="font-medium mb-2">Vehicle Details</h3>
                    <p>License Plate: {profile.plateNum}</p>
                    <p>Vehicle Type: {profile.carType || "Not specified"}</p>
                  </div>
                )}

                {profile.drivingExperience > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Driving Experience</h3>
                    <p>{profile.drivingExperience} years</p>
                  </div>
                )}

                {profile.licenseUrl && (
                  <div>
                    <h3 className="font-medium mb-2">Driver's License</h3>
                    <a
                      href={profile.licenseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center gap-2"
                    >
                      View License <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                )}

                {profile.insuranceUrl && (
                  <div>
                    <h3 className="font-medium mb-2">Insurance</h3>
                    <a
                      href={profile.insuranceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center gap-2"
                    >
                      View Insurance <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {role === "nanny" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-green-500" />
                  Nanny Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.certifications?.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.certifications.map(
                        (cert: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {cert}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}

                {profile.experience > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Childcare Experience</h3>
                    <p>{profile.experience} years</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Common Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                General Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Status</h3>
                <Badge variant="outline" className="capitalize">
                  {profile.status}
                </Badge>
              </div>

              <div>
                <h3 className="font-medium mb-2">Contact Information</h3>
                <p>Phone: {profile.phoneNum || "Not provided"}</p>
                <p>Address: {profile.address || "Not provided"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {/* {profile.userid !== currentUserId && (
            <div className="flex gap-4 justify-end">
              <Button
                variant="outline"
                onClick={() => navigate(`/messages/${profile.userid}`)}
              >
                Send Message
              </Button>
              <Button
                onClick={() =>
                  console.log("Initiate payment for", profile.userid)
                }
              >
                Hire Now
              </Button>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default SingleProfilePage;
