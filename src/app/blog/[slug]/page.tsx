import connectToDatabase from "@/lib/mongodb";
import Blog from "@/models/Blog";
import User from "@/models/User";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Quote, PenTool } from "lucide-react";
import ReadingProgress from "@/components/ReadingProgress";
import ShareButtons from "@/components/ShareButtons";
import BlogInteractions from "@/components/BlogInteractions";
import { Metadata } from "next";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://buddha-dharma-sutra.app";
  const ogImageUrl = blog.authorId?.image || `${siteUrl}/icon.png`;

  return {
    title: blog.titleEn,
    description: blog.contentEn.substring(0, 160) + "...",
    openGraph: {
      title: blog.titleEn,
      description: blog.contentEn.substring(0, 160) + "...",
      type: "article",
      url: `${siteUrl}/blog/${slug}`,
      images: [
        {
          url: ogImageUrl,
          width: 800,
          height: 600,
          alt: blog.titleEn,
        },
      ],
    },
  };
}

async function getBlog(slug: string) {
  await connectToDatabase();
  require("@/models/User");

  const blog = await Blog.findOne({ slug, status: "published" }).populate("authorId", "name image");
  if (!blog) return null;
  return JSON.parse(JSON.stringify(blog));
}

export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  const session = await getServerSession();
  let userId = null;
  if (session?.user?.email) {
    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    if (user) userId = user._id.toString();
  }

  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://buddha-dharma-sutra.app";
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.titleEn,
    "description": blog.contentEn.substring(0, 160) + "...",
    "author": {
      "@type": "Person",
      "name": blog.authorId?.name || "Anonymous",
    },
    "datePublished": new Date(blog.createdAt).toISOString(),
    "dateModified": new Date(blog.updatedAt || blog.createdAt).toISOString(),
    "url": `${siteUrl}/blog/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />
      <div className="bg-gray-50 min-h-screen pb-24 relative overflow-hidden">
        
        {/* Decorative Background */}
        <div className="absolute top-0 w-full h-[600px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent pointer-events-none -z-10" />

        {/* Header Banner */}
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center relative">
            <Link href="/blog" className="absolute left-0 top-0 inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors bg-white/50 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-primary/10">
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Back to Insights</span>
            </Link>
            
            <div className="inline-flex items-center justify-center gap-3 mb-6 text-primary text-sm font-bold uppercase tracking-[0.2em] bg-white px-6 py-2 rounded-full shadow-sm border border-primary/20">
              <PenTool size={16} />
              <span>Community Insight</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
              {blog.titleEn}
            </h1>
            <h2 className="text-3xl md:text-4xl font-serif text-primary/80 mb-12 italic">
              {blog.titleBn}
            </h2>
            
            <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-gray-200 max-w-xl mx-auto">
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                {blog.authorId?.image ? (
                  <img src={blog.authorId.image} alt={blog.authorId.name} className="w-10 h-10 rounded-full border border-gray-100" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                    {blog.authorId?.name?.charAt(0) || "U"}
                  </div>
                )}
                <div className="text-left">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Written by</p>
                  <p className="font-bold text-gray-900 leading-tight">{blog.authorId?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-500 bg-white px-4 py-3 rounded-full shadow-sm border border-gray-100">
                <Calendar size={18} className="text-primary" />
                <span className="font-medium text-sm">{new Date(blog.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area - Beautiful Dual Pane */}
        <div className="max-w-5xl mx-auto px-4 pb-16 relative z-10">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-2xl shadow-primary/5 border border-gray-100 relative">
            
            <div className="absolute top-12 right-12 text-primary/5">
              <Quote size={120} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mt-4">
              {/* English Side */}
              <div className="relative">
                <div className="sticky top-28 bg-white/90 backdrop-blur z-20 pb-4 mb-8 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    English Version
                  </h3>
                </div>
                {/* Drop Cap for English */}
                <div className="prose prose-lg md:prose-xl prose-emerald max-w-none text-gray-800 leading-[1.8] font-serif whitespace-pre-wrap first-letter:text-7xl first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left first-letter:leading-none">
                  {blog.contentEn}
                </div>
              </div>

              {/* Bengali Side */}
              <div className="relative">
                <div className="sticky top-28 bg-white/90 backdrop-blur z-20 pb-4 mb-8 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    বাংলা সংস্করণ
                  </h3>
                </div>
                {/* Custom Styling for Bengali Font */}
                <div className="prose prose-lg md:prose-xl prose-emerald max-w-none text-gray-800 leading-[2.2] whitespace-pre-wrap font-sans text-[1.15rem]">
                  {blog.contentBn}
                </div>
              </div>
            </div>

            {/* Social Share Connect */}
            <div className="mt-16 pt-8 flex flex-col items-center">
              <p className="font-serif text-xl italic text-gray-600 text-center mb-2">Did you find this insight helpful?</p>
              <ShareButtons title={`Read this insight: ${blog.titleEn} by ${blog.authorId?.name}`} />
            </div>

            {/* Interactions */}
            <BlogInteractions 
              blogId={blog._id} 
              initialLikesCount={blog.likes?.length || 0}
              initialIsLiked={userId ? blog.likes?.includes(userId) : false}
              isLoggedIn={!!userId}
              userImage={session?.user?.image}
            />

          </div>
        </div>
      </div>
    </>
  );
}
