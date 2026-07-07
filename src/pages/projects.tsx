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
      image: p.image,
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
      image: p.image,
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
                    : "bg-gray-100 text-black hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {categoryNames.slice(0, 5).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
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
              <label htmlFor="category-filter" className="text-sm font-semibold text-black whitespace-nowrap">
                Filter by Category
              </label>
              <div className="relative w-full sm:w-56">
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
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
        </div>
      </section>

      {error && (
        <div className="text-center py-12 text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-black">Loading projects...</div>
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
                  <div className="text-center py-12 text-black">No active projects found</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {activeProjects.map((project, index) => (
                      <ProjectCard key={project.id} project={project} showViewAction />
                    ))}
                  </div>
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
                  <div className="text-center py-12 text-black">No upcoming projects found</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {upcomingProjects.map((project, index) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </section>
        </>
      )}
    </>
  );
}

interface ProjectCardItem {
  id: string;
  projectName: string;
  department: string;
  state: string;
  scope: string;
  status: string;
  image?: string;
}

function ProjectCard({ project, showViewAction = false }: { project: ProjectCardItem; showViewAction?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-[#1a5276]/30 transition-all duration-300"
    >
      {/* Image Section */}
      <div className="relative h-48 w-full bg-gray-100">
        {project.image ? (
          <img
            src={project.image}
            alt={project.projectName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-[#1a5276]/10 to-[#25a244]/10">
            <span className="text-4xl font-bold text-[#1a5276]/30">
              {project.projectName.charAt(0)}
            </span>
          </div>
        )}
        {showViewAction && project.status === "Active" && (
          <Link
            href={`/projects/${project.id}`}
            className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#1a5276] shadow-md transition-colors hover:bg-[#1a5276] hover:text-white"
            title="View project details"
          >
            <Eye className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="text-[16px] font-bold text-[#1a5276] mb-2 line-clamp-2">
          {project.projectName}
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-[13px] font-semibold text-gray-500 shrink-0">Dept:</span>
            <span className="text-[13px] text-gray-700 line-clamp-1">{project.department}</span>
          </div>
          
          <div className="flex items-start gap-2">
            <span className="text-[13px] font-semibold text-gray-500 shrink-0">State:</span>
            <span className="text-[13px] text-gray-700 line-clamp-1">{project.state}</span>
          </div>
          
          <div className="flex items-start gap-2">
            <span className="text-[13px] font-semibold text-gray-500 shrink-0">Scope:</span>
            <span className="text-[13px] text-gray-700 line-clamp-2">{project.scope}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <StatusBadge status={project.status} />
        </div>
      </div>
    </motion.div>
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

