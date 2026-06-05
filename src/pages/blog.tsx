import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Loader2, FileText, Search, Clock } from "lucide-react";
import { BlogCta } from "@/components/BlogCta";
import { trackBlogSearch, trackPagination } from "@/lib/analytics";

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

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  const fetchBlogs = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        published: 'true',
        page: page.toString(),
        limit: '6',
      });
      
      if (search) {
        params.append('search', search);
      }
      
      const res = await fetch(`/api/blog?${params.toString()}`);
      const data = await res.json();
      
      if (data.success) {
        setBlogs(data.data);
        setPagination(data.pagination);
      } else {
        setError('Failed to load blog posts');
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(currentPage, searchQuery);
  }, [currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs(1, searchQuery);
    if (searchQuery) {
      trackBlogSearch(searchQuery);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const featuredBlog = blogs.length > 0 ? blogs[0] : null;
  const regularBlogs = blogs.length > 1 ? blogs.slice(1) : [];

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-[#f4f6f8]">
        <div className="mx-auto flex max-w-[1400px] items-center gap-2 px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-600 lg:px-6">
          <Link href="/" className="transition-colors hover:text-[#1a5276]">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden />
          <span className="text-[#1a5276]">Blog</span>
        </div>
      </div>

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
          <h1 className="text-center font-display text-2xl font-bold uppercase text-[#1a5276] sm:text-3xl">Our Blogs</h1>

          {/* Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs by title, tags, or content..."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
              />
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-[#1a5276] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#154360]"
              >
                Search
              </button>
            </form>
          </div>

          {loading ? (
            <div className="mt-10 flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#1a5276]" />
            </div>
          ) : error ? (
            <div className="mt-10 rounded-lg bg-red-50 p-6 text-center text-red-700">
              {error}
            </div>
          ) : blogs.length === 0 ? (
            <div className="mt-10 text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No Blog Posts Available</p>
              <p className="text-gray-400 text-sm mt-2">Check back later for new content</p>
            </div>
          ) : (
            <>
              {/* Featured Blog */}
              {featuredBlog && currentPage === 1 && !searchQuery && (
                <div className="mt-10">
                  <div className="mb-6 flex items-center gap-2">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-sm font-bold uppercase tracking-wide text-[#1a5276]">Featured Article</span>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>
                  <article className="group overflow-hidden rounded-lg border border-gray-200">
                    <Link href={`/blog/${featuredBlog.slug}`} className="block overflow-hidden">
                      <img
                        src={featuredBlog.featuredImage}
                        alt={featuredBlog.title}
                        loading="lazy"
                        className="h-[400px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </Link>
                    <div className="p-6 lg:p-8">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
                        {featuredBlog.category && (
                          <span className="rounded-full bg-[#1a5276] px-3 py-1 font-semibold text-white">
                            {featuredBlog.category}
                          </span>
                        )}
                        <span>{formatDate(featuredBlog.createdAt)}</span>
                        {featuredBlog.readingTime && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {featuredBlog.readingTime} min read
                            </span>
                          </>
                        )}
                      </div>
                      <h2 className="font-display text-2xl font-bold leading-tight text-[#1a5276] sm:text-3xl">
                        <Link href={`/blog/${featuredBlog.slug}`} className="transition-colors hover:text-[#154360]">
                          {featuredBlog.title}
                        </Link>
                      </h2>
                      <p className="mt-4 text-base leading-relaxed text-gray-600">{featuredBlog.excerpt}</p>
                      <Link
                        href={`/blog/${featuredBlog.slug}`}
                        className="mt-6 inline-flex rounded-sm bg-[#c0392b] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#a93226]"
                      >
                        Read More
                      </Link>
                    </div>
                  </article>
                </div>
              )}

              {/* Regular Blogs */}
              {regularBlogs.length > 0 && (
                <div className="mt-16">
                  {currentPage === 1 && !searchQuery && (
                    <div className="mb-6 flex items-center gap-2">
                      <div className="h-px flex-1 bg-gray-200" />
                      <span className="text-sm font-bold uppercase tracking-wide text-[#1a5276]">Latest Articles</span>
                      <div className="h-px flex-1 bg-gray-200" />
                    </div>
                  )}
                  <div className="grid gap-10 sm:grid-cols-2 lg:gap-12">
                    {regularBlogs.map((post) => (
                      <article key={post._id} className="group flex flex-col">
                        <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            loading="lazy"
                            className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] sm:h-56"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </Link>
                        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          {post.category && (
                            <span className="rounded-full bg-gray-100 px-2 py-1 font-semibold text-gray-700">
                              {post.category}
                            </span>
                          )}
                          <span>{formatDate(post.createdAt)}</span>
                          {post.readingTime && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {post.readingTime} min
                              </span>
                            </>
                          )}
                        </div>
                        <h2 className="mt-3 font-display text-lg font-bold leading-snug text-[#1a5276] sm:text-xl">
                          <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-[#154360]">
                            {post.title}
                          </Link>
                        </h2>
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">{post.excerpt}</p>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="mt-5 inline-flex w-fit rounded-sm bg-[#c0392b] px-5 py-2 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#a93226]"
                        >
                          Read More
                        </Link>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setCurrentPage(p => Math.max(1, p - 1));
                      trackPagination(Math.max(1, currentPage - 1));
                    }}
                    disabled={currentPage === 1}
                    className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        trackPagination(page);
                      }}
                      className={`rounded px-4 py-2 text-sm font-semibold transition-colors ${
                        currentPage === page
                          ? 'bg-[#1a5276] text-white'
                          : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setCurrentPage(p => Math.min(pagination.totalPages, p + 1));
                      trackPagination(Math.min(pagination.totalPages, currentPage + 1));
                    }}
                    disabled={currentPage === pagination.totalPages}
                    className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <BlogCta />
    </>
  );
}
