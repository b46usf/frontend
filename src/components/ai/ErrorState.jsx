import { FiAlertTriangle } from 'react-icons/fi';

export default function ErrorState({ message = 'Data belum bisa dimuat.' }) {
  return (
    <div className="rounded-mobile border border-danger/20 bg-danger/10 p-4 text-danger">
      <FiAlertTriangle className="text-2xl" />
      <p className="mt-2 text-sm font-black">{message}</p>
    </div>
  );
}
