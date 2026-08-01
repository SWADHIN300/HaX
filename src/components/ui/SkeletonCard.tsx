export default function SkeletonCard() {
  return (
    <div className="card p-4 desktop:p-5">
      {/* Source badge */}
      <div className="flex items-center gap-2 mb-3">
        <div className="skeleton w-2 h-2 rounded-full" />
        <div className="skeleton w-16 h-3" />
      </div>

      {/* Title */}
      <div className="skeleton w-full h-4 mb-2" />
      <div className="skeleton w-3/4 h-4 mb-3" />

      {/* Date + location */}
      <div className="flex gap-3 mb-3">
        <div className="skeleton w-28 h-3" />
        <div className="skeleton w-20 h-3" />
      </div>

      {/* Prize */}
      <div className="skeleton w-16 h-6 mb-3" />

      {/* Tags */}
      <div className="flex gap-2">
        <div className="skeleton w-12 h-5 rounded" />
        <div className="skeleton w-16 h-5 rounded" />
      </div>
    </div>
  );
}
