import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  // Common fields for all users
  userid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "",
  },
  profileUrl: {
    type: String,
    default: "",
  },
  phoneNum: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "pending"],
    default: "pending",
  },

  // Parent-specific fields
  childrenCount: {
    type: Number,
    default: 0,
  },
  childrenAges: {
    type: [Number],
    default: [],
  },

  // Driver-specific fields
  licenseUrl: {
    type: String,
    default: "",
  },
  carType: {
    type: String,
    default: "",
  },
  plateNum: {
    type: String,
    default: "",
  },
  drivingExperience: {
    type: Number,
    default: 0,
  },
  insuranceUrl: {
    type: String,
    default: "",
  },

  // Tutor/Nanny fields
  certifications: {
    type: [String],
    default: [],
  },
  certificationUrls: {
    type: [String],
    default: [],
  },
  school: {
    type: String,
    default: "",
  },
  educationLevel: {
    type: String,
    enum: ["highschool", "bachelors", "masters", "phd", "other"],
    default: "highschool",
  },
  educationUrl: {
    type: String,
    default: "",
  },
  experience: {
    type: Number,
    default: 0,
  },

  // Verification status
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationDate: {
    type: Date,
    default: null,
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
profileSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Profile = mongoose.model("Profile", profileSchema, "profiles");

export default Profile;
