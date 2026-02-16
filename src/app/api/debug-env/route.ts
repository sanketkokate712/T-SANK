import { NextResponse } from "next/server";

export async function GET() {
    const vars = {
        RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID
            ? `Present (starts with ${process.env.RAZORPAY_KEY_ID.substring(0, 8)}...)`
            : "MISSING",
        RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET
            ? "Present (Hidden)"
            : "MISSING",
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_ENV: process.env.VERCEL_ENV || "Unknown",
    };

    return NextResponse.json(vars);
}
