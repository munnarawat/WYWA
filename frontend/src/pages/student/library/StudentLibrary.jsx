import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../../../utils/api";

import LibraryHeader from "./LibraryHeader";
import LibraryControls from "./LibraryControls";
import BookCard from "./BookCard";
import IssuedBookCard from "./IssuedBookCard";
import BookSkeleton from "./BookSkeleton";
import InfiniteScroll from "react-infinite-scroll-component";

// ─────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────
const EmptyState = ({ message, subtext }) => (
  <div className="w-full h-64 flex flex-col items-center justify-center text-slate-600 rounded-[20px] border border-dashed border-white/[0.08]">
    <BookOpen size={40} className="mb-3 opacity-40" />
    <p className="text-[15px] font-semibold text-slate-500">{message}</p>
    <p className="text-[13px] mt-1">{subtext}</p>
  </div>
);
// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
const StudentLibrary = () => {
  const { user: currentUser } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("browse");
  const [allBooks, setAllBooks] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // ── Fetch all books ────────────────────
  const fetchAllBooks = useCallback(
    async (pageNumber = 1, isNewSearch = false) => {
      try {
        if (isNewSearch) setIsLoading(true);
        const res = await api.get(
          `/library/books?page=${pageNumber}&limit=12&search=${searchQuery}`,
        );
        const newBooks = res.data.books || [];
        if (isNewSearch) {
          setAllBooks(newBooks);
        } else {
          setAllBooks((prev) => [...prev, ...newBooks]);
        }
        setHasMore(res.data.pagination.hasNextPage);
        setPage(pageNumber);
      } catch {
        toast.error("Failed to load catalog.");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // ── Fetch issued books ─────────────────
  const fetchMyIssuedBooks = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/library/issued");
      setIssuedBooks(res.data.records || []);
    } catch {
      toast.error("Failed to load your issued books.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Fetch on tab change ────────────────
  useEffect(() => {
    if (activeTab === "browse") {
      setPage(1);
      fetchAllBooks(1, true);
    } else fetchMyIssuedBooks();
  }, [activeTab, searchQuery]);

  // ── Tab change handler ─────────────────
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery("");
  };

  // ── Filtered books (memoized) ──────────
  const filteredBooks = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return allBooks;
    return allBooks.filter(
      (book) =>
        book.title?.toLowerCase().includes(q) ||
        book.author?.toLowerCase().includes(q) ||
        book.category?.toLowerCase().includes(q),
    );
  }, [allBooks, searchQuery]);

  // ── Filtered issued books ──────────────
  const filteredIssued = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return issuedBooks;
    return issuedBooks.filter(
      (issue) =>
        issue.book?.title?.toLowerCase().includes(q) ||
        issue.book?.author?.toLowerCase().includes(q),
    );
  }, [issuedBooks, searchQuery]);

  return (
    <div id="scrollableDiv" className="w-full min-h-screen text-white p-4 md:p-8 pb-24 overflow-y-auto flex flex-col gap-6">
      {/* Header + Tabs + Stats */}
      <LibraryHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        allBooks={allBooks}
        issuedBooks={issuedBooks}
      />

      {/* Search + Controls */}
      <LibraryControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultCount={
          activeTab === "browse" ? filteredBooks.length : filteredIssued.length
        }
      />

      {/* Section divider */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-600 whitespace-nowrap">
          {activeTab === "browse" ? "All books" : "Your issued books"}
        </span>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {/* ── BROWSE TAB ── */}
        {activeTab === "browse" && (
          <motion.div
            key="browse"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}>
            {isLoading ? (
              <BookSkeleton />
            ) : filteredBooks.length === 0 ? (
              <EmptyState
                message="No books found"
                subtext="We couldn't find what you're looking for."
              />
            ) : (
              <InfiniteScroll
                dataLength={allBooks.length} 
                next={() => fetchAllBooks(page + 1, false)} 
                hasMore={hasMore} 
                style={{overflow:"hidden"}}
                scrollableTarget="scrollableDiv"
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
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-hidden p-1">
                  {allBooks.map((book, i) => (
                    <BookCard key={`${book._id}-${i}`} book={book} index={i} />
                  ))}
                </motion.div>
              </InfiniteScroll>
            )}
          </motion.div>
        )}

        {/* ── MY BOOKS TAB ── */}
        {activeTab === "my-books" && (
          <motion.div
            key="my-books"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}>
            {isLoading ? (
              <BookSkeleton />
            ) : filteredIssued.length === 0 ? (
              <EmptyState
                message="No issued books"
                subtext="You haven't borrowed any books from the library yet."
              />
            ) : (
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
                }}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredIssued.map((issue, i) => (
                  <IssuedBookCard key={issue._id} issue={issue} index={i} />
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentLibrary;
