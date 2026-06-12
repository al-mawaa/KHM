import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface TeamMember {
  _id: string;
  name: string;
  designation: string;
  role: "director" | "subdirector" | "employee";
  department?: string;
  image?: string;
  imagePublicId?: string;
  order: number;
  isActive: boolean;
}

export function TeamTree() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeam() {
      try {
        setLoading(true);
        const res = await fetch("/api/team?active=true");
        const json = await res.json();
        if (json.success) {
          setMembers(json.data);
        } else {
          setError(json.message || "Failed to load team");
        }
      } catch (err) {
        setError("Failed to fetch team hierarchy data.");
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-[#1a5276] mb-2" />
        <p className="text-sm font-medium">Loading team tree...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-600 font-medium">{error}</div>;
  }

  const directors = members.filter((m) => m.role === "director");
  const subdirectors = members.filter((m) => m.role === "subdirector");
  const employees = members.filter((m) => m.role === "employee");

  if (members.length === 0) {
    return <div className="text-center py-12 text-slate-500">No active team members found.</div>;
  }

  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="relative flex flex-col items-center py-8 w-full max-w-5xl mx-auto overflow-hidden">
      {/* Level 1: Directors */}
      {directors.length > 0 && (
        <div className="relative flex flex-col items-center w-full">
          <div className="relative z-10 flex flex-wrap justify-center gap-12">
            {directors.map((member) => (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-48 flex flex-col items-center text-center group"
              >
                <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-md transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-lg">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-[#1a5276] text-white font-display text-3xl font-bold">
                      {getInitials(member.name)}
                    </div>
                  )}
                </div>
                <h4 className="mt-4 font-bold text-lg text-[#1a5276] leading-snug group-hover:text-[#1a5276]/80 transition-colors">
                  {member.name}
                </h4>
                <p className="text-sm text-gray-600 font-medium">{member.designation}</p>
                {member.department && (
                  <span className="mt-1.5 inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#25a244]/10 text-[#25a244]">
                    {member.department}
                  </span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Line down from Level 1 */}
          {(subdirectors.length > 0 || employees.length > 0) && (
            <div className="w-[2px] h-10 bg-slate-200 mt-6" />
          )}
        </div>
      )}

      {/* Level 2: Sub-directors */}
      {subdirectors.length > 0 && (
        <div className="relative flex flex-col items-center w-full">
          {/* Horizontal crossbar line connecting sub-directors */}
          {subdirectors.length > 1 && (
            <div className="w-[calc(100%-8rem)] max-w-2xl h-[2px] bg-slate-200" />
          )}

          {/* Small drop lines to each subdirector */}
          <div className="flex justify-center gap-16 md:gap-24 w-full">
            {subdirectors.map((member) => (
              <div key={member._id} className="relative flex flex-col items-center">
                {subdirectors.length > 1 && <div className="w-[2px] h-4 bg-slate-200" />}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="w-40 flex flex-col items-center text-center mt-2 group"
                >
                  <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-sm transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-md">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-[#1a5276] text-white font-display text-2xl font-bold">
                        {getInitials(member.name)}
                      </div>
                    )}
                  </div>
                  <h4 className="mt-3 font-bold text-base text-[#1a5276] leading-snug group-hover:text-[#1a5276]/80 transition-colors">
                    {member.name}
                  </h4>
                  <p className="text-xs text-gray-600 font-medium">{member.designation}</p>
                  {member.department && (
                    <span className="mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#25a244]/10 text-[#25a244]">
                      {member.department}
                    </span>
                  )}
                </motion.div>
              </div>
            ))}
          </div>

          {/* Line down from Level 2 */}
          {employees.length > 0 && <div className="w-[2px] h-10 bg-slate-200 mt-6" />}
        </div>
      )}

      {/* Level 3: Employees */}
      {employees.length > 0 && (
        <div className="relative flex flex-col items-center w-full">
          {/* Horizontal crossbar line connecting employees */}
          {employees.length > 1 && (
            <div className="w-[calc(100%-8rem)] max-w-3xl h-[2px] bg-slate-200" />
          )}

          {/* Small drop lines to each employee */}
          <div className="flex flex-wrap justify-center gap-12 md:gap-16 w-full">
            {employees.map((member) => (
              <div key={member._id} className="relative flex flex-col items-center">
                {employees.length > 1 && <div className="w-[2px] h-4 bg-slate-200" />}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="w-36 flex flex-col items-center text-center mt-2 group"
                >
                  <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-white shadow-sm transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-md">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-[#1a5276] text-white font-display text-xl font-bold">
                        {getInitials(member.name)}
                      </div>
                    )}
                  </div>
                  <h4 className="mt-2.5 font-bold text-sm text-[#1a5276] leading-snug group-hover:text-[#1a5276]/80 transition-colors">
                    {member.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-medium">{member.designation}</p>
                  {member.department && (
                    <span className="mt-1 inline-block px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-[#25a244]/10 text-[#25a244]">
                      {member.department}
                    </span>
                  )}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
