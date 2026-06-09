import { motion } from "framer-motion";
import { useState, useEffect } from "react";
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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      console.log('Fetching projects from API...');
      setLoading(true);
      setError(null);
      const res = await fetch('/api/projects');
      const data = await res.json();
      console.log('API response:', data);
      
      if (data.success) {
        setProjects(data.data);
      } else {
        setError(data.message || 'Failed to fetch projects');
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const activeProjects = projects
    .filter((p) => p.status === "Active")
    .map((p, index) => ({
      srNo: index + 1,
      projectName: p.title,
      department: p.department,
      state: p.state,
      scope: p.scope,
      status: p.status,
    }));

  const upcomingProjects = projects
    .filter((p) => p.status === "Upcoming")
    .map((p, index) => ({
      srNo: activeProjects.length + index + 1,
      projectName: p.title,
      department: p.department,
      state: p.state,
      scope: p.scope,
      status: p.status,
    }));

  return (
    <>
      <PageHero
        title="Our Projects"
        subtitle="Delivering successful infrastructure and wastewater treatment projects with quality, innovation and reliability."
        breadcrumb="Projects"
      />

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
                  <ProjectTable projects={activeProjects} />
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
  srNo: number;
  projectName: string;
  department: string;
  state: string;
  scope: string;
  status: string;
}

function ProjectTable({ projects }: { projects: ProjectTableItem[] }) {
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
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projects.map((project, index) => (
            <tr
              key={project.srNo}
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
