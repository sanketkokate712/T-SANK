import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
    try {
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            return NextResponse.json(
                { error: "Razorpay credentials not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local" },
                { status: 500 }
            );
        }

        const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

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
