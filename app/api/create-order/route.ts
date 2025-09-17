import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { amount } = await req.json();

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,       // secret key here
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const order = await razorpay.orders.create({
    amount,        
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    payment_capture: true,   
  });

  return NextResponse.json(order);
}
