"use client";

import { useEffect, useState } from "react";

export default function DebugEnvPage() {
    const [serverEnv, setServerEnv] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/debug-env")
            .then((res) => res.json())
            .then((data) => {
                setServerEnv(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const clientKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    return (
        <div className="min-h-screen bg-black text-white p-10 font-mono">
            <h1 className="text-3xl font-bold mb-8 text-red-500">
                Environment Variable Debugger
            </h1>

            <div className="grid gap-8 md:grid-cols-2">
                <div className="border border-white/20 p-6 rounded bg-white/5">
                    <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">
                        CLIENT-SIDE (Browser)
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-gray-400 text-sm">NEXT_PUBLIC_RAZORPAY_KEY_ID</p>
                            <p className={`text-lg ${clientKey ? "text-green-400" : "text-red-500"}`}>
                                {clientKey
                                    ? `Present (${clientKey.substring(0, 8)}...)`
                                    : "MISSING"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border border-white/20 p-6 rounded bg-white/5">
                    <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">
                        SERVER-SIDE (API Route)
                    </h2>
                    {loading ? (
                        <p className="animate-pulse">Loading server status...</p>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <p className="text-gray-400 text-sm">RAZORPAY_KEY_ID</p>
                                <p className={`text-lg ${serverEnv?.RAZORPAY_KEY_ID?.startsWith("Present") ? "text-green-400" : "text-red-500"}`}>
                                    {serverEnv?.RAZORPAY_KEY_ID}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">RAZORPAY_KEY_SECRET</p>
                                <p className={`text-lg ${serverEnv?.RAZORPAY_KEY_SECRET?.startsWith("Present") ? "text-green-400" : "text-red-500"}`}>
                                    {serverEnv?.RAZORPAY_KEY_SECRET}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">VERCEL_ENV</p>
                                <p className="text-blue-400">{serverEnv?.VERCEL_ENV}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-10 p-4 bg-yellow-900/30 border border-yellow-700/50 rounded text-yellow-200 text-sm">
                Warning: This page exposes configuration status. Delete after debugging.
            </div>
        </div>
    );
}
