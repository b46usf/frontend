export default function LoadingState({ label = 'Memuat data' }) {
  return (
    <div className="glass rounded-mobile p-5">
      <div className="h-4 w-32 animate-pulse rounded-full bg-slate-200" />
      <div className="mt-4 h-20 animate-pulse rounded-2xl bg-slate-200" />
      <p className="mt-3 text-sm font-bold text-slate-500">{label}...</p>
    </div>
  );
}
