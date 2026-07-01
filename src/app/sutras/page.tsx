import connectToDatabase from "@/lib/mongodb";
import Sutra from "@/models/Sutra";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sacred Sutras | Buddha Dharma Sutra",
  description: "Read and explore the sacred teachings of the Buddha in English and Bengali.",
};

async function getSutras() {
  await connectToDatabase();
  const sutras = await Sutra.find({}).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(sutras));
}

export default async function SutrasPage() {
  const sutras = await getSutras();

  return (
    <div className="min-h-screen bg-white">
      {/* Editorial Header */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-12 border-b border-gray-200">
        <div className="flex flex-col items-center text-center">
          <span className="text-accent uppercase tracking-[0.3em] text-xs font-bold mb-4">Library of Wisdom</span>
          <h1 className="text-5xl md:text-6xl font-serif text-gray-900 mb-4 tracking-tighter">The Sacred Sutras</h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl font-serif italic leading-relaxed">
            Explore the profound teachings of the Buddha. These timeless discourses offer guidance on the path to liberation and inner peace.
          </p>
        </div>
      </div>

      {/* Sutras List - Minimalist Table/Row Style */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {sutras.length === 0 ? (
          <div className="text-center py-32">
            <h3 className="text-3xl font-serif text-gray-400 italic">No sutras have been added yet.</h3>
          </div>
        ) : (
          <div className="flex flex-col">
            {sutras.map((sutra: any, index: number) => (
              <Link href={`/sutras/${sutra.slug}`} key={sutra._id} className="group block border-b border-gray-100 last:border-0 py-12 transition-all duration-500 hover:bg-gray-50/50">
                <div className="flex flex-col md:flex-row md:items-baseline gap-6 md:gap-12 px-4 md:px-8">
                  {/* Number */}
                  <div className="text-gray-300 font-serif text-3xl italic w-12 shrink-0 group-hover:text-accent transition-colors duration-500">
                    {(index + 1).toString().padStart(2, '0')}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-3 group-hover:text-primary transition-colors duration-500 leading-tight">
                      {sutra.titleEn}
                    </h2>
                    <h3 className="text-xl md:text-2xl font-serif text-gray-500 italic mb-6">
                      {sutra.titleBn}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                      <span>Source: {sutra.source}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="text-primary group-hover:translate-x-2 transition-transform duration-500 flex items-center gap-2">
                        Read Text <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
