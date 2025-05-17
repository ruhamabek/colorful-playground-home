// src/controllers/userController.ts
import { Request, Response } from "express";
import { getUser } from "../utils/getUser";
import Profile from "../model/profile";

const getProfile = async (req: Request, res: Response) => {
  try {
    const userid = req.params.userid;

    if (!userid) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const profile = await Profile.findOne({ userid: userid });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    return res.status(200).json(profile);
  } catch (err) {
    console.error("Error fetching profile:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const allProfile = async (req: Request, res: Response) => {
  try {
    const profiles = await Profile.find({});

    if (!profiles || profiles.length === 0) {
      return res.status(404).json({ error: "No profiles found" });
    }

    return res.status(200).json(profiles);
  } catch (err) {
    console.error("Error fetching profiles:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const createProfile = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const user = await getUser(req);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if profile already exists for this user
    const existingProfile = await Profile.findOne({ userid: user.id });
    if (existingProfile) {
      return res
        .status(400)
        .json({ error: "Profile already exists for this user" });
    }

    const newProfile = new Profile({
      userid: user.id,
      profileUrl: body.profileUrl || "",
      phoneNum: body.phoneNum,
      address: body.address,
      status: body.status || "pending",
      // Parent-specific fields
      childrenCount: body.childrenCount || 0,
      childrenAges: body.childrenAges || [],
      // Driver-specific fields
      licenseUrl: body.licenseUrl || "",
      carType: body.carType || "",
      plateNum: body.plateNum || "",
      drivingExperience: body.drivingExperience || 0,
      insuranceUrl: body.insuranceUrl || "",
      // Tutor/Nanny fields
      certifications: body.certifications || [],
      certificationUrls: body.certificationUrls || [],
      school: body.school || "",
      educationLevel: body.educationLevel || "highschool",
      educationUrl: body.educationUrl || "",
      experience: body.experience || 0,
      // Verification
      isVerified: body.isVerified || false,
      verificationDate: body.verificationDate || null,
    });

    const savedProfile = await newProfile.save();
    return res.status(201).json(savedProfile);
  } catch (err) {
    console.error("Error creating profile:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateProfile = async (req: Request, res: Response) => {
  try {
    const updatedFields = req.body;
    const userid = req.params.userid;
    const user = await getUser(req);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Ensure user can only update their own profile
    if (user.id !== userid) {
      return res
        .status(403)
        .json({ error: "Forbidden - can only update your own profile" });
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { userid: userid },
      { $set: updatedFields },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    return res.status(200).json(updatedProfile);
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default { getProfile, createProfile, allProfile, updateProfile };
