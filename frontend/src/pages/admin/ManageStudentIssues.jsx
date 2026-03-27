import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  Search,
  MoreVertical,
  XCircle,
} from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";

const IssueSkelton = () => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white/5 border border-white/10 animate-pulse rounded-2xl p-5 md:p-6 transition-all flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div className="flex-1 space-y-3">
            <div className="w-1/3 h-4 bg-white/5">     
            </div>

            <div className="w-3/4 h-6 mb-2 bg-white/5 "></div>
            <div className="w-3/4 h-6 mb-2 bg-white/5 "></div>

            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
              <div className="w-6 h-6 rounded-full bg-white/5 animate-pulse"></div>
              <div className=" bg-white/5 w-1/2 mt-2 h-6 animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
const ManageStudentIssues = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'pending', 'resolved'
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/ticket/all");
      if (res.data.success) {
        setTickets(res.data.tickets);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to load tickets");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchTickets();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await api.patch(`/ticket/${id}/status`, {
        status: newStatus,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setTickets(
          tickets.map((t) => (t._id === id ? { ...t, status: newStatus } : t)),
        );
      }
    } catch (error) {
      toast.error("Failed to update status");
      console.error("Error update ticket status ", error);
    }
  };

  // Filtering Logic
  const filteredTickets = tickets.filter((t) => {
    const matchesFilter = filter === "all" ? true : t.status === filter;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.student?.userName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "in-progress":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "closed":
        return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
      default:
        return "text-rose-400 bg-rose-500/10 border-rose-500/20"; // pending
    }
  };

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white p-4 md:p-8 overflow-y-auto pb-24">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-teal-400 to-lime-400">
            Help Desk Issues
          </motion.h1>
          <p className="text-zinc-400 mt-1">
            Manage and resolve student complaints.
          </p>
        </div>

        {/* SEARCH & FILTER */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 focus:border-teal-500 outline-none transition-colors"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-teal-500 text-sm [&>option]:bg-zinc-900">
            <option value="all">All Issues</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* TICKETS LIST */}
      {isLoading ? (
       <IssueSkelton/>
      ) : filteredTickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white/5 border border-white/10 rounded-2xl">
          <CheckCircle size={48} className="text-zinc-500 mb-4" />
          <p className="text-zinc-400 text-lg">Hooray! No issues found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTickets.map((ticket) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={ticket._id}
              className="bg-white/5  hover:bg-white-[0.07] border border-white/10 rounded-2xl p-5 md:p-6 transition-all flex flex-col md:flex-row gap-6 md:items-center justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                  <span className="text-xs text-zinc-500 flex items-center gap-1">
                    <Clock size={12} />{" "}
                    {new Date(ticket.createdAt).toLocaleString()}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">
                    {ticket.title}
                  </h3>
                  <p className="text-sm text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {ticket.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-[10px] font-bold uppercase">
                    {ticket.student?.userName?.charAt(0) || "U"}
                  </div>
                  <span className="text-xs font-medium text-zinc-300">
                    Raised by:{" "}
                    <span className="text-white capitalize">
                      {ticket.student?.fullName?.firstName ||
                        ticket.student?.userName}
                    </span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-row md:flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                {ticket.status !== "resolved" && (
                  <button
                    onClick={() => handleStatusChange(ticket._id, "resolved")}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-xl text-sm font-medium transition-all">
                    <CheckCircle size={16} /> Mark Resolved
                  </button>
                )}
                {ticket.status === "pending" && (
                  <button
                    onClick={() =>
                      handleStatusChange(ticket._id, "in-progress")
                    }
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 px-4 py-2 rounded-xl text-sm font-medium transition-all">
                    <AlertCircle size={16} /> Mark In-Progress
                  </button>
                )}
                {ticket.status === "resolved" && (
                  <button
                    onClick={() => handleStatusChange(ticket._id, "closed")}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-zinc-500/10 hover:bg-zinc-500/20 text-zinc-400 border border-zinc-500/20 px-4 py-2 rounded-xl text-sm font-medium transition-all">
                    <XCircle size={16} /> Close Ticket
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageStudentIssues;
