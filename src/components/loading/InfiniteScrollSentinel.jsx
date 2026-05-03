import LazyLoadSkeleton from './LazyLoadSkeleton.jsx';

export default function InfiniteScrollSentinel({
  error,
  hasNextPage,
  isLoading,
  onRetry,
  sentinelRef,
  skeletonCount = 2,
  skeletonVariant = 'list',
}) {
  return (
    <div ref={sentinelRef} className="infinite-sentinel">
      {isLoading && <LazyLoadSkeleton count={skeletonCount} variant={skeletonVariant} />}
      {!isLoading && error && (
        <button type="button" onClick={onRetry} className="infinite-retry rounded-[14px] px-3 py-2 text-[11px] font-black">
          Muat ulang data
        </button>
      )}
      {!isLoading && hasNextPage && !error && <span className="sr-only">Memuat data berikutnya</span>}
    </div>
  );
}
