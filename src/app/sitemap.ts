import { MetadataRoute } from 'next';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/models/Blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://buddha-dharma-sutra.app';

  // Define static routes
  const staticRoutes = [
    '',
    '/about',
    '/mission',
    '/library',
    '/donate',
    '/sutras',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch dynamic routes
  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    await connectToDatabase();
    
    // Fetch all published blogs
    const blogs = await Blog.find({ status: 'published' }).select('slug updatedAt').lean();
    
    const blogRoutes = blogs.map((blog: any) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: blog.updatedAt || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    dynamicRoutes = [...blogRoutes];
  } catch (error) {
    console.error('Error fetching dynamic routes for sitemap:', error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
