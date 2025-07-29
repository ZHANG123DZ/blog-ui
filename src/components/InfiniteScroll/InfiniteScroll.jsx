import { useEffect, useRef } from "react";

const InfiniteScroll = ({ loadMore, hasMore, children }) => {
  const sentinelRef = useRef();

  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore(); // gọi API hoặc dispatch Redux
        }
      },
      {
        rootMargin: "200px", // 👈 preload trước 200px
      }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <>
      {children}
      {hasMore && <div ref={sentinelRef} />}
    </>
  );
};

export default InfiniteScroll;
