import { useEffect, useState } from "react";
import { Loader2, X, Briefcase, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TeamMember {
  _id: string;
  name: string;
  designation: string;
  role: "director" | "subdirector" | "employee";
  department?: string;
  remark?: string;
  parentId?: string | null;
  image?: string;
  order: number;
  isActive: boolean;
}

interface TreeNode extends TeamMember {
  children: TreeNode[];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function buildTree(members: TeamMember[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  members.forEach((m) => map.set(m._id, { ...m, children: [] }));

  const roots: TreeNode[] = [];
  map.forEach((node) => {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  const sortNodes = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    nodes.forEach((n) => sortNodes(n.children));
  };
  sortNodes(roots);
  return roots;
}

function MemberCard({
  member,
  size = "lg",
  onSelect,
}: {
  member: TeamMember;
  size?: "lg" | "md" | "sm";
  onSelect: (m: TeamMember) => void;
}) {
  const photo =
    size === "lg" ? "h-32 w-32 text-3xl" : size === "md" ? "h-24 w-24 text-2xl" : "h-20 w-20 text-xl";
  const title = size === "lg" ? "text-lg" : size === "md" ? "text-base" : "text-sm";
  const subtitle = size === "lg" ? "text-sm" : size === "md" ? "text-xs" : "text-[11px]";
  const badge = size === "lg" ? "text-xs" : size === "md" ? "text-[10px]" : "text-[9px]";

  return (
    <button
      type="button"
      onClick={() => onSelect(member)}
      className="group flex w-48 cursor-pointer flex-col items-center rounded-xl border border-transparent p-2 text-center transition-all hover:border-[#1a5276]/20 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1a5276]/30"
      aria-label={`View details for ${member.name}`}
    >
      <div
        className={`relative ${photo.split(" ")[0]} ${photo.split(" ")[1]} overflow-hidden rounded-full border-4 border-white shadow-md transition-transform group-hover:scale-[1.04] group-hover:shadow-lg`}
      >
        {member.image ? (
          <img src={member.image} alt={member.name} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-[#1a5276] font-display font-bold text-white ${photo.split(" ").slice(2).join(" ")}`}
          >
            {getInitials(member.name)}
          </div>
        )}
      </div>
      <h4
        className={`mt-4 font-bold leading-snug text-[#1a5276] transition-colors group-hover:text-[#154360] ${title}`}
      >
        {member.name}
      </h4>
      <p className={`font-medium text-gray-600 ${subtitle}`}>{member.designation}</p>
      {member.department && (
        <span
          className={`mt-1.5 inline-block rounded-full bg-[#25a244]/10 px-2.5 py-0.5 font-semibold text-[#25a244] ${badge}`}
        >
          {member.department}
        </span>
      )}
      <span className="mt-2 text-[10px] font-medium uppercase tracking-wide text-[#1a5276]/60 opacity-0 transition-opacity group-hover:opacity-100">
        Click for details
      </span>
    </button>
  );
}

function OrgNode({
  node,
  depth,
  onSelect,
}: {
  node: TreeNode;
  depth: number;
  onSelect: (m: TeamMember) => void;
}) {
  const size = depth === 0 ? "lg" : depth === 1 ? "md" : "sm";
  const children = node.children;

  return (
    <div className="flex flex-col items-center">
      <MemberCard member={node} size={size} onSelect={onSelect} />
      {children.length > 0 && (
        <>
          <div className="mt-4 h-10 w-[2px] bg-slate-200" />
          {children.length > 1 && (
            <div
              className="h-[2px] bg-slate-200"
              style={{ width: `${Math.min(children.length * 140, 560)}px` }}
            />
          )}
          <div className="flex flex-wrap items-start justify-center gap-12 md:gap-16">
            {children.map((child) => (
              <div key={child._id} className="flex flex-col items-center">
                {children.length > 1 && <div className="h-4 w-[2px] bg-slate-200" />}
                <OrgNode node={child} depth={depth + 1} onSelect={onSelect} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function RoleModal({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-[#1a5276] px-5 py-4">
          <h4 className="text-lg font-bold text-white">Member Details</h4>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-white/80 hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 text-center">
          <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-[#1a5276]/20 shadow">
            {member.image ? (
              <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#1a5276] text-xl font-bold text-white">
                {getInitials(member.name)}
              </div>
            )}
          </div>
          <h3 className="mt-4 text-xl font-bold text-[#1a5276]">{member.name}</h3>
          <p className="mt-1 text-sm font-semibold text-gray-600">{member.designation}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#1a5276]/10 px-3 py-1 text-xs font-semibold text-[#1a5276]">
              <Briefcase className="h-3.5 w-3.5" />
              {member.role === "director"
                ? "Director"
                : member.role === "subdirector"
                  ? "Co-Director / Manager"
                  : "Team Member"}
            </span>
            {member.department && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#25a244]/10 px-3 py-1 text-xs font-semibold text-[#25a244]">
                <Building2 className="h-3.5 w-3.5" />
                {member.department}
              </span>
            )}
          </div>
          <div className="mt-5 rounded-xl bg-slate-50 p-4 text-left">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Remark</p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
              {member.remark?.trim() ||
                `${member.name} serves as ${member.designation}${member.department ? ` in ${member.department}` : ""}.`}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function TeamTree() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<TeamMember | null>(null);

  useEffect(() => {
    fetch("/api/team?active=true")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setMembers(json.data);
        else setError(json.message || "Failed to load team");
      })
      .catch(() => setError("Failed to fetch team hierarchy."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selected]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">
        <Loader2 className="mb-2 h-8 w-8 animate-spin text-[#1a5276]" />
        <p className="text-sm font-medium">Loading team...</p>
      </div>
    );
  }

  if (error) return <div className="py-12 text-center text-red-600 font-medium">{error}</div>;
  if (members.length === 0) return <div className="py-12 text-center text-slate-500">No team members found.</div>;

  const usesParentTree = members.some((m) => m.parentId);
  const roots = usesParentTree ? buildTree(members) : null;

  const directors = members.filter((m) => m.role === "director");
  const subdirectors = members.filter((m) => m.role === "subdirector");
  const employees = members.filter((m) => m.role === "employee");

  return (
    <>
      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center overflow-hidden py-8">
        {usesParentTree && roots ? (
          <div className="flex flex-wrap items-start justify-center gap-12 md:gap-20">
            {roots.map((root) => (
              <OrgNode key={root._id} node={root} depth={0} onSelect={setSelected} />
            ))}
          </div>
        ) : (
          <>
            {directors.length > 0 && (
              <div className="flex w-full flex-col items-center">
                <div className="flex flex-wrap justify-center gap-12">
                  {directors.map((member) => (
                    <MemberCard key={member._id} member={member} size="lg" onSelect={setSelected} />
                  ))}
                </div>
                {(subdirectors.length > 0 || employees.length > 0) && (
                  <div className="mt-6 h-10 w-[2px] bg-slate-200" />
                )}
              </div>
            )}
            {subdirectors.length > 0 && (
              <div className="flex w-full flex-col items-center">
                {subdirectors.length > 1 && (
                  <div className="h-[2px] w-[calc(100%-8rem)] max-w-2xl bg-slate-200" />
                )}
                <div className="flex w-full justify-center gap-16 md:gap-24">
                  {subdirectors.map((member) => (
                    <div key={member._id} className="flex flex-col items-center">
                      {subdirectors.length > 1 && <div className="h-4 w-[2px] bg-slate-200" />}
                      <MemberCard member={member} size="md" onSelect={setSelected} />
                    </div>
                  ))}
                </div>
                {employees.length > 0 && <div className="mt-6 h-10 w-[2px] bg-slate-200" />}
              </div>
            )}
            {employees.length > 0 && (
              <div className="flex w-full flex-col items-center">
                {employees.length > 1 && (
                  <div className="h-[2px] w-[calc(100%-8rem)] max-w-3xl bg-slate-200" />
                )}
                <div className="flex w-full flex-wrap justify-center gap-12 md:gap-16">
                  {employees.map((member) => (
                    <div key={member._id} className="flex flex-col items-center">
                      {employees.length > 1 && <div className="h-4 w-[2px] bg-slate-200" />}
                      <MemberCard member={member} size="sm" onSelect={setSelected} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {selected && <RoleModal member={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}
