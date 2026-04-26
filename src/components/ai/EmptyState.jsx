import { FiInbox } from 'react-icons/fi';

export default function EmptyState({ title = 'Belum ada data', message = 'Data akan tampil setelah aktivitas pertama selesai.' }) {
  return (
    <div className="glass rounded-mobile p-6 text-center">
      <FiInbox className="mx-auto text-4xl text-royal" />
      <h3 className="mt-3 font-black">{title}</h3>
      <p className="mt-1 text-sm font-semibold text-slate-500">{message}</p>
    </div>
  );
}
