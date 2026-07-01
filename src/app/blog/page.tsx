import connectToDatabase from "@/lib/mongodb";
import Blog from "@/models/Blog";
import User from "@/models/User";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Insights & Articles | Buddha Dharma Sutra",
  description: "Read profound insights and articles written by our community on the path of Dharma.",
};

async function getPublishedBlogs() {
  await connectToDatabase();
  require("@/models/User");
  
  const blogs = await Blog.find({ status: "published" })
    .populate("authorId", "name image")
    .sort({ createdAt: -1 });
    
  return JSON.parse(JSON.stringify(blogs));
}

export default async function BlogsPage() {
  const blogs = await getPublishedBlogs();

  return (
    <div className="min-h-screen bg-white">
      {/* Editorial Header */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-12 border-b border-gray-200">
        <div className="flex flex-col items-center text-center">
          <span className="text-accent uppercase tracking-[0.3em] text-xs font-bold mb-4">Community Voices</span>
          <h1 className="text-5xl md:text-6xl font-serif text-gray-900 mb-4 tracking-tighter">Dharma Insights</h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl font-serif italic leading-relaxed">
            Read articles, reflections, and insights shared by our community of practitioners and scholars.
          </p>
        </div>
      </div>

      {/* Blogs List - Minimalist Table/Row Style */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {blogs.length === 0 ? (
          <div className="text-center py-32">
            <h3 className="text-3xl font-serif text-gray-400 italic">No articles published yet.</h3>
          </div>
        ) : (
          <div className="flex flex-col">
            {blogs.map((blog: any, index: number) => (
              <Link href={`/blog/${blog.slug}`} key={blog._id} className="group block border-b border-gray-100 last:border-0 py-12 transition-all duration-500 hover:bg-gray-50/50">
                <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-12 px-4 md:px-8">
                  {/* Number */}
                  <div className="text-gray-300 font-serif text-3xl italic w-12 shrink-0 group-hover:text-accent transition-colors duration-500">
                    {(index + 1).toString().padStart(2, '0')}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4 group-hover:text-primary transition-colors duration-500 leading-tight">
                      {blog.titleEn}
                    </h2>
                    <p className="text-lg md:text-xl font-serif text-gray-500 italic mb-6 line-clamp-2 leading-relaxed">
                      {blog.contentEn}
                    </p>
                    
                    <div className="flex items-center gap-6 mt-6">
                      <div className="flex items-center gap-3">
                        {blog.authorId?.image ? (
                          <img src={blog.authorId.image} alt={blog.authorId.name} className="w-8 h-8 rounded-full border border-gray-200" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                            {blog.authorId?.name?.charAt(0) || "U"}
                          </div>
                        )}
                        <div>
                          <span className="block text-xs font-bold text-gray-800 uppercase tracking-wider">{blog.authorId?.name}</span>
                          <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                            {new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1" />
                      
                      <span className="text-primary text-xs font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-500 flex items-center gap-2">
                        Read Article <ArrowRight size={14} />
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
