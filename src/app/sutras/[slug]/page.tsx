import connectToDatabase from "@/lib/mongodb";
import Sutra from "@/models/Sutra";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Quote } from "lucide-react";
import ReadingProgress from "@/components/ReadingProgress";
import ShareButtons from "@/components/ShareButtons";
import Image from "next/image";

async function getSutra(slug: string) {
  await connectToDatabase();
  const sutra = await Sutra.findOne({ slug });
  if (!sutra) return null;
  return JSON.parse(JSON.stringify(sutra));
}

export default async function SutraDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sutra = await getSutra(slug);

  if (!sutra) {
    notFound();
  }

  return (
    <>
      <ReadingProgress />
      <div className="bg-gray-50 min-h-screen pb-24 relative overflow-hidden">
        
        {/* Decorative Background */}
        <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent pointer-events-none -z-10" />
        <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none -z-10" style={{ backgroundImage: "url('/logo.png')", backgroundRepeat: "repeat", backgroundSize: "400px" }} />

        {/* Header Banner */}
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center relative">
            <Link href="/sutras" className="absolute left-0 top-0 inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors bg-white/50 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-primary/10">
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Library</span>
            </Link>
            
            <div className="inline-flex items-center justify-center gap-3 mb-6 text-primary text-sm font-bold uppercase tracking-[0.2em] bg-white px-6 py-2 rounded-full shadow-sm border border-primary/20">
              <BookOpen size={16} />
              <span>Sacred Text</span>
            </div>
            
            {sutra.titleEn && (
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
                {sutra.titleEn}
              </h1>
            )}
            {sutra.titleBn && (
              <h2 className="text-3xl md:text-4xl font-serif text-primary/80 mb-8 italic">
                {sutra.titleBn}
              </h2>
            )}
            
            <div className="flex items-center justify-center gap-4">
              <div className="h-px bg-gray-300 w-16" />
              <div className="text-gray-500 font-serif italic text-lg bg-white/80 px-4 py-1 rounded-full shadow-sm border border-gray-100">
                Source: {sutra.source}
              </div>
              <div className="h-px bg-gray-300 w-16" />
            </div>
          </div>
        </div>

        {/* Content Area - Beautiful Dual Pane */}
        <div className="max-w-5xl mx-auto px-4 pb-16 relative z-10">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-2xl shadow-primary/5 border border-gray-100 relative">
            
            <div className="absolute top-12 left-1/2 -translate-x-1/2 text-primary/10">
              <Quote size={80} />
            </div>

            <div className={`grid grid-cols-1 ${sutra.contentEn && sutra.contentBn ? 'lg:grid-cols-2' : ''} gap-12 lg:gap-20 mt-8`}>
              {/* English Side */}
              {sutra.contentEn && (
                <div className="relative">
                  <div className="sticky top-28 bg-white/90 backdrop-blur z-20 pb-4 mb-8 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      English Translation
                    </h3>
                  </div>
                  {/* Drop Cap for English */}
                  <div className="prose prose-lg md:prose-xl prose-emerald max-w-none text-gray-800 leading-[1.8] font-serif whitespace-pre-wrap first-letter:text-7xl first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left first-letter:leading-none">
                    {sutra.contentEn}
                  </div>
                </div>
              )}

              {/* Bengali Side */}
              {sutra.contentBn && (
                <div className="relative">
                  <div className="sticky top-28 bg-white/90 backdrop-blur z-20 pb-4 mb-8 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      বাংলা অনুবাদ
                    </h3>
                  </div>
                  {/* Custom Styling for Bengali Font */}
                  <div className="prose prose-lg md:prose-xl prose-emerald max-w-none text-gray-800 leading-[2.2] whitespace-pre-wrap font-sans text-[1.15rem]">
                    {sutra.contentBn}
                  </div>
                </div>
              )}
            </div>

            {/* Social Share Connect */}
            <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col items-center">
              <p className="font-serif text-xl italic text-gray-600 text-center mb-2">May this teaching bring you peace.</p>
              <ShareButtons title={`Read: ${sutra.titleEn} | ${sutra.titleBn}`} />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
