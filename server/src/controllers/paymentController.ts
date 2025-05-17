// src/controllers/userController.ts
import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import ConnectionRequest from "../model/ConnectionRequest";
const createPayments = async (req: Request, res: Response) => {
  const { id, amount, email, first_name, last_name, user } = req.body;
  const CHAPA_URL =
    process.env.CHAPA_URL || "https://api.chapa.co/v1/transaction/initialize";
  const CHAPA_AUTH =
    process.env.CHAPA_AUTH || "CHASECK_TEST-aDExemKF0gxrojDgFodIXww2a9KEATMh";

  const config = {
    headers: {
      Authorization: `Bearer ${CHAPA_AUTH}`,
    },
  };

  try {
    // Unique transaction reference
    const TEXT_REF = "tx-Servicece12345-" + Date.now();
    const CALLBACK_URL = "http://localhost:5000/api/verify-payment/";
    const RETURN_URL = `http://localhost:8080/connections/?receiver=${user}&tx_ref=${encodeURIComponent(
      TEXT_REF
    )}`;

    // Form data
    const data = {
      amount: amount,
      currency: "ETB",
      email: email,
      first_name: first_name,
      last_name: last_name,
      tx_ref: TEXT_REF,
      callback_url: CALLBACK_URL + TEXT_REF,
      return_url: RETURN_URL,
    };
    console.log("Data to be TEXT_REF:", TEXT_REF);
    // Post request to Chapa
    const response = await axios.post(CHAPA_URL, data, config);
    res.json({ checkout_url: response.data.data.checkout_url });
  } catch (err) {
    console.log("Error processing payment:", err);
    res.status(500).json({ message: "Error processing payment" });
  }
};

const verifyPayment = async (req: Request, res: Response) => {
  try {
    // Get sender and receiver from query parameters instead of body for GET request
    const { sender, receiver } = req.query;
    console.log("Sender from node:", sender);
    console.log("Receiver from node:", receiver);

    // Verify transaction with Chapa
    const CHAPA_AUTH =
      process.env.CHAPA_AUTH || "CHASECK_TEST-aDExemKF0gxrojDgFodIXww2a9KEATMh";

    const config = {
      headers: {
        Authorization: `Bearer ${CHAPA_AUTH}`,
      },
    };

    // Verify transaction with Chapa
    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${req.params.id}`,
      config
    );

    if (response.data.status === "success") {
      // Find and update the connection request if it exists
      await ConnectionRequest.findOneAndUpdate(
        {
          sender: sender,
          receiver: receiver,
        },
        { payments: true }
      );
      res.json({
        message: "Payment verified successfully",
        data: response.data,
      });
    } else {
      res
        .status(400)
        .json({ message: "Payment verification failed", data: response.data });
    }
  } catch (err) {
    console.log("Payment verification error:", err);
    res.status(500).json({ message: "Error verifying payment", error: err });
  }
};

export default { createPayments, verifyPayment };
