import { Search } from "lucide-react";

const LibraryControls = ({ searchQuery, onSearchChange, resultCount }) => (
  <div className="flex items-center gap-3 flex-wrap">

    {/* Search input */}
    <div className="relative flex-1 max-w-[360px]">
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by title, author, or category…"
        aria-label="Search books"
        className="w-full bg-white/3 border border-white/[0.07] rounded-[14px] py-2.5 pl-10 pr-4 text-[13px] text-slate-100 placeholder:text-slate-700 outline-none transition-all focus:border-teal-500/40 focus:bg-teal-500/2"
      />
    </div>

    {/* Results count */}
    {resultCount !== undefined && (
      <span
        className="text-[11px] font-bold uppercase tracking-wider px-3 py-2 rounded-lg text-slate-500 whitespace-nowrap"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {resultCount} Results
      </span>
    )}

  </div>
);

export default LibraryControls;