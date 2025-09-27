// app/api/create-subscription/route.ts
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { planId } = body;

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 12, // e.g. 12 months
    });

    return new Response(JSON.stringify(subscription), { status: 200 });
  } catch (err: any) {
    console.error("Error creating subscription:", err);
    return new Response(JSON.stringify({ error: "Failed to create subscription" }), { status: 500 });
  }
}
