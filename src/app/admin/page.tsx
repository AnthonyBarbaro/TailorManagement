// src/app/admin/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminPage() {
  // This page is only accessible if we have "phoneNumber" cookie (see middleware)
  // We'll still do our normal logic to handle orders.

  const [orders, setOrders] = useState<any[]>([]);
  const [customerPhone, setCustomerPhone] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
  }

  async function createOrder(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerPhone, description }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`Order #${data.order.id} created!`);
        setCustomerPhone("");
        setDescription("");
        await fetchOrders();
      } else {
        setMessage(data.message || "Error creating order");
      }
    } catch (error) {
      setMessage("Network error creating order");
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Portal</h2>
      {message && <p className="text-blue-600 mb-4">{message}</p>}

      {/* NAVIGATION */}
      <nav className="mb-8">
        <Link href="/admin/employees" className="text-blue-500 underline mr-4">
          Manage Employees
        </Link>
        <Link href="/login" className="text-red-500 underline">
          Logout (clear cookie manually if you'd like)
        </Link>
      </nav>

      {/* CREATE ORDER */}
      <section className="mb-8">
        <h3 className="text-xl font-medium mb-2">Create New Order</h3>
        <form onSubmit={createOrder} className="space-y-4">
          <div>
            <label className="block mb-1">Customer Phone</label>
            <input
              type="text"
              className="border p-2 w-full"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+15550001234"
            />
          </div>
          <div>
            <label className="block mb-1">Description</label>
            <textarea
              className="border p-2 w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Suit alteration, length adjustments, etc."
            />
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Create Order
          </button>
        </form>
      </section>

      {/* ORDERS LIST */}
      <section>
        <h3 className="text-xl font-medium mb-2">Existing Orders</h3>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <ul className="space-y-2">
            {orders.map((order) => (
              <li key={order.id} className="border-b pb-2">
                <strong>Order #{order.id}</strong> <br />
                Customer: {order.customerPhone} <br />
                Desc: {order.description} <br />
                Status: {order.status}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
