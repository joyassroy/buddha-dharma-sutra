import OpenBookLayout from "@/components/OpenBookLayout";
import NoticeBanner from "@/components/NoticeBanner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Buddha Dharma Sutra, your sanctuary for Buddhist teachings, meditation resources, and sacred texts.",
};

export default function Home() {
  return (
    <main>
      <NoticeBanner />
      <OpenBookLayout>
        <div></div>
      </OpenBookLayout>
    </main>
  );
}
