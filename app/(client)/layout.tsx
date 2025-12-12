import React from "react";
import Navbar from "./_components/navbar";
import Footer from "./_components/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden">
      <Navbar />
      <div className="">{children}</div>
      <Footer />
    </div>
  );
}
