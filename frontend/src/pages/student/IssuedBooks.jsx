import React from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

const IssuedBooks = ({ issuedBooks }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen size={20} className="text-indigo-400" /> My Library Books
        </h3>
      </div>
      <div className="space-y-4">
        {issuedBooks?.length === 0 ? (
          <div className="text-center py-6 bg-black/40 rounded-xl border border-white/5">
            <BookOpen size={32} className="mx-auto text-zinc-600 mb-2" />
            <p className="text-zinc-500 text-sm">You haven't issued any books yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {issuedBooks?.map((record) => (
              <div key={record._id} className="p-4 bg-black/40 rounded-xl border border-white/5 flex flex-col gap-3">
                <div>
                  <h4 className="font-bold text-white text-lg line-clamp-1">{record.book?.title || "Unknown Book"}</h4>
                  <p className="text-xs text-zinc-400">By {record.book?.author || "Unknown"}</p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Issued On</span>
                    <span className="text-xs text-zinc-300">
                      {new Date(record.issuedAt || record.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold uppercase rounded-md border ${record.status === "returned" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>
                    {record.status === "returned" ? "Returned" : "Issued"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default IssuedBooks;