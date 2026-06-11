import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Loader2, FileText, Search, Clock, Calendar } from "lucide-react";
import { BlogCta } from "@/components/BlogCta";
import { PageHero } from "@/components/PageHero";
import { siteImages } from "@/lib/site-images";
import { trackBlogSearch, trackPagination } from "@/lib/analytics";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  tags?: string[];
  category?: string;
  readingTime?: number;
  isPublished: boolean;
  createdAt: string;
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
        limit: '9',
        fields: 'listing',
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

  const truncateExcerpt = (text: string, maxLines: number = 2) => {
    const words = text.split(' ');
    const wordsPerLine = 15;
    const maxWords = maxLines * wordsPerLine;
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Our Blogs"
        description="Insights, case studies and industry news from the world of water and wastewater treatment."
        image={siteImages.heroPlant}
      />

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
          {/* Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs by title, tags, or content..."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pl-12 pr-24 text-sm shadow-sm focus:border-[#1a5276] focus:outline-none focus:ring-2 focus:ring-[#1a5276]/20 transition-all"
              />
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-[#1a5276] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#154360] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </form>
            {searchQuery && !loading && blogs.length === 0 && (
              <div className="mt-4 text-center text-sm text-gray-500">
                No results found for "<span className="font-semibold text-gray-700">{searchQuery}</span>"
              </div>
            )}
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
              {/* Blog Cards Grid */}
              {blogs.length > 0 && (
                <div className="mt-12">
                  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {blogs.map((post) => (
                      <article
                        key={post._id}
                        className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
                      >
                        {/* Featured Image */}
                        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                          <Link href={`/blog/${post.slug}`} className="block h-full w-full">
                            <Image
                              src={post.featuredImage}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          </Link>
                        </div>

                        {/* Card Content */}
                        <div className="flex flex-1 flex-col p-5">
                          {/* Meta Information */}
                          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            {post.category && (
                              <span className="rounded-full bg-[#1a5276] px-2.5 py-1 font-semibold text-white">
                                {post.category}
                              </span>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(post.createdAt)}</span>
                            </div>
                            {post.readingTime && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{post.readingTime} min</span>
                              </div>
                            )}
                          </div>

                          {/* Title */}
                          <h2 className="mb-3 font-display text-lg font-bold leading-tight text-[#1a5276] line-clamp-2">
                            <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-[#154360]">
                              {post.title}
                            </Link>
                          </h2>

                          {/* Excerpt */}
                          <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600 line-clamp-3">
                            {truncateExcerpt(post.excerpt, 3)}
                          </p>

                          {/* Read More Button */}
                          <Link
                            href={`/blog/${post.slug}`}
                            className="inline-flex w-fit items-center rounded-sm bg-[#c0392b] px-5 py-2 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#a93226]"
                          >
                            Read More
                          </Link>
                        </div>
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
