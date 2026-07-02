import OpenBookLayout from "@/components/OpenBookLayout";
import NoticeBanner from "@/components/NoticeBanner";

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
