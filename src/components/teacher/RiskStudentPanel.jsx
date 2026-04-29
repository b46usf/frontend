import { useEffect, useState } from 'react';
import { FiAlertTriangle, FiCheckCircle, FiMessageSquare } from 'react-icons/fi';

const riskMeta = {
  safe: { label: 'Hijau', icon: FiCheckCircle },
  watch: { label: 'Kuning', icon: FiAlertTriangle },
  danger: { label: 'Merah', icon: FiAlertTriangle },
};

export default function RiskStudentPanel({ students = [], onSendIntervention }) {
  const displayStudents = students;
  const [selectedName, setSelectedName] = useState('');

  useEffect(() => {
    if (!selectedName && displayStudents[0]?.name) {
      setSelectedName(displayStudents[0].name);
    }
  }, [displayStudents, selectedName]);

  if (!displayStudents.length) {
    return (
      <section className="risk-panel rounded-[20px] p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-royal">Risk Student Detection</p>
            <h3 className="mt-1 break-words text-[15px] font-black leading-5">Prioritas intervensi AI</h3>
          </div>
          <span className="risk-count rounded-full px-2.5 py-1 text-[10px] font-black leading-3">0 siswa</span>
        </div>
        <div className="mt-3 rounded-[16px] p-3 text-center text-[12px] font-bold text-slate-500">
          Belum ada siswa prioritas dari backend.
        </div>
      </section>
    );
  }

  const selected = displayStudents.find((student) => student.name === selectedName) || displayStudents[0];
  const SelectedIcon = riskMeta[selected.tone]?.icon || FiAlertTriangle;

  return (
    <section className="risk-panel rounded-[20px] p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-royal">Risk Student Detection</p>
          <h3 className="mt-1 break-words text-[15px] font-black leading-5">Prioritas intervensi AI</h3>
        </div>
        <span className="risk-count rounded-full px-2.5 py-1 text-[10px] font-black leading-3">{displayStudents.length} siswa</span>
      </div>

      <div className="mt-3 grid gap-2">
        {displayStudents.map((student) => {
          const active = student.name === selectedName;
          const Icon = riskMeta[student.tone]?.icon || FiAlertTriangle;

          return (
            <button
              key={student.name}
              type="button"
              onClick={() => setSelectedName(student.name)}
              className={`risk-row risk-${student.tone} ${active ? 'is-active' : ''} flex items-center justify-between gap-3 rounded-[15px] p-2.5 text-left`}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="risk-icon grid h-9 w-9 shrink-0 place-items-center rounded-[13px]">
                  <Icon className="text-[16px]" />
                </span>
                <div className="min-w-0">
                  <p className="break-words text-[12px] font-black leading-4">{student.name}</p>
                  <p className="text-[10px] font-bold leading-3 text-slate-500">{riskMeta[student.tone]?.label || 'Kuning'} - {student.risk}</p>
                </div>
              </div>
              <span className="risk-score shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black">{student.score}</span>
            </button>
          );
        })}
      </div>

      <article className={`risk-recommendation risk-${selected.tone} mt-3 rounded-[16px] p-3`}>
        <div className="flex items-start gap-2.5">
          <span className="risk-icon grid h-9 w-9 shrink-0 place-items-center rounded-[13px]">
            <SelectedIcon className="text-[16px]" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase leading-3 tracking-[0.14em]">AI Recommendation</p>
            <h4 className="mt-1 break-words text-[13px] font-black leading-5">{selected.name}</h4>
            <p className="mt-1 break-words text-[11px] font-bold leading-4 text-slate-500">{selected.reason}</p>
            <p className="mt-2 break-words text-[12px] font-bold leading-5">{selected.intervention}</p>
          </div>
        </div>
      </article>

      <button
        type="button"
        onClick={() => onSendIntervention?.(selected)}
        className="teacher-intervention-btn mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-[16px] px-4 text-[12px] font-black text-white"
      >
        <FiMessageSquare />
        Kirim Arahan
      </button>
    </section>
  );
}
