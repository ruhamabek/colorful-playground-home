import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Car,
  Briefcase,
  User,
  ArrowRight,
  Check,
  X,
} from "lucide-react";
import useProfile from "@/api/ProfileApi";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Admindashbored = () => {
  const navigate = useNavigate();
  const { getALLProfileMutation, updateProfileStatus } = useProfile();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [filter, setFilter] = useState<
    "all" | "tutor" | "driver" | "nanny" | "parent"
  >("all");
  const session = authClient.useSession();
  const loggedInUserId = session.data?.user?.id;

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await getALLProfileMutation.mutateAsync();
      const filteredProfiles = response.filter(
        (profile: any) => profile.userid !== loggedInUserId
      );
      setProfiles(filteredProfiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      toast.error("Failed to load profiles");
    }
  };

  const filteredProfiles = profiles.filter((profile) => {
    if (filter === "all") return true;
    if (filter === "tutor") return profile.educationUrl;
    if (filter === "driver") return profile.plateNum;
    if (filter === "nanny") return profile.certifications?.length > 0;
    if (filter === "parent") return profile.childrenCount > 0;
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
    if (profile.childrenCount > 0) {
      return (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-orange-500" />
          <span>Parent</span>
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

  const handleStatusChange = async (profileId: string, newStatus: string) => {
    // console.log("Updating status for:", profileId, "to", newStatus);

    try {
      await updateProfileStatus.mutateAsync(
        {
          userid: profileId,
          status: newStatus,
        },
        {
          onError: (error) => {
            toast.error(`Failed to update status: ${error.message}`);
            
            console.error("Detailed error:", error);
          },
            onSuccess: () => {
                toast.success("Status updated successfully");
                fetchProfiles(); // Refresh the profiles after updating
            },
        }
      );
    } catch (error) {
      toast.error("Network error - please check your connection");
      console.error("Network error details:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <Check className="h-3 w-3" /> Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <X className="h-3 w-3" /> Inactive
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <Link to="/" className="flex items-center">
          <img
            src="/lovable-uploads/86ba6735-e1a9-4ab5-af57-4a7bc2a80931.png"
            alt="KidCare Logo"
            className="h-10 w-28"
          />
        </Link>

        <div className="grid grid-cols-2 md:flex gap-2 md:gap-4">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" /> All
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
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Current Status</TableHead>
                <TableHead>Change Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfiles.map((profile) => (
                <TableRow key={profile._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={profile.profileUrl} />
                        <AvatarFallback>
                          {profile.name?.charAt(0) || profile.userid?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {profile.name || "No Name"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {profile.userid}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getProfileRole(profile)}</TableCell>
                  <TableCell>{profile.phoneNum}</TableCell>
                  <TableCell>{getStatusBadge(profile.status)}</TableCell>
                  <TableCell>
                    <Select
                      value={profile.status}
                      onValueChange={(value) =>
                        handleStatusChange(profile.userid, value)
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/profile/${profile.userid}`)}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Admindashbored;
