import connectToDatabase from "@/lib/mongodb";
import Book from "@/models/Book";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Library as LibraryIcon } from "lucide-react";
import BookAccessManager from "@/components/BookAccessManager";

async function getBook(slug: string) {
  await connectToDatabase();
  const book = await Book.findOne({ slug });
  if (!book) return null;
  return JSON.parse(JSON.stringify(book));
}

function getEmbedUrl(url: string) {
  try {
    if (!url) return "";
    
    // Check if it's a Google Drive link and extract the ID safely
    if (url.includes("drive.google.com")) {
      const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) {
        return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
      }
    }
    
    // For direct PDF links (like Cloudinary), wrap in Google Docs Viewer for mobile compatibility
    // Mobile browsers (iOS Safari, Android Chrome) cannot render PDFs directly in an iframe.
    if (url.toLowerCase().endsWith(".pdf")) {
      return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
    }
    
    // Fallback
    return url;
  } catch {
    return url;
  }
}

export default async function BookDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = await getBook(slug);

  if (!book) {
    notFound();
  }

  const embedUrl = getEmbedUrl(book.fileUrl);

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header Banner */}
      <div className="pt-24 pb-12 px-6 border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-6xl mx-auto relative flex flex-col md:flex-row gap-10 items-center md:items-start">
          
          <Link href="/library" className="absolute left-0 -top-12 inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-primary/10">
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back to Library</span>
          </Link>

          {/* Book Cover */}
          <div className="w-48 shrink-0">
            <div className="aspect-[3/4] rounded-lg overflow-hidden bg-white shadow-xl shadow-black/10 border border-gray-200">
              {book.coverImage ? (
                <img src={book.coverImage} alt={book.titleEn} className="w-full h-full object-contain p-2" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 p-4 text-center">
                  <LibraryIcon size={32} className="text-primary/30 mb-2" />
                  <span className="font-serif text-sm font-bold text-gray-900">{book.titleEn}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Book Info */}
          <div className="flex-1 text-center md:text-left pt-4">
            <div className="inline-flex items-center justify-center md:justify-start gap-2 mb-4 text-accent text-xs font-bold uppercase tracking-[0.2em]">
              <BookOpen size={14} />
              <span>e-Book</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-3 leading-tight tracking-tight">
              {book.titleEn}
            </h1>
            {book.titleBn && (
              <h2 className="text-2xl md:text-3xl font-serif text-gray-500 mb-6 italic">
                {book.titleBn}
              </h2>
            )}
            
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8 text-sm">
              <div className="flex items-center gap-2 font-medium text-gray-700 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                <span className="text-gray-400 uppercase tracking-widest text-[10px]">Author</span>
                <span>{book.author}</span>
              </div>
            </div>

            {book.description && (
              <p className="text-gray-600 font-serif italic text-lg leading-relaxed max-w-2xl mb-8">
                {book.description}
              </p>
            )}

            <BookAccessManager fileUrl={book.fileUrl} embedUrl={embedUrl} />
          </div>

        </div>
      </div>
    </div>
  );
}
