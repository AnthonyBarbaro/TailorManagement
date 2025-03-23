"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  async function handleSendOtp() {
    setMessage("");
    try {
      const res = await fetch("/api/twilio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setMessage("OTP sent, please check your SMS.");
      } else {
        setMessage(data.message || "Phone not recognized");
      }
    } catch (error) {
      setMessage("Network error sending OTP.");
    }
  }

  async function handleVerifyOtp() {
    setMessage("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, code }),
      });
      const data = await res.json();
      if (data.success) {
        // On success, we can redirect to admin page
        router.push("/admin");
      } else {
        setMessage(data.message || "Invalid code");
      }
    } catch (error) {
      setMessage("Network error verifying OTP.");
    }
  }

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-4">Master Admin Login</h2>
      {message && <p className="text-red-500 mb-4">{message}</p>}

      {!otpSent && (
        <>
          <label className="block mb-1 font-medium">Phone Number</label>
          <input
            className="border p-2 w-full mb-4"
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+15550001111"
          />
          <button
            onClick={handleSendOtp}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Send OTP
          </button>
        </>
      )}

      {otpSent && (
        <>
          <label className="block mb-1 font-medium">Enter OTP Code</label>
          <input
            className="border p-2 w-full mb-4"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
          />
          <button
            onClick={handleVerifyOtp}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Verify OTP
          </button>
        </>
      )}
    </div>
  );
}
