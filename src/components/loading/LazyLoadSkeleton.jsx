const rows = (count) => Array.from({ length: count }, (_, index) => index);

function SkeletonLine({ className = '' }) {
  return <span className={`skeleton-line ${className}`} />;
}

function ListSkeleton() {
  return (
    <div className="role-list-card skeleton-card flex items-center justify-between gap-3 rounded-[18px] p-3">
      <div className="min-w-0 flex-1">
        <SkeletonLine className="h-2.5 w-20" />
        <SkeletonLine className="mt-2 h-3.5 w-44 max-w-full" />
        <SkeletonLine className="mt-2 h-2.5 w-32 max-w-full" />
      </div>
      <SkeletonLine className="h-8 w-14 rounded-full" />
    </div>
  );
}

function SubjectSkeleton() {
  return (
    <div className="learn-subject-card skeleton-card rounded-[18px] p-3">
      <div className="flex items-center justify-between gap-2">
        <SkeletonLine className="h-9 w-9 rounded-[14px]" />
        <SkeletonLine className="h-6 w-12 rounded-full" />
      </div>
      <SkeletonLine className="mt-3 h-3.5 w-28 max-w-full" />
      <SkeletonLine className="mt-2 h-2.5 w-24 max-w-full" />
      <SkeletonLine className="mt-3 h-1.5 w-full rounded-full" />
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="role-section-card skeleton-card rounded-[18px] p-3">
      <SkeletonLine className="h-2.5 w-24" />
      <SkeletonLine className="mt-2 h-4 w-48 max-w-full" />
      <SkeletonLine className="mt-2 h-2.5 w-full" />
      <SkeletonLine className="mt-1.5 h-2.5 w-3/4" />
    </div>
  );
}

export default function LazyLoadSkeleton({ count = 3, variant = 'list', className = '' }) {
  const Skeleton = variant === 'subject' ? SubjectSkeleton : variant === 'card' ? CardSkeleton : ListSkeleton;

  return (
    <div className={className || (variant === 'subject' ? 'grid grid-cols-2 gap-2.5' : 'grid gap-2.5')}>
      {rows(count).map((index) => (
        <Skeleton key={index} />
      ))}
    </div>
  );
}
