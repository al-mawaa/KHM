import { useEffect, useState } from "react";
import { Loader2, X, Briefcase, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TeamMember {
  _id: string;
  name: string;
  designation: string;
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

function memberAccent() {
  return "from-[#1a5276] to-[#154360]";
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
    size === "lg" ? "h-24 w-24 text-xl" : size === "md" ? "h-20 w-20 text-lg" : "h-16 w-16 text-base";
  const title = size === "lg" ? "text-base" : size === "md" ? "text-sm" : "text-xs";
  const subtitle = size === "lg" ? "text-xs" : size === "md" ? "text-[11px]" : "text-[10px]";
  const cardWidth = size === "lg" ? "w-40 sm:w-44 md:w-48" : size === "md" ? "w-36 sm:w-40 md:w-44" : "w-32 sm:w-36 md:w-40";
  const ringSize = photo.split(" ").slice(0, 2).join(" ");

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(member)}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={`group relative flex ${cardWidth} cursor-pointer flex-col items-center rounded-2xl border border-[#e8dcc8] bg-gradient-to-b from-[#faf6f0] to-[#f3ebe0] p-4 sm:p-5 text-center shadow-[0_8px_30px_rgba(26,82,118,0.08)] transition-shadow hover:border-[#1a5276]/25 hover:shadow-[0_14px_40px_rgba(26,82,118,0.14)] focus:outline-none focus:ring-2 focus:ring-[#1a5276]/30`}
      aria-label={`View details for ${member.name}`}
    >
      <div
        className={`absolute inset-x-5 top-0 h-1 rounded-b-full bg-gradient-to-r ${memberAccent()} opacity-80`}
      />

      <div className="relative mt-1">
        <div
          className={`absolute -inset-1 rounded-full bg-gradient-to-br ${memberAccent()} opacity-20 blur-sm transition-opacity group-hover:opacity-40`}
        />
        <div
          className={`relative ${ringSize} overflow-hidden rounded-full border-[3px] border-white shadow-md ring-2 ring-[#1a5276]/15 transition-transform group-hover:scale-[1.05]`}
        >
          {member.image ? (
            <img src={member.image} alt={member.name} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div
              className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${memberAccent()} font-display font-bold text-white ${photo.split(" ").slice(2).join(" ")}`}
            >
              {getInitials(member.name)}
            </div>
          )}
        </div>
      </div>

      <h4
        className={`mt-4 font-bold leading-snug text-[#1a5276] transition-colors group-hover:text-[#154360] ${title}`}
      >
        {member.name}
      </h4>
      <p className={`mt-0.5 font-medium text-emerald-600 ${subtitle}`}>{member.designation}</p>

      <span className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-[#1a5276]/50 opacity-0 transition-opacity group-hover:opacity-100">
        View profile
      </span>
    </motion.button>
  );
}

function ConnectorVertical({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`relative w-[3px] ${className}`}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#1a5276]/40 via-[#1a5276]/25 to-[#25a244]/30" />
    </div>
  );
}

function ConnectorHorizontal({ width }: { width: number }) {
  return (
    <div className="relative h-[3px]" style={{ width: `${width}px` }}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1a5276]/20 via-[#1a5276]/35 to-[#1a5276]/20" />
    </div>
  );
}

function ConnectorHorizontalResponsive({ width }: { width: number }) {
  return (
    <div className="relative h-[3px] w-full max-w-[640px]" style={{ width: `${Math.min(width, 640)}px` }}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1a5276]/20 via-[#1a5276]/35 to-[#1a5276]/20" />
    </div>
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
    <div className="flex flex-col items-center px-2">
      <MemberCard member={node} size={size} onSelect={onSelect} />
      {children.length > 0 && (
        <>
          <ConnectorVertical className="h-10" />
          {children.length > 1 && (
            <ConnectorHorizontalResponsive width={Math.min(children.length * 140, 560)} />
          )}
          <div className="flex flex-wrap items-start justify-center gap-3 sm:gap-5 md:gap-7 lg:gap-8">
            {children.map((child) => (
              <div key={child._id} className="flex flex-col items-center">
                {children.length > 1 && <ConnectorVertical className="h-5" />}
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-[#1a5276] px-4 sm:px-5 py-3 sm:py-4 flex-shrink-0">
          <h4 className="text-base sm:text-lg font-bold text-white">Member Details</h4>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-white/80 hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 text-center">
          <div className="mx-auto h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-full border-4 border-[#1a5276]/20 shadow flex-shrink-0">
            {member.image ? (
              <img src={member.image} alt={member.name} className="h-full w-full object-cover rounded-full" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#1a5276] text-xl sm:text-2xl font-bold text-white rounded-full">
                {getInitials(member.name)}
              </div>
            )}
          </div>
          <h3 className="mt-3 sm:mt-4 text-lg sm:text-xl font-bold text-[#1a5276]">{member.name}</h3>
          <p className="mt-1 text-xs sm:text-sm font-semibold text-emerald-600">{member.designation}</p>
          <div className="mt-4 sm:mt-5 rounded-xl bg-slate-50 p-3 sm:p-4 text-left">
            <p className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed text-slate-700">
              {member.remark?.trim() || `${member.name} serves as ${member.designation}.`}
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

  return (
    <>
      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center overflow-visible px-4 py-10 pb-16">
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-[radial-gradient(ellipse_at_top,_rgba(26,82,118,0.06)_0%,_transparent_55%)]" />

        {usesParentTree && roots ? (
          <div className="flex flex-wrap items-start justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {roots.map((root) => (
              <OrgNode key={root._id} node={root} depth={0} onSelect={setSelected} />
            ))}
          </div>
        ) : (
          <div className="flex w-full flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {members.map((member) => (
              <MemberCard key={member._id} member={member} size="md" onSelect={setSelected} />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && <RoleModal member={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}
