import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Loader2, FileText, Calendar, Tag, Clock, Share2, Facebook, Linkedin, Twitter, MessageCircle } from "lucide-react";
import Head from "next/head";
import { trackBlogView, trackBlogShare, trackRelatedBlogClick } from "@/lib/analytics";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  tags?: string[];
  category?: string;
  readingTime?: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function BlogDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);
  const [latestBlogs, setLatestBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug || typeof slug !== 'string') return;

      try {
        setLoading(true);
        setError(null);
        
        // First try to find by slug through the list API
        const res = await fetch('/api/blog?published=true');
        const data = await res.json();
        
        if (data.success) {
          const foundBlog = data.data.find((b: BlogPost) => b.slug === slug);
          if (foundBlog) {
            setBlog(foundBlog);
            
            // Track blog view
            trackBlogView(foundBlog._id, foundBlog.slug, foundBlog.title, foundBlog.category);
            
            // Fetch related blogs (same category or similar tags)
            const related = data.data
              .filter((b: BlogPost) => b._id !== foundBlog._id)
              .filter((b: BlogPost) => 
                b.category === foundBlog.category || 
                (b.tags && foundBlog.tags && b.tags.some(tag => foundBlog.tags?.includes(tag)))
              )
              .slice(0, 4);
            setRelatedBlogs(related);
            
            // Fetch latest blogs
            const latest = data.data
              .filter((b: BlogPost) => b._id !== foundBlog._id)
              .slice(0, 5);
            setLatestBlogs(latest);
          } else {
            setError('Blog post not found');
          }
        } else {
          setError('Failed to load blog post');
        }
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-[#1a5276]" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">{error || 'Blog post not found'}</p>
          <Link href="/blog" className="mt-4 inline-block text-[#1a5276] hover:text-[#154360]">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = blog.title;
  const shareDescription = blog.excerpt;

  const handleShare = (platform: string) => {
    const url = shareUrl;
    let shareLink = '';

    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareTitle)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${url}`)}`;
        break;
    }

    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
      // Track share event
      trackBlogShare(blog._id, blog.slug, platform);
    }
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.featuredImage,
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt,
    author: {
      '@type': 'Organization',
      name: 'KHM Infra Innovations'
    },
    publisher: {
      '@type': 'Organization',
      name: 'KHM Infra Innovations',
      logo: {
        '@type': 'ImageObject',
        url: '/khm-logo.png'
      }
    }
  };

  return (
    <>
      <Head>
        <title>{blog.title} | KHM Infra Innovations</title>
        <meta name="description" content={blog.excerpt} />
        <link rel="canonical" href={shareUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        <meta property="og:image" content={blog.featuredImage} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={blog.createdAt} />
        <meta property="article:modified_time" content={blog.updatedAt} />
        {blog.category && <meta property="article:section" content={blog.category} />}
        {blog.tags && blog.tags.map((tag, i) => (
          <meta key={i} property="article:tag" content={tag} />
        ))}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.excerpt} />
        <meta name="twitter:image" content={blog.featuredImage} />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-[#f4f6f8]">
        <div className="mx-auto flex max-w-[1400px] items-center gap-2 px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-600 lg:px-6">
          <Link href="/" className="transition-colors hover:text-[#1a5276]">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden />
          <Link href="/blog" className="transition-colors hover:text-[#1a5276]">
            Blog
          </Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden />
          <span className="text-[#1a5276]">{blog.title}</span>
        </div>
      </div>

      <article className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr,350px]">
            {/* Main Content */}
            <div className="min-w-0">
              {/* Featured Image */}
              {blog.featuredImage && (
                <div className="mb-8 overflow-hidden rounded-lg">
                  <div className="relative aspect-[16/9] w-full bg-gray-100">
                    <Image
                      src={blog.featuredImage}
                      alt={blog.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                      priority
                    />
                  </div>
                </div>
              )}

              {/* Title */}
              <h1 className="font-display text-3xl font-bold uppercase leading-tight text-[#1a5276] sm:text-4xl lg:text-5xl">
                {blog.title}
              </h1>

              {/* Meta Information */}
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
                {blog.readingTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{blog.readingTime} min read</span>
                  </div>
                )}
                {blog.category && (
                  <span className="rounded-full bg-[#1a5276] px-3 py-1 font-semibold text-white text-xs">
                    {blog.category}
                  </span>
                )}
              </div>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Social Sharing */}
              <div className="mt-6 flex items-center gap-3 border-b border-gray-200 pb-6">
                <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Share2 className="h-4 w-4" />
                  Share:
                </span>
                <button
                  onClick={() => handleShare('facebook')}
                  className="rounded-full bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="rounded-full bg-sky-500 p-2 text-white transition-colors hover:bg-sky-600"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="rounded-full bg-blue-700 p-2 text-white transition-colors hover:bg-blue-800"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="rounded-full bg-green-500 p-2 text-white transition-colors hover:bg-green-600"
                  aria-label="Share on WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </button>
              </div>

              {/* Content */}
              <div className="mt-8 prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {blog.content}
                </div>
              </div>

              {/* Back to Blog */}
              <div className="mt-12 border-t border-gray-200 pt-8">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#1a5276] transition-colors hover:text-[#154360]"
                >
                  ← Back to Blog
                </Link>
              </div>

              {/* Related Blogs */}
              {relatedBlogs.length > 0 && (
                <div className="mt-16">
                  <h2 className="mb-6 font-display text-2xl font-bold uppercase text-[#1a5276]">Related Articles</h2>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {relatedBlogs.map((relatedBlog) => (
                      <article key={relatedBlog._id} className="group flex gap-4">
                        <Link
                          href={`/blog/${relatedBlog.slug}`}
                          className="relative block flex-shrink-0 overflow-hidden aspect-square w-24 bg-gray-100"
                          onClick={() => trackRelatedBlogClick(blog._id, blog.slug, relatedBlog._id, relatedBlog.slug)}
                        >
                          <Image
                            src={relatedBlog.featuredImage}
                            alt={relatedBlog.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                            sizes="96px"
                          />
                        </Link>
                        <div className="flex-1">
                          <h3 className="font-display text-base font-bold leading-snug text-[#1a5276]">
                            <Link
                              href={`/blog/${relatedBlog.slug}`}
                              className="transition-colors hover:text-[#154360]"
                              onClick={() => trackRelatedBlogClick(blog._id, blog.slug, relatedBlog._id, relatedBlog.slug)}
                            >
                              {relatedBlog.title}
                            </Link>
                          </h3>
                          <p className="mt-2 text-xs text-gray-500">{formatDate(relatedBlog.createdAt)}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Latest Posts */}
              {latestBlogs.length > 0 && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                  <h3 className="mb-4 font-display text-lg font-bold uppercase text-[#1a5276]">Latest Posts</h3>
                  <div className="space-y-4">
                    {latestBlogs.map((latestBlog) => (
                      <article key={latestBlog._id} className="group flex gap-3">
                        <Link href={`/blog/${latestBlog.slug}`} className="relative block flex-shrink-0 overflow-hidden aspect-square w-16 bg-gray-100">
                          <Image
                            src={latestBlog.featuredImage}
                            alt={latestBlog.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                            sizes="64px"
                          />
                        </Link>
                        <div className="flex-1">
                          <h4 className="font-display text-sm font-bold leading-snug text-[#1a5276]">
                            <Link href={`/blog/${latestBlog.slug}`} className="transition-colors hover:text-[#154360]">
                              {latestBlog.title}
                            </Link>
                          </h4>
                          <p className="mt-1 text-xs text-gray-500">{formatDate(latestBlog.createdAt)}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
