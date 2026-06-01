import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";
import api from "../../../utils/api";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import PopUp from "../../../pop-up/PopUp";
import { useForm } from "react-hook-form";
import InventoryHeader from "./InventoryHeader";
import InventoryBook from "./InventoryBook";
import InfiniteScroll from "react-infinite-scroll-component";
import BookFormModal from "./BookFormModal";
import { Helmet } from "react-helmet-async";

// SKELETON LOADER FOR BOOKS
const BookSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div
          key={i}
          className="rounded-[20px] overflow-hidden animate-pulse"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}>
          <div className="w-full h-45 bg-white/4" />
          <div className="p-4 space-y-2.5">
            <div className="h-2.5 w-16 bg-white/4 rounded-full" />
            <div className="h-4 w-3/4 bg-white/10 rounded-lg" />
            <div className="h-3 w-1/2 bg-white/4 rounded-md" />
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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
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
  const fetchBooks = useCallback(
    async (pageNumber = 1, isNewSearch = false) => {
      try {
        if (isNewSearch) {
          setIsLoading(true);
          setPage(1);
          setHasMore(true);
        }

        const res = await api.get(
          `/library/books?page=${pageNumber}&limit=12&search=${encodeURIComponent(searchQuery)}`,
        );
        const newBookList = res.data.books || [];

        if (isNewSearch) {
          // If searching, completely replace the array
          setBooks(newBookList);
        } else {
          // If scrolling, append only unique items
          setBooks((prev) => {
            const existingIds = new Set(prev.map((b) => b._id));
            const uniqueNewBooks = newBookList.filter(
              (b) => !existingIds.has(b._id),
            );

            // Stop loading if no new books were added but backend sent data
            if (uniqueNewBooks.length === 0 && newBookList.length > 0) {
              setHasMore(false);
              return prev;
            }
            return [...prev, ...uniqueNewBooks];
          });
        }

        // Use standard boolean cast or default to false
        setHasMore(res.data?.pagination?.hasNextPage || false);
        setPage(pageNumber);
      } catch (error) {
        toast.error("Failed to load catalog.");
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [searchQuery], // Re-create function when search changes
  );
  // Smart Search (Debouncing)
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      fetchBooks(1, true);
    }, 500); // Wait 500ms before sending search API

    return () => clearTimeout(timeOutId);
  }, [fetchBooks, currentUser?.branch]);

  // 2. Add / Update Book
  const onSubmitFrom = async (data) => {
    const toastId = toast.loading(
      editingId ? "Updating book..." : "Adding book to library...",
    );
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("author", data.author);
      formData.append("category", data.category);
      formData.append("quantity", Number(data.quantity));

      if (data.coverImage && data.coverImage.length > 0) {
        formData.append("image", data.coverImage[0]);
      }
      if (editingId) {
        // update book
        await api.put(`/library/books/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Book updated successfully!", { id: toastId });
      } else {
        // add book
        await api.post("/library/books", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Book added to library! 🎉", { id: toastId });
      }
      closeModal();
      fetchBooks(1, true); // Refresh the list from start
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
    reset({
      title: "",
      author: "",
      category: "",
      quantity: "",
      coverImage: "",
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (book) => {
    setValue("title", book.title);
    setValue("author", book.author);
    setValue("category", book.category);
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

  return (
    <div
      id="scrollableDiv"
      className="w-full min-h-screen bg-zinc-950 text-white p-4 md:p-8 overflow-y-auto pb-24 relative">
      {/* helmet  */}
      <Helmet>
        <title>Library Inventory | MYWA</title>
      </Helmet>
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
      <BookFormModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        onSubmit={onSubmitFrom}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        isSubmitting={isSubmitting}
        editingId={editingId}
      />

      {/* 🟢 HEADER & SEARCH */}
      <InventoryHeader
        currentUser={currentUser}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        openCreateModal={openCreateModal}
        stats={books}
      />

      {/* Section divider */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-600 whitespace-nowrap">
          All books
        </span>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      {/* 🟢 BOOKS GRID SECTION */}
      {/* Show loader only on initial fetch or search */}
      {isLoading ? (
        <BookSkeleton />
      ) : books.length === 0 ? (
        <div className="w-full h-64 flex flex-col items-center justify-center text-zinc-500 bg-white/5 border border-white/10 rounded-2xl border-dashed">
          <BookOpen size={48} className="mb-4 opacity-50" />
          <p className="text-lg font-medium">No books found</p>
          <p className="text-sm">Try a different search or add a new book.</p>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={books.length}
          next={() => fetchBooks(page + 1, false)}
          hasMore={hasMore}
          style={{ overflow: "hidden" }}
          scrollableTarget="dashboard-scroll-container"
          loader={
            <h4 className="text-center text-teal-500 my-4 animate-pulse">
              Loading more books... 📚
            </h4>
          }
          endMessage={
            <p className="text-center text-slate-500 my-6 text-sm">
              Yay! You have seen it all. 🎉
            </p>
          }>
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.05 } },
            }}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 pt-4  sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-hidden p-1">
            {books.map((book, i) => (
              <InventoryBook
                key={book._id}
                book={book}
                index={i}
                openEditModal={openEditModal}
                confirmDelete={confirmDelete}
              />
            ))}
          </motion.div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default LibraryInventory;
