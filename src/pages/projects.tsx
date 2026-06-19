import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Eye } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

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

interface ProjectCategory {
  _id: string;
  name: string;
  order: number;
}

export default function ProjectsPage() {
  useVisitorTracking('Projects');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [projectsRes, categoriesRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/project-categories'),
      ]);

      const projectsData = await projectsRes.json();
      const categoriesData = await categoriesRes.json();

      if (projectsData.success) {
        setProjects(projectsData.data);
      } else {
        setError(projectsData.message || 'Failed to fetch projects');
      }

      if (categoriesData.success) {
        setCategories(categoriesData.data);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const activeProjects = projects
    .filter((p) => p.status === "Active")
    .filter((p) => selectedCategory === "All" || p.category === selectedCategory)
    .map((p, index) => ({
      id: p._id,
      srNo: index + 1,
      projectName: p.title,
      department: p.department,
      state: p.state,
      scope: p.scope,
      status: p.status,
    }));

  const upcomingProjects = projects
    .filter((p) => p.status === "Upcoming")
    .filter((p) => selectedCategory === "All" || p.category === selectedCategory)
    .map((p, index) => ({
      id: p._id,
      srNo: activeProjects.length + index + 1,
      projectName: p.title,
      department: p.department,
      state: p.state,
      scope: p.scope,
      status: p.status,
    }));

  const categoryNames = categories.map((c) => c.name);

  return (
    <>
      <PageHero
        title="Our Projects"
        subtitle="Delivering successful infrastructure and wastewater treatment projects with quality, innovation and reliability."
      />

      {/* Category Filter Section */}
      <section className="py-8 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === "All"
                    ? "bg-[#1a5276] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {categoryNames.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedCategory === category
                      ? "bg-[#1a5276] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 lg:ml-auto lg:shrink-0">
              <label htmlFor="category-filter" className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                Filter by Category
              </label>
              <div className="relative w-full sm:w-56">
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-gray-900 shadow-sm transition-colors focus:border-[#1a5276] focus:outline-none focus:ring-2 focus:ring-[#1a5276]/20"
                >
                  <option value="All">All Categories</option>
                  {categoryNames.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="text-center py-12 text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading projects...</div>
      ) : (
        <>

          {/* Active Projects Section */}
          <section className="py-16 lg:py-24 bg-white">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <h2 className="text-[32px] font-bold text-[#1a5276]">
                  ACTIVE PROJECTS
                </h2>
                <div className="mt-3 h-1 w-16 bg-gradient-to-r from-[#25a244] to-[#1a5276] rounded-full" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {activeProjects.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">No active projects found</div>
                ) : (
                  <ProjectTable projects={activeProjects} showViewAction />
                )}
              </motion.div>
            </div>
          </section>

          {/* Upcoming Projects Section */}
          <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <h2 className="text-[32px] font-bold text-[#1a5276]">
                  UPCOMING PROJECTS
                </h2>
                <div className="mt-3 h-1 w-16 bg-gradient-to-r from-[#25a244] to-[#1a5276] rounded-full" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {upcomingProjects.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">No upcoming projects found</div>
                ) : (
                  <ProjectTable projects={upcomingProjects} />
                )}
              </motion.div>
            </div>
          </section>
        </>
      )}
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "Active";
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
        isActive
          ? "bg-blue-100 text-blue-800 border border-blue-200"
          : "bg-green-100 text-green-800 border border-green-200"
      }`}
    >
      {status}
    </span>
  );
}

interface ProjectTableItem {
  id: string;
  srNo: number;
  projectName: string;
  department: string;
  state: string;
  scope: string;
  status: string;
}

function ProjectTable({
  projects,
  showViewAction = false,
}: {
  projects: ProjectTableItem[];
  showViewAction?: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full">
        <thead className="sticky top-0 bg-gradient-to-r from-[#1a5276] to-[#154360] text-white">
          <tr>
            <th className="px-6 py-4 text-left text-[15px] font-semibold uppercase tracking-wide">
              Sr. No.
            </th>
            <th className="px-6 py-4 text-left text-[15px] font-semibold uppercase tracking-wide">
              Project Name
            </th>
            <th className="px-6 py-4 text-left text-[15px] font-semibold uppercase tracking-wide">
              Department / Agency
            </th>
            <th className="px-6 py-4 text-left text-[15px] font-semibold uppercase tracking-wide">
              State
            </th>
            <th className="px-6 py-4 text-left text-[15px] font-semibold uppercase tracking-wide">
              Scope
            </th>
            <th className="px-6 py-4 text-left text-[15px] font-semibold uppercase tracking-wide">
              Status
            </th>
            {showViewAction && (
              <th className="px-6 py-4 text-center text-[15px] font-semibold uppercase tracking-wide">
                Details
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projects.map((project, index) => (
            <tr
              key={project.id}
              className={`transition-all duration-200 hover:bg-gray-50 hover:shadow-md ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              }`}
            >
              <td className="px-6 py-4 text-[14px] leading-6 text-gray-700 font-medium">
                {project.srNo}
              </td>
              <td className="px-6 py-4 text-[14px] leading-6 text-gray-900 font-medium">
                {project.projectName}
              </td>
              <td className="px-6 py-4 text-[14px] leading-6 text-gray-700">
                {project.department}
              </td>
              <td className="px-6 py-4 text-[14px] leading-6 text-gray-700">
                {project.state}
              </td>
              <td className="px-6 py-4 text-[14px] leading-6 text-gray-700">
                {project.scope}
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={project.status} />
              </td>
              {showViewAction && project.status === "Active" && (
                <td className="px-6 py-4 text-center">
                  <Link
                    href={`/projects/${project.id}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1a5276]/10 text-[#1a5276] transition-colors hover:bg-[#1a5276] hover:text-white"
                    title="View project details"
                    aria-label={`View details for ${project.projectName}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </td>
              )}
              {showViewAction && project.status !== "Active" && (
                <td className="px-6 py-4" />
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
