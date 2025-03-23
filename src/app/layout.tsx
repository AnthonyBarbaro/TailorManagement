import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Tailor Management Admin",
  description: "Admin portal for orders and employees",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <header className="bg-white p-4 shadow">
          <h1 className="text-2xl font-bold">Tailor Admin</h1>
        </header>
        <main className="max-w-4xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
