import mongoose from "mongoose";

// Define the schema
const profileSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  university: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  skillsToTeach: {
    type: [String],
    required: true,
  },
  skillsToLearn: {
    type: [String],
    required: true,
  },
  userid: {
    type: String,
  },
  image: {
    type: String,
  },
});

const Profile = mongoose.model("Profile", profileSchema, "profiles");

export default Profile;
