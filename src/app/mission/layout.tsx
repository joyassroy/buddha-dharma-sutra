import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Mission",
  description: "Our mission is to preserve the Light of Dhamma, making the timeless wisdom of the Buddha accessible and profound for everyone.",
};

export default function MissionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
