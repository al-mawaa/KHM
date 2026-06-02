import { Link } from "react-router-dom";

export function BlogCta() {
  return (
    <section className="bg-[#1a5276] py-12 text-center text-white lg:py-14">
      <div className="mx-auto max-w-[900px] px-4 lg:px-6">
        <h2 className="font-display text-xl font-bold uppercase leading-snug sm:text-2xl">
          Are you ready for a better &amp; more productive business?
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-white/90 sm:text-base">
          Find more options that work for your business — we have more than 15+ years of experience for all types of
          water solution services.
        </p>
        <Link
          to="/contact"
          className="mt-8 inline-flex rounded bg-[#25a244] px-10 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#1f8a38]"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}
