//src/app/admin/employees/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [employeePhone, setEmployeePhone] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
    const res = await fetch("/api/employees");
    const data = await res.json();
    setEmployees(data);
  }

  async function createEmployee(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: employeePhone }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`Employee #${data.employee.id} invited!`);
        setEmployeePhone("");
        await fetchEmployees();
      } else {
        setMessage(data.message || "Error inviting employee");
      }
    } catch (error) {
      setMessage("Network error inviting employee");
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Employees</h2>
      {message && <p className="text-blue-600 mb-4">{message}</p>}

      {/* NAVIGATION */}
      <nav className="mb-8">
        <Link href="/admin" className="text-blue-500 underline">
          Back to Orders
        </Link>
      </nav>

      {/* INVITE EMPLOYEES FORM */}
      <section className="mb-8">
        <h3 className="text-xl font-medium mb-2">Invite Employee</h3>
        <form onSubmit={createEmployee} className="space-y-4">
          <div>
            <label className="block mb-1">Employee Phone</label>
            <input
              type="text"
              className="border p-2 w-full"
              value={employeePhone}
              onChange={(e) => setEmployeePhone(e.target.value)}
              placeholder="+15550001234"
            />
          </div>
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            Invite
          </button>
        </form>
      </section>

      {/* EMPLOYEES LIST */}
      <section>
        <h3 className="text-xl font-medium mb-2">Employee List</h3>
        {employees.length === 0 ? (
          <p>No employees added.</p>
        ) : (
          <ul className="space-y-2">
            {employees.map((emp) => (
              <li key={emp.id} className="border-b pb-2">
                Employee #{emp.id} — {emp.phoneNumber}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
