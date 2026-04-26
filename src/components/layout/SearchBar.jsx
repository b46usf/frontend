import { FiSearch } from 'react-icons/fi';

export default function SearchBar({ placeholder = 'Cari materi, kelas, atau siswa' }) {
  return (
    <label className="search-shell flex h-10 items-center gap-2.5 rounded-[16px] px-3.5">
      <FiSearch className="text-[15px] text-royal" />
      <input className="w-full bg-transparent text-[13px] font-semibold outline-none placeholder:text-slate-400" placeholder={placeholder} />
    </label>
  );
}
