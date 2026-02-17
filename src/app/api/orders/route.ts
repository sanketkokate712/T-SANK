import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(ORDERS_FILE)) {
        fs.writeFileSync(ORDERS_FILE, "[]", "utf-8");
    }
}

function readOrders() {
    ensureDataDir();
    try {
        const raw = fs.readFileSync(ORDERS_FILE, "utf-8");
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function writeOrders(orders: unknown[]) {
    ensureDataDir();
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

// GET — fetch all orders
export async function GET() {
    const orders = readOrders();
    return NextResponse.json(orders);
}

// POST — add a new order
export async function POST(req: NextRequest) {
    try {
        const order = await req.json();
        const orders = readOrders();
        orders.unshift(order);
        writeOrders(orders);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
    }
}

// PATCH — update order status
export async function PATCH(req: NextRequest) {
    try {
        const { orderId, status } = await req.json();
        const orders = readOrders();
        const idx = orders.findIndex((o: { id: string }) => o.id === orderId);
        if (idx === -1) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }
        orders[idx].status = status;
        writeOrders(orders);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
}
