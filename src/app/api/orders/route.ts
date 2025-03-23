// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { orders, createOrder, findUserByPhone } from "@/lib/data-store";

export async function GET(req: NextRequest) {
  // 1. Get phoneNumber from cookies
  const phoneNumber = req.cookies.get("phoneNumber")?.value;
  if (!phoneNumber) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  // 2. Find user => get orgId
  const user = findUserByPhone(phoneNumber);
  if (!user) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  // 3. Filter orders for that org
  const userOrders = orders.filter((o) => o.orgId === user.orgId);
  return NextResponse.json(userOrders);
}

export async function POST(req: NextRequest) {
  // Similar flow
  const phoneNumber = req.cookies.get("phoneNumber")?.value;
  if (!phoneNumber) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const user = findUserByPhone(phoneNumber);
  if (!user) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const { customerPhone, description } = await req.json();
  const newOrder = createOrder(user.orgId, customerPhone, description || "");
  return NextResponse.json({ success: true, order: newOrder });
}
