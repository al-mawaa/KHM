import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Loader2, FileText, Search, Clock, Calendar, ChevronDown } from "lucide-react";
import { BlogCta } from "@/components/BlogCta";
import { trackBlogSearch, trackPagination } from "@/lib/analytics";
import { PageHero } from "@/components/PageHero";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

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

const BLOG_CATEGORIES = [
  "Water Treatment",
  "Wastewater Treatment",
  "Industrial Filtration",
  "RO Systems",
  "ETP/STP",
  "Case Studies",
];

export default function BlogPage() {
  useVisitorTracking('Blog');
  
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [categoryNames, setCategoryNames] = useState<string[]>(BLOG_CATEGORIES);

  const fetchBlogs = async (page: number = 1, search: string = '', category: string = 'All') => {
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

      if (category && category !== 'All') {
        params.append('category', category);
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
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/blog?published=true&limit=200&fields=listing');
        const data = await res.json();
        if (data.success) {
          const fromPosts = data.data
            .map((b: BlogPost) => b.category)
            .filter((cat: string | undefined): cat is string => Boolean(cat));
          setCategoryNames(Array.from(new Set([...BLOG_CATEGORIES, ...fromPosts])).sort());
        }
      } catch (err) {
        console.error('Error fetching blog categories:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBlogs(currentPage, searchQuery, selectedCategory);
  }, [currentPage, selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs(1, searchQuery, selectedCategory);
    if (searchQuery) {
      trackBlogSearch(searchQuery);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
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
        title="Insights & Articles"
        subtitle="Stay updated with industry trends, innovations and expert knowledge in water and wastewater management."
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
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black" />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-[#1a5276] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#154360] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </form>
            {searchQuery && !loading && blogs.length === 0 && (
              <div className="mt-4 text-center text-sm text-black">
                No results found for "<span className="font-semibold text-black">{searchQuery}</span>"
              </div>
            )}
          </div>

          {/* Category Filter */}
          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleCategoryChange("All")}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === "All"
                    ? "bg-[#1a5276] text-white"
                    : "bg-gray-100 text-black hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {categoryNames.slice(0, 5).map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedCategory === category
                      ? "bg-[#1a5276] text-white"
                      : "bg-gray-100 text-black hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 lg:ml-auto lg:shrink-0">
              <label htmlFor="blog-category-filter" className="text-sm font-semibold text-black whitespace-nowrap">
                Filter by Category
              </label>
              <div className="relative w-full sm:w-56">
                <select
                  id="blog-category-filter"
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-black shadow-sm transition-colors focus:border-[#1a5276] focus:outline-none focus:ring-2 focus:ring-[#1a5276]/20"
                >
                  <option value="All">All Categories</option>
                  {categoryNames.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black" />
              </div>
            </div>
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
              <FileText className="h-16 w-16 mx-auto text-black mb-4" />
              <p className="text-black text-lg">
                {selectedCategory !== "All"
                  ? `No blog posts found in "${selectedCategory}"`
                  : "No Blog Posts Available"}
              </p>
              <p className="text-black text-sm mt-2">Check back later for new content</p>
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
                          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-black">
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
                          <p className="mb-4 flex-1 text-sm leading-relaxed text-black line-clamp-3">
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
                    className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          : 'border border-gray-300 bg-white text-black hover:bg-gray-50'
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
                    className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
