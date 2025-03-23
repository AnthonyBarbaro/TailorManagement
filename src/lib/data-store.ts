// src/lib/data-store.ts

/**
 * Represent an organization (client).
 * Each org can have one "master admin" user and multiple employees.
 */
export interface Org {
    id: number;
    name: string;
    createdAt: Date;
  }
  
  /**
   * Represents a user in the system.
   * Could be a MASTER_ADMIN (client) or an EMPLOYEE (if employees also log in).
   */
  export interface User {
    phoneNumber: string;
    role: "MASTER_ADMIN" | "EMPLOYEE";
    orgId: number; // which organization they belong to
  }
  
  /**
   * Represents an order made by the organization for a customer.
   */
  export interface Order {
    id: number;
    orgId: number;       // which organization this order belongs to
    customerPhone: string;
    description: string;
    status: string;      // e.g., "pending", "completed", etc.
    createdAt: Date;
  }
  
  /**
   * Represents an employee who may or may not log in.
   * Often you'd merge this into 'User' if employees need to log in.
   */
  export interface Employee {
    phoneNumber: string;
    orgId: number;
    addedAt: Date;
  }
  
  /* ------------------------------------------------------------------
     In-memory storage (for demo).
     In production, use a real database and ORM (e.g., Prisma).
  ------------------------------------------------------------------- */
  
  export const orgs: Org[] = [];
  export const users: User[] = [];
  export const orders: Order[] = [];
  export const employees: Employee[] = [];
  
  /* ------------------------------------------------------------------
     Auto-increment counters
  ------------------------------------------------------------------- */
  let orgCounter = 1;
  let orderCounter = 1;
  
  /* ------------------------------------------------------------------
     Example: Pre-populate with one Org and one MASTER_ADMIN user.
     Remove or adjust as needed.
  ------------------------------------------------------------------- */
  
  orgs.push({
    id: orgCounter,
    name: "Demo Client",
    createdAt: new Date(),
  });
  users.push({
    phoneNumber: "+16195362504",
    role: "MASTER_ADMIN",
    orgId: 1,
  });
  orgCounter++;
  
  /* ------------------------------------------------------------------
     Utility Functions
  ------------------------------------------------------------------- */
  
  /**
   * Find a user by phone number.
   */
  export function findUserByPhone(phoneNumber: string): User | undefined {
    return users.find((u) => u.phoneNumber === phoneNumber);
  }
  
  /**
   * Create a new organization (client).
   * Returns the created Org object.
   */
  export function createOrg(name: string): Org {
    const newOrg: Org = {
      id: orgCounter++,
      name,
      createdAt: new Date(),
    };
    orgs.push(newOrg);
    return newOrg;
  }
  
  /**
   * Create an employee record for an existing org.
   * Often you'd just store them as Users if employees need to log in.
   */
  export function createEmployee(orgId: number, phoneNumber: string): Employee {
    const emp: Employee = {
      phoneNumber,
      orgId,
      addedAt: new Date(),
    };
    employees.push(emp);
    return emp;
  }
  
  /**
   * Create a new order for a given organization.
   */
  export function createOrder(orgId: number, customerPhone: string, description: string): Order {
    const newOrder: Order = {
      id: orderCounter++,
      orgId,
      customerPhone,
      description,
      status: "pending",
      createdAt: new Date(),
    };
    orders.push(newOrder);
    return newOrder;
  }
  
  /**
   * Get all orders for a specific org.
   */
  export function getOrdersByOrgId(orgId: number): Order[] {
    return orders.filter((o) => o.orgId === orgId);
  }
  
  /**
   * Get all employees for a specific org.
   */
  export function getEmployeesByOrgId(orgId: number): Employee[] {
    return employees.filter((emp) => emp.orgId === orgId);
  }
  