import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(req: NextRequest) {
    try {
        const { amount, currency = "INR", receipt } = await req.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        const order = await razorpay.orders.create({
            amount: Math.round(amount * 100), // Razorpay expects paise
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
        });

        return NextResponse.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error: unknown) {
        console.error("Razorpay create-order error:", error);
        const message = error instanceof Error ? error.message : "Order creation failed";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
