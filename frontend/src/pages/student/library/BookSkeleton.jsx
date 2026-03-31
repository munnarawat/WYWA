const BookSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <div
        key={i}
        className="rounded-[20px] overflow-hidden animate-pulse"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="w-full h-[180px] bg-white/4" />
        <div className="p-4 space-y-2.5">
          <div className="h-2.5 w-16 bg-white/4 rounded-full" />
          <div className="h-4 w-3/4 bg-white/10 rounded-lg" />
          <div className="h-3 w-1/2 bg-white/4 rounded-md" />
        </div>
      </div>
    ))}
  </div>
);

export default BookSkeleton;
