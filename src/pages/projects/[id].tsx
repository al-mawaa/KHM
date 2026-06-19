import { useState, useEffect, type ComponentType } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Loader2,
  FolderKanban,
  MapPin,
  Building2,
  Layers,
  Tag,
  ArrowLeft,
} from "lucide-react";
import Head from "next/head";
import { PageHero } from "@/components/PageHero";

interface Project {
  _id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  department: string;
  state: string;
  scope: string;
  status: string;
  type: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id || typeof id !== "string") return;

      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/projects/${id}`);
        const data = await res.json();

        if (data.success) {
          setProject(data.data);
        } else {
          setError(data.message || "Project not found");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-[#1a5276]" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <FolderKanban className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">{error || "Project not found"}</p>
          <Link href="/projects" className="mt-4 inline-block text-[#1a5276] hover:text-[#154360]">
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const isActive = project.status === "Active";

  return (
    <>
      <Head>
        <title>{project.title} | KHM Infra Innovations</title>
        <meta name="description" content={project.description} />
      </Head>

      <PageHero
        title={project.title}
        subtitle={project.scope}
        breadcrumb="Projects"
      />

      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1a5276] hover:text-[#154360] mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>

          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1a5276]/10 px-3 py-1 text-xs font-semibold text-[#1a5276]">
                  <Tag className="h-3.5 w-3.5" />
                  {project.category}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    isActive
                      ? "bg-blue-100 text-blue-800 border border-blue-200"
                      : "bg-green-100 text-green-800 border border-green-200"
                  }`}
                >
                  {project.status}
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#1a5276] mb-4">Project Overview</h2>
                <p className="text-gray-600 leading-relaxed">{project.description}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <DetailItem icon={Building2} label="Department / Agency" value={project.department} />
                <DetailItem icon={MapPin} label="State" value={project.state} />
                <DetailItem icon={MapPin} label="Location" value={project.location} />
                <DetailItem icon={Layers} label="Scope" value={project.scope} />
                <DetailItem icon={FolderKanban} label="Project Type" value={project.type} />
              </div>
            </div>

            <div>
              {project.image ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50">
                  <FolderKanban className="h-16 w-16 text-gray-300" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-gray-50 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#1a5276]">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/projects" className="hover:text-[#1a5276]">Projects</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-[#1a5276] font-medium">{project.title}</span>
          </nav>
        </div>
      </section>
    </>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}
