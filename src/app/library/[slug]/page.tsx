import connectToDatabase from "@/lib/mongodb";
import Book from "@/models/Book";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Download, Library as LibraryIcon } from "lucide-react";

async function getBook(slug: string) {
  await connectToDatabase();
  const book = await Book.findOne({ slug });
  if (!book) return null;
  return JSON.parse(JSON.stringify(book));
}

function getEmbedUrl(url: string) {
  try {
    // If it's a Google Drive URL (web view format)
    if (url.includes("drive.google.com/file/d/")) {
      const match = url.match(/\/d\/(.*?)\//);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }
    // If it's a Google Drive URL (direct uc format)
    if (url.includes("drive.google.com/uc?id=")) {
      const urlObj = new URL(url);
      const id = urlObj.searchParams.get("id");
      if (id) {
        return `https://drive.google.com/file/d/${id}/preview`;
      }
    }
    // If it's a PDF (like from Cloudinary), use Google gview to bypass iframe restrictions
    if (url.toLowerCase().endsWith(".pdf")) {
      return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
    }
    
    // Fallback for other URLs
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
                <img src={book.coverImage} alt={book.titleEn} className="w-full h-full object-cover" />
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

            <div className="flex items-center justify-center md:justify-start gap-4">
              <a 
                href={book.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-primary/20"
              >
                <Download size={18} />
                Download PDF
              </a>
              <a 
                href="#reader" 
                className="inline-flex items-center gap-2 bg-white text-gray-800 px-6 py-3 rounded-full font-bold hover:bg-gray-50 transition-colors shadow-sm border border-gray-200"
              >
                <BookOpen size={18} />
                Read Online
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* PDF Reader Area */}
      <div id="reader" className="max-w-6xl mx-auto px-0 md:px-6 py-12 md:py-20">
        <div className="flex items-center gap-4 mb-8 px-6 md:px-0">
          <div className="h-px bg-gray-200 flex-1" />
          <h3 className="font-serif text-xl md:text-2xl text-gray-400 italic">Reading Viewer</h3>
          <div className="h-px bg-gray-200 flex-1" />
        </div>
        
        <div className="bg-gray-50 md:bg-gray-100 md:rounded-[2rem] md:p-6 lg:p-8 md:shadow-inner border-y md:border border-gray-200">
          <div className="h-[75vh] md:h-[85vh] w-full md:rounded-2xl overflow-hidden bg-white shadow-sm md:shadow-md relative">
            {embedUrl ? (
              <iframe 
                src={embedUrl}
                className="w-full h-full border-0 absolute inset-0"
                allow="autoplay; fullscreen"
                title={`Read ${book.titleEn}`}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 font-serif px-6 text-center">
                Preview not available. Please use the download button to read this book.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
