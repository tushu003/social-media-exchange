import React from "react";

export default function ServiceLayout({ children }: { children: React.ReactNode }) {

  
  return (
    <div>
      <div className="container ">
        {children}
      </div>
    </div>
  );
}