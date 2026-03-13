import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  Image as ImageIcon,
  X,
  AlertCircle,
  CheckCircle,
  Package,
} from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import PopUp from "../../pop-up/PopUp";
import { useForm } from "react-hook-form";

// SKELETON LOADER FOR BOOKS
const BookSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div
          key={i}
          className="bg-white/5 border border-white/10 rounded-2xl p-4 animate-pulse flex flex-col h-72">
          <div className="w-full h-40 bg-white/10 rounded-xl mb-4"></div>
          <div className="h-5 w-3/4 bg-white/10 rounded-md mb-2"></div>
          <div className="h-4 w-1/2 bg-white/5 rounded-md mb-4"></div>
          <div className="mt-auto flex justify-between">
            <div className="h-6 w-16 bg-white/5 rounded-md"></div>
            <div className="h-6 w-16 bg-white/5 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
const LibraryInventory = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user: currentUser } = useSelector((state) => state.auth);

  // models status
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  //  HOOK FORM SETUP
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  // alert status
  const [showAlert, setShowAlert] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  //  1. fetch all books
  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("library/books");
      setBooks(response.data.books);
    } catch (error) {
      console.error("Fetch books error:", error);
      toast.error("Failed to load library.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchBooks();
  }, [currentUser?.branch]);

  // 2. Add / Update Book
  const onSubmitFrom = async (data) => {
    const toastId = toast.loading(
      editingId ? "Updating book..." : "Adding book to library...",
    );
    try {
      const payload = {
        ...data,
        quantity: Number(data.quantity),
      };
      if (editingId) {
        // update book
        await api.put(`/library/books/${editingId}`, payload)
        toast.success("Book updated successfully!", { id: toastId });
      } else {
        // add book
        await api.post("/library/books",payload);
        toast.success("Book added to library! 🎉", { id: toastId });
      }
      closeModal();
      fetchBooks();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    }
  };

  const confirmDelete = async (id) => {
    setShowAlert(true);
    setSelectedBookId(id);
  };
  //   3 . delete Books
  const handleDelete = async () => {
    if (!selectedBookId) return;

    const toastId = toast.loading("Deleting book...");
    try {
      await api.delete(`/library/books/${selectedBookId}`);
      toast.success("book deleted!", { id: toastId });
      setBooks(books.filter((b) => b._id !== selectedBookId));
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete book", {
        id: toastId,
      });
    } finally {
      setShowAlert(false);
      setSelectedBookId(null);
    }
  };

  // Modal Handlers
  const openCreateModal = () => {
    reset({ title: "", author: "", quantity: "", coverImage: "" });
    setEditingId(null);
    setIsModalOpen(true);
  };

