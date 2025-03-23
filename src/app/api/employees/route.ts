// src/app/api/employees/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  employees,
  createEmployee,
  findUserByPhone,
} from "@/lib/data-store";

/**
 * GET /api/employees
 * - Returns the list of employees for the current user's organization
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Check session cookie
    const phoneNumber = request.cookies.get("phoneNumber")?.value;
    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // 2. Find the user => get orgId
    const user = findUserByPhone(phoneNumber);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 401 }
      );
    }

    // 3. Filter employees by orgId
    const orgEmployees = employees.filter((emp) => emp.orgId === user.orgId);

    return NextResponse.json(orgEmployees);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/employees
 * - Invite/create a new employee (by phone)
 * - The new employee belongs to the same org as the current user
 *   (In a real system, you'd also consider if employees themselves can log in)
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Check session cookie
    const phoneNumber = request.cookies.get("phoneNumber")?.value;
    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // 2. Find user => must be MASTER_ADMIN
    const user = findUserByPhone(phoneNumber);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 401 }
      );
    }
    if (user.role !== "MASTER_ADMIN") {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      );
    }

    // 3. Parse request body
    const body = await request.json();
    const { employeePhone } = body;
    if (!employeePhone) {
      return NextResponse.json(
        { success: false, message: "employeePhone is required" },
        { status: 400 }
      );
    }

    // 4. Create the employee in the same org
    const newEmp = createEmployee(user.orgId, employeePhone);

    return NextResponse.json({
      success: true,
      employee: newEmp,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
