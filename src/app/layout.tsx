import type { Metadata } from "next";
import "@assets/globals.scss";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: "400",
  variable: "--poppins",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Student Helper",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
