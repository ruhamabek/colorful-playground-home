// src/controllers/userController.ts
import { Request, Response } from "express";
import { getUser } from "../utils/getUser";
import profileInterface from "../interface/profileInterface";
import Profile from "../model/profile";

const getProfile = async (req: Request, res: Response) => {
  try {
    const userid = req.params.userid;

    if (!userid) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const profiles = await Profile.findOne({ userid: userid });
    return res.status(200).json(profiles);
  } catch (err) {
    return res.status(500).json({ error: "internal server error" });
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
    const body: profileInterface = req.body;
    const user = await getUser(req);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const newProfile = new Profile({
      title: body.title,
      university: body.university,
      location: body.location,
      bio: body.bio,
      skillsToTeach: body.skillsToTeach,
      skillsToLearn: body.skillsToLearn,
      userid: user.id,
      image: body?.image || null,
    });

    const savedProfile = await newProfile.save();
    return res.status(200).json(savedProfile);
  } catch (err) {
    return res.status(500).json({ error: "internal server error" });
  }
};

const updateProfile = async (req: Request, res: Response) => {
  try {
    const updatedFields = req.body;
    // Change req.params.id to req.params.userid
    const userid = req.params.userid;
    const user = await getUser(req);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { userid: userid },
      updatedFields,
      { new: true }
    );

    if (!updatedProfile) {
      return res
        .status(404)
        .json({ error: "profile not found or unauthorized" });
    }

    return res.status(200).json(updatedProfile);
  } catch (err) {
    return res.status(500).json({ error: "internal server error" });
  }
};

export default { getProfile, createProfile, allProfile, updateProfile };
