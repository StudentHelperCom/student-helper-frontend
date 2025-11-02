import Image from "next/image";
import React from "react";

export default function NotFound() {
  return (
    <main className="not-found">
      <Image src="/images/404.png" className="not-found__404" alt="404" width={2000} height={1000} draggable={false} />
      <span className="not-found__subtitle">Oops! Page not found.</span>
    </main>
  )
}