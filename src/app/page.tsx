// src/app/page.tsx

import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to Tailor Management</h1>
      <p className="mb-4">
        This is a simple homepage. Click below to go to the Admin Portal:
      </p>
      <Link href="/admin" className="text-blue-500 underline">
        Admin Portal
      </Link>
    </div>
  );
}
