import { Router } from "express";
import profileController from "../controllers/ProfileController";

const router = Router();
router.get("/:userid", profileController.getProfile);
router.get("/all/allprofile", profileController.allProfile);
router.post("/", profileController.createProfile);
router.put("/:userid", profileController.updateProfile);
router.put("/status/:userid", profileController.updateProfileStatus);

export default router;