const openEditModal = (book) => {
    setValue("title", book.title);
    setValue("author", book.author);
    setValue("quantity", book.quantity);
    setValue("coverImage", book.coverImage || "");
    
    setEditingId(book._id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
    setEditingId(null);
  };

  // Search Filter
  const filteredBooks = useMemo(() => {
    return books.filter(
      (book) =>
        book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [books, searchQuery]);

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white p-4 md:p-8 overflow-y-auto pb-24 relative">
      {/* show alert */}
      <AnimatePresence>
        {showAlert && (
          <PopUp
            onCancel={() => {
              setShowAlert(false);
              setSelectedBookId(null);
            }}
            onConfirm={() => handleDelete()}
            text={`Are you sure you want to delete this Book? this action cannot be undone!`}
          />
        )}
      </AnimatePresence>
      {/* 🟢 MODAL (Add / Edit Book) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 z-10">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white transition bg-white/5 p-2 rounded-full">
                <X size={18} />
              </button>

              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BookOpen className="text-teal-400" />
                {editingId ? "Edit Book Details" : "Add New Book"}
              </h2>

             <form onSubmit={handleSubmit(onSubmitFrom)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Book Title *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Clean Code" 
                    {...register("title", { required: "Title is required" })}
                    className={`w-full bg-black/20 border ${errors.title ? 'border-rose-500' : 'border-white/10'} rounded-xl py-3 px-4 text-white focus:outline-none focus:border-teal-500/50`} 
                  />
                  {errors.title && <p className="text-rose-400 text-xs mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Author Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Robert C. Martin" 
                    {...register("author", { required: "Author is required" })}
                    className={`w-full bg-black/20 border ${errors.author ? 'border-rose-500' : 'border-white/10'} rounded-xl py-3 px-4 text-white focus:outline-none focus:border-teal-500/50`} 
                  />
                  {errors.author && <p className="text-rose-400 text-xs mt-1">{errors.author.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Total Quantity *</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 10" 
                      {...register("quantity", { 
                        required: "Quantity is required", 
                        min: { value: 1, message: "Min 1 needed" } 
                      })}
                      className={`w-full bg-black/20 border ${errors.quantity ? 'border-rose-500' : 'border-white/10'} rounded-xl py-3 px-4 text-white focus:outline-none focus:border-teal-500/50`} 
                    />
                    {errors.quantity && <p className="text-rose-400 text-xs mt-1">{errors.quantity.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1 flex items-center gap-1">Cover URL <span className="text-xs text-zinc-500">(Optional)</span></label>
                    <input 
                      type="url" 
                      placeholder="https://..." 
                      {...register("coverImage")}
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-teal-500/50" 
                    />
                  </div>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={closeModal} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition font-medium">Cancel</button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-xl bg-linear-to-r from-teal-500 to-lime-500 text-zinc-950 font-bold shadow-lg hover:shadow-teal-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Processing..." : (editingId ? "Save Changes" : "Add Book")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🟢 HEADER & SEARCH */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-teal-400 to-lime-400">
            Library Inventory
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 mt-1">
            Manage books, stock, and availability for {currentUser?.branch}{" "}
            branch.
          </motion.p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full sm:w-64">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-teal-500/50 transition-all text-white"
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 bg-linear-to-r from-teal-500 to-lime-500 text-zinc-950 font-bold px-5 py-2.5 rounded-xl hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all whitespace-nowrap">
            <Plus size={18} /> Add Book
          </motion.button>
        </div>
      </div>

      {/* 🟢 BOOKS GRID SECTION */}
      {isLoading ? (
        <BookSkeleton />
      ) : filteredBooks.length === 0 ? (
        <div className="w-full h-64 flex flex-col items-center justify-center text-zinc-500 bg-white/5 border border-white/10 rounded-2xl border-dashed">
          <BookOpen size={48} className="mb-4 opacity-50" />
          <p className="text-lg font-medium">No books found</p>
          <p className="text-sm">Try a different search or add a new book.</p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.05 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              key={book._id}
              className="group relative bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-teal-500/30 transition-all hover:-translate-y-1 hover:shadow-2xl flex flex-col h-full">
              {/* Cover Image Area */}
              <div className="w-full h-48 rounded-xl bg-zinc-900 mb-4 overflow-hidden relative border border-white/5 flex items-center justify-center">
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "";
                    }} // Agar URL toot gaya toh
                  />
                ) : (
                  // Fallback Gradient
                  <div className="w-full h-full bg-linear-to-br from-zinc-800 to-zinc-900 flex flex-col items-center justify-center text-zinc-600">
                    <ImageIcon size={32} className="mb-2 opacity-30" />
                    <span className="text-4xl font-black text-white/5">
                      {book.title.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Stock Badge Overlay */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md
                    ${book.available > 0 ? "bg-lime-500/20 text-lime-400 border-lime-500/30" : "bg-rose-500/20 text-rose-400 border-rose-500/30"}
                  `}>
                    {book.available > 0
                      ? `${book.available} Available`
                      : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Book Details */}
              <div className="flex-1 flex flex-col">
                <h3
                  className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-teal-400 transition-colors"
                  title={book.title}>
                  {book.title}
                </h3>
                <p className="text-zinc-400 text-sm mb-4 line-clamp-1">
                  {book.author}
                </p>

                {/* Footer Controls */}
                <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 bg-white/5 px-2 py-1 rounded-md">
                    <Package size={14} /> Total: {book.quantity}
                  </div>

                  <div className="flex items-center gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(book)}
                      className="p-1.5 rounded-md bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 transition">
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => confirmDelete(book._id)}
                      className="p-1.5 rounded-md bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default LibraryInventory;
