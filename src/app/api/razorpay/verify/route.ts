import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
            .update(body)
            .digest("hex");

        const isValid = expectedSignature === razorpay_signature;

        if (isValid) {
            // In production: save order to DB here
            return NextResponse.json({ verified: true, payment_id: razorpay_payment_id });
        } else {
            return NextResponse.json({ verified: false, error: "Invalid signature" }, { status: 400 });
        }
    } catch (error: unknown) {
        console.error("Razorpay verify error:", error);
        const message = error instanceof Error ? error.message : "Verification failed";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
