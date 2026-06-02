import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { BlogCta } from "@/components/BlogCta";
import { BLOG_POSTS } from "@/lib/blog-posts";

export default function BlogPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-[#f4f6f8]">
        <div className="mx-auto flex max-w-[1400px] items-center gap-2 px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-600 lg:px-6">
          <Link to="/" className="transition-colors hover:text-[#1a5276]">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden />
          <span className="text-[#1a5276]">Blog</span>
        </div>
      </div>

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
          <h1 className="text-center font-display text-2xl font-bold uppercase text-[#1a5276] sm:text-3xl">Our Blogs</h1>

          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:gap-12">
            {BLOG_POSTS.map((post) => (
              <article key={post.slug} className="group flex flex-col">
                <Link to={`/blog#${post.slug}`} className="block overflow-hidden">
                  <img
                    src={post.image}
                    alt=""
                    loading="lazy"
                    className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] sm:h-56"
                  />
                </Link>
                <h2 className="mt-5 font-display text-lg font-bold leading-snug text-[#1a5276] sm:text-xl">
                  <Link to={`/blog#${post.slug}`} className="transition-colors hover:text-[#154360]">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">{post.excerpt}</p>
                <Link
                  to="/contact"
                  className="mt-5 inline-flex w-fit rounded-sm bg-[#c0392b] px-5 py-2 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#a93226]"
                >
                  Read More
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <BlogCta />
    </>
  );
}
