import { Request, Response } from "express";
import ConnectionRequest from "../model/ConnectionRequest";

const getPendingCount = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const count = await ConnectionRequest.countDocuments({
      receiver: userId,
      status: "pending",
    });
    res.json({ count });
  } catch (error) {
    res.json({ error: (error as Error).message });
  }
};

const getConnections = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const requests = await ConnectionRequest.find({
      receiver: userId,
      status: "pending",
    }).populate("sender", "name title");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
const getacceptedConnections = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const requests = await ConnectionRequest.find({
      receiver: userId,
      status: "accepted",
    }).populate("sender", "name title");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
const getacceptedbyConnections = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const requests = await ConnectionRequest.find({
      sender: userId,
      status: "accepted",
    }).populate("sender", "name title");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const respondToRequest = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params; // receiver
    const { senderId, action } = req.body; // sender and action ('accept', 'reject', or 'complete')

    if (!["accept", "reject", "complete"].includes(action)) {
      return res.status(400).json({ message: "Invalid action specified." });
    }

    if (action === "accept") {
      // Find and update pending request to accepted
      const connectionRequest = await ConnectionRequest.findOneAndUpdate(
        {
          sender: senderId,
          receiver: userId,
          status: "pending",
        },
        { status: "accepted" },
        { new: true }
      );

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Pending connection request not found." });
      }
    } else if (action === "reject") {
      // Find and delete pending request
      const deletedRequest = await ConnectionRequest.findOneAndDelete({
        sender: senderId,
        receiver: userId,
        status: "pending",
      });

      if (!deletedRequest) {
        return res
          .status(404)
          .json({ message: "Pending connection request not found." });
      }
    } else if (action === "complete") {
      // Delete connection in both directions
      const deleteResults = await Promise.all([
        ConnectionRequest.findOneAndDelete({
          sender: senderId,
          receiver: userId,
          status: "accepted",
        }),
        ConnectionRequest.findOneAndDelete({
          sender: userId,
          receiver: senderId,
          status: "accepted",
        }),
      ]);

      // Check if at least one connection was found and deleted
      const wasDeleted = deleteResults.some((result) => result !== null);
      if (!wasDeleted) {
        return res.status(404).json({
          message: "No accepted connection requests found between these users.",
        });
      }
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
const requestToconnect = async (req: Request, res: Response) => {
  const { userId } = req.params; // sender
  const { action, image } = req.body;
  console.log("action ", action, "image ", image);

  // Check if a request already exists
  const existingRequest = await ConnectionRequest.findOne({
    sender: userId,
    receiver: action,
    status: "pending",
  });

  if (existingRequest) {
    return res.json({ message: "Request already sent." });
  }
  // Check if a request already exists
  const existingRequests = await ConnectionRequest.findOne({
    sender: action,
    receiver: userId,
    status: "pending",
  });

  if (existingRequests) {
    return res.json({ message: "Request already sent." });
  }
  // Check if a request already exists
  const acceptexistingRequest = await ConnectionRequest.findOne({
    sender: userId,
    receiver: action,
    status: "accepted",
  });

  if (acceptexistingRequest) {
    return res.json({ message: "you are already connected!" });
  }
  // Check if a request already exists
  const acceptexistingRequestby = await ConnectionRequest.findOne({
    sender: action,
    receiver: userId,
    status: "accepted",
  });

  if (acceptexistingRequestby) {
    return res.json({ message: "you are already connected!" });
  }

  try {
    const newRequest = new ConnectionRequest({
      sender: userId,
      receiver: action,
      status: "pending",
      images: image,
    });

    await newRequest.save();
    res.json({
      message: "successfuly requested",
      success: true,
      request: newRequest,
    });
  } catch (error) {
    res.json({ error: (error as Error).message });
  }
};
export default {
  getPendingCount,
  getConnections,
  respondToRequest,
  requestToconnect,
  getacceptedConnections,
  getacceptedbyConnections,
};
