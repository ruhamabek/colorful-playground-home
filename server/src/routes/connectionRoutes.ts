import express from "express";
import connectionController from "../controllers/connectionController";

const router = express.Router();

router.get("/count/:userId", connectionController.getPendingCount);
router.post("/ask/:userId", connectionController.requestToconnect);
router.get("/:userId", connectionController.getConnections);
router.get("/accept/:userId", connectionController.getacceptedConnections);
router.get("/acceptby/:userId", connectionController.getacceptedbyConnections);
router.put("/res/:userId", connectionController.respondToRequest);

export default router;
