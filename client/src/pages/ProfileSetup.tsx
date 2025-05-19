import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useProfile from "../api/ProfileApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import uploadFile from "../helpers/uploadFile.js";
import { authClient } from "@/lib/auth-client";

function ProfileSetup() {
  const navigate = useNavigate();
  const session = authClient.useSession();
  const userRole = session.data?.user?.role;
  console.log("User role:", userRole);
  const {
    profile,
    isLoading,
    isError,
    createProfileMutation,
    updateProfileMutation,
  } = useProfile();

  // Initialize form data
  const [formData, setFormData] = useState({
    profileUrl: "",
    phoneNum: "",
    address: "",
    status: "pending",
    // Parent fields
    childrenCount: 0,
    childrenAges: [] as number[],
    // Driver fields
    licenseUrl: "",
    carType: "",
    plateNum: "",
    drivingExperience: 0,
    insuranceUrl: "",
    // Tutor/Nanny fields
    certifications: [] as string[],
    certificationUrls: [] as string[],
    school: "",
    educationLevel: "highschool",
    educationUrl: "",
    experience: 0,
    isVerified: false,
  });

  // File states
  const [files, setFiles] = useState({
    profileImage: null as File | null,
    licenseFile: null as File | null,
    educationFile: null as File | null,
    insuranceFile: null as File | null,
  });

  const [certification, setCertification] = useState("");
  const [ageInput, setAgeInput] = useState("");

  // Load existing profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        profileUrl: profile.profileUrl || "",
        phoneNum: profile.phoneNum || "",
        address: profile.address || "",
        status: profile.status || "pending",
        childrenCount: profile.childrenCount || 0,
        childrenAges: profile.childrenAges || [],
        licenseUrl: profile.licenseUrl || "",
        carType: profile.carType || "",
        plateNum: profile.plateNum || "",
        drivingExperience: profile.drivingExperience || 0,
        insuranceUrl: profile.insuranceUrl || "",
        certifications: profile.certifications || [],
        certificationUrls: profile.certificationUrls || [],
        school: profile.school || "",
        educationLevel: profile.educationLevel || "",
        educationUrl: profile.educationUrl || "",
        experience: profile.experience || 0,
        isVerified: profile.isVerified || false,
      });
    }
  }, [profile]);

  // Handle file changes
  const handleFileChange =
    (field: keyof typeof files) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setFiles((prev) => ({ ...prev, [field]: e.target.files![0] }));
      }
    };

  // Certification management
  const addCertification = () => {
    const cert = certification.trim();
    if (!cert) return;
    if (!formData.certifications.includes(cert)) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, cert],
      }));
      setCertification("");
    }
  };

  const removeCertification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  // Child age management
  const addChildAge = () => {
    const age = parseInt(ageInput);
    if (isNaN(age)) return;
    setFormData((prev) => ({
      ...prev,
      childrenAges: [...prev.childrenAges, age],
    }));
    setAgeInput("");
  };

  const removeChildAge = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      childrenAges: prev.childrenAges.filter((_, i) => i !== index),
    }));
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Upload all files
      const uploads = await Promise.all([
        files.profileImage ? uploadFile(files.profileImage) : null,
        files.licenseFile ? uploadFile(files.licenseFile) : null,
        files.educationFile ? uploadFile(files.educationFile) : null,
        files.insuranceFile ? uploadFile(files.insuranceFile) : null,
      ]);

      const updatedFormData = {
        ...formData,
        profileUrl: uploads[0]?.secure_url || formData.profileUrl,
        licenseUrl: uploads[1]?.secure_url || formData.licenseUrl,
        educationUrl: uploads[2]?.secure_url || formData.educationUrl,
        insuranceUrl: uploads[3]?.secure_url || formData.insuranceUrl,
        userid: session.data?.user?.id,
      };

      if (profile) {
        await updateProfileMutation.mutateAsync(updatedFormData);
        toast("Your profile has been updated successfully");
      } else {
        await createProfileMutation.mutateAsync(updatedFormData);
        toast("Your profile has been created successfully");
      }

      navigate("/profile");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast("Failed to save profile. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  // File preview component
  const FilePreview = ({
    file,
    url,
    alt,
  }: {
    file: File | null;
    url: string;
    alt: string;
  }) => {
    if (file) {
      return (
        <div className="mb-2">
          <img
            src={URL.createObjectURL(file)}
            alt={`New ${alt}`}
            className="w-32 h-32 object-contain rounded-md border"
          />
          <p className="text-sm mt-1">
            New {alt} selected: {file.name}
          </p>
        </div>
      );
    }
    if (url) {
      return (
        <div className="mb-2">
          <img
            src={url}
            alt={`Current ${alt}`}
            className="w-32 h-32 object-contain rounded-md border"
          />
          <p className="text-sm mt-1">
            Current {alt}:{" "}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              View
            </a>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-2xl shadow-lg bg-white p-6 rounded-xl">
        <h2 className="text-2xl font-semibold text-center mb-4">
          {profile ? "Update Profile" : "Complete Your Profile"}
        </h2>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Image */}
            <div>
              <h3 className="font-semibold mb-1">Profile Image</h3>
              <FilePreview
                file={files.profileImage}
                url={formData.profileUrl}
                alt="profile image"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange("profileImage")}
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* Common fields */}
            <div>
              <label className="block font-medium mb-1">Phone Number</label>
              <Input
                value={formData.phoneNum}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNum: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Address</label>
              <Input
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
              />
            </div>

            {/* Role-specific fields */}
            {userRole === "parent" && (
              <>
                <div>
                  <label className="block font-medium mb-1">
                    Number of Children
                  </label>
                  <Input
                    type="number"
                    value={formData.childrenCount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        childrenCount: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Children's Ages</h3>
                  <div className="flex gap-2">
                    <Input
                      value={ageInput}
                      onChange={(e) => setAgeInput(e.target.value)}
                      placeholder="Add child's age"
                    />
                    <Button type="button" onClick={addChildAge}>
                      Add Age
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.childrenAges.map((age, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-gray-200 px-2 py-1 rounded-md"
                      >
                        <span>{age}</span>
                        <X
                          className="cursor-pointer"
                          onClick={() => removeChildAge(index)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {userRole === "driver" && (
              <>
                <div>
                  <h3 className="font-semibold mb-1">Driver License</h3>
                  <FilePreview
                    file={files.licenseFile}
                    url={formData.licenseUrl}
                    alt="driver license"
                  />
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange("licenseFile")}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <h3 className="font-semibold mb-1">Car Type</h3>
                <Input
                  value={formData.carType}
                  onChange={(e) =>
                    setFormData({ ...formData, carType: e.target.value })
                  }
                />
                <h3 className="font-semibold mb-1">License Plate Number</h3>
                <Input
                  value={formData.plateNum}
                  onChange={(e) =>
                    setFormData({ ...formData, plateNum: e.target.value })
                  }
                />
                <h3 className="font-semibold mb-1">
                  Years of Driving Experience
                </h3>
                <Input
                  type="number"
                  value={formData.drivingExperience}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      drivingExperience: parseInt(e.target.value) || 0,
                    })
                  }
                />

                <div>
                  <label className="block font-medium mb-1">Car Type</label>
                  <Input
                    value={formData.carType}
                    onChange={(e) =>
                      setFormData({ ...formData, carType: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">
                    License Plate Number
                  </label>
                  <Input
                    value={formData.plateNum}
                    onChange={(e) =>
                      setFormData({ ...formData, plateNum: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">
                    Years of Driving Experience
                  </label>
                  <Input
                    type="number"
                    value={formData.drivingExperience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        drivingExperience: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Insurance Document</h3>
                  <FilePreview
                    file={files.insuranceFile}
                    url={formData.insuranceUrl}
                    alt="insurance document"
                  />
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange("insuranceFile")}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </>
            )}

            {(userRole === "nanny" || userRole === "tutor") && (
              <>
                <>
                  <h3 className="font-semibold mb-1">Years of Experience</h3>
                  <Input
                    type="number"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        experience: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </>
                <div>
                  <label className="block font-medium mb-1">
                    Years of Experience
                  </label>
                  <Input
                    type="number"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        experience: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </>
            )}

            {userRole === "nanny" && (
              <div>
                <h3 className="font-semibold mb-1">Certifications</h3>
                <div className="flex gap-2">
                  <Input
                    value={certification}
                    onChange={(e) => setCertification(e.target.value)}
                    placeholder="Add certification"
                  />
                  <Button type="button" onClick={addCertification}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-200 px-2 py-1 rounded-md"
                    >
                      <span>{cert}</span>
                      <X
                        className="cursor-pointer"
                        onClick={() => removeCertification(index)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {userRole === "tutor" && (
              <>
                <h3 className="font-semibold mb-1">Certifications</h3>
                <Input
                  value={formData.school}
                  onChange={(e) =>
                    setFormData({ ...formData, school: e.target.value })
                  }
                />
                <div>
                  <label className="block font-medium mb-1">
                    School/University
                  </label>
                  <Input
                    value={formData.school}
                    onChange={(e) =>
                      setFormData({ ...formData, school: e.target.value })
                    }
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Education Certificate</h3>
                  <FilePreview
                    file={files.educationFile}
                    url={formData.educationUrl}
                    alt="education certificate"
                  />
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange("educationFile")}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-medium">Education Level</label>
                  <select
                    value={formData.educationLevel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        educationLevel: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="highschool">High School</option>
                    <option value="bachelors">Bachelor's Degree</option>
                    <option value="masters">Master's Degree</option>
                    <option value="phd">PhD</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </>
            )}

            <Button type="submit" className="w-full mt-6">
              {profile ? "Update Profile" : "Create Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfileSetup;
