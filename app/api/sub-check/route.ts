// pages/api/check-subscription.js

import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST (req:any, res : any) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { subId } = req.body;

    if (!subId) {
      return res.status(400).json({ message: "Subscription ID is required" });
    }

    const subscription = await razorpay.subscriptions.fetch(subId);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    
    const isActive = subscription.status === "active";

    return res.status(200).json({ active: isActive, subscription });
  } catch (error) {
    console.error("Error checking subscription:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
