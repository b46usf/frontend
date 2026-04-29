import { useMemo, useState } from 'react';
import { FiActivity, FiArrowLeft, FiArrowRight, FiCheckCircle, FiCpu, FiTarget } from 'react-icons/fi';

export default function DiagnosticTestCard({ diagnostic, onAnswer, onComplete }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const answered = Object.keys(diagnostic.answers).length;
  const total = diagnostic.questions.length;
  const progress = total ? Math.round((answered / total) * 100) : 0;
  const activeQuestion = diagnostic.questions[activeIndex];
  const estimatedLevel = useMemo(() => {
    if (progress >= 80) return 'Advanced';
    if (progress >= 40) return 'Intermediate';
    return 'Basic';
  }, [progress]);

  if (!activeQuestion) {
    return (
      <section className="diagnostic-card rounded-[22px] p-6 text-center">
        <FiCpu className="mx-auto text-3xl text-royal" />
        <h2 className="mt-3 text-[16px] font-black">Tes diagnostik belum tersedia</h2>
        <p className="mt-1 text-[12px] font-bold text-slate-500">Soal dari backend akan tampil setelah data diagnostik dibuat.</p>
      </section>
    );
  }

  const selectedAnswer = diagnostic.answers[activeQuestion.id];
  const options = activeQuestion.options || [];
  const unanswered = Math.max(total - answered, 0);

  const goToNext = () => setActiveIndex((index) => Math.min(total - 1, index + 1));
  const goToPrevious = () => setActiveIndex((index) => Math.max(0, index - 1));

  const handleAnswer = (value) => {
    onAnswer(activeQuestion.id, value);
  };

  return (
    <section className="diagnostic-card rounded-[22px] p-3.5">
      <div className="diagnostic-hero rounded-[20px] p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-gold">Tes Diagnostik AI</p>
            <h2 className="mt-1 break-words text-[18px] font-black leading-6 text-white">Ukur level awal kamu</h2>
            <p className="mt-1 text-[12px] font-bold leading-5 text-slate-200">Jawab 10 soal adaptif untuk membuka jalur belajar personal.</p>
          </div>
          <div className="diagnostic-main-icon grid h-12 w-12 shrink-0 place-items-center rounded-[17px]">
            <FiCpu className="text-[20px]" />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="diagnostic-metric rounded-[14px] px-2 py-2">
            <FiTarget className="mx-auto text-[15px]" />
            <strong>{activeIndex + 1}/{total}</strong>
            <span>Posisi</span>
          </div>
          <div className="diagnostic-metric rounded-[14px] px-2 py-2">
            <FiActivity className="mx-auto text-[15px]" />
            <strong>{progress}%</strong>
            <span>Terisi</span>
          </div>
          <div className="diagnostic-metric rounded-[14px] px-2 py-2">
            <FiCheckCircle className="mx-auto text-[15px]" />
            <strong>{unanswered}</strong>
            <span>Sisa</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-[11px] font-black leading-4 text-slate-500">Estimasi sementara: {estimatedLevel}</span>
        <span className="text-[11px] font-black leading-4 text-royal">{answered}/{total} soal</span>
      </div>
      <div className="diagnostic-track mt-1.5">
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="diagnostic-stepper mt-3 grid grid-cols-10 gap-1.5">
        {diagnostic.questions.map((question, index) => {
          const answeredStep = Boolean(diagnostic.answers[question.id]);
          const active = index === activeIndex;

          return (
            <button
              key={question.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`diagnostic-step rounded-full text-[10px] font-black ${answeredStep ? 'is-answered' : ''} ${active ? 'is-active' : ''}`}
              aria-label={`Buka soal ${index + 1}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <article className="diagnostic-question active rounded-[20px] p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase leading-3 tracking-[0.13em] text-royal">
              Soal {String(activeIndex + 1).padStart(2, '0')} - {activeQuestion.difficulty}
            </p>
            <h3 className="mt-2 break-words text-[15px] font-black leading-6">{activeQuestion.prompt}</h3>
          </div>
          <span className="diagnostic-topic shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black leading-3">{activeQuestion.topic}</span>
        </div>

        {options.length > 0 ? (
          <div className="mt-3 grid gap-2">
            {options.map((option) => {
            const selected = selectedAnswer === option;

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleAnswer(option)}
                className={`diagnostic-option flex min-h-12 items-center justify-between gap-3 rounded-[16px] px-3.5 py-2.5 text-left text-[13px] font-black leading-5 ${selected ? 'is-selected' : ''}`}
              >
                <span className="min-w-0 break-words">{option}</span>
                <span className="diagnostic-option-check grid h-6 w-6 shrink-0 place-items-center rounded-full">
                  {selected && <FiCheckCircle className="text-[14px]" />}
                </span>
              </button>
            );
            })}
          </div>
        ) : (
          <textarea
            value={selectedAnswer || ''}
            onChange={(event) => handleAnswer(event.target.value)}
            className="quiz-textarea mt-3 min-h-24 w-full rounded-[16px] p-3 text-[13px] font-semibold outline-none"
            placeholder="Tulis jawaban singkat..."
          />
        )}
      </article>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={activeIndex === 0}
          onClick={goToPrevious}
          className="diagnostic-secondary flex h-11 items-center justify-center gap-2 rounded-[16px] px-3 text-[12px] font-black disabled:opacity-45"
        >
          <FiArrowLeft />
          Kembali
        </button>
        {activeIndex < total - 1 ? (
          <button type="button" onClick={goToNext} className="diagnostic-next flex h-11 items-center justify-center gap-2 rounded-[16px] px-3 text-[12px] font-black text-white">
            Lanjut
            <FiArrowRight />
          </button>
        ) : (
          <button
            type="button"
            disabled={answered < total}
            onClick={onComplete}
            className="diagnostic-submit flex h-11 items-center justify-center gap-2 rounded-[16px] px-3 text-[12px] font-black text-white disabled:opacity-55"
          >
            Selesai
            <FiCheckCircle />
          </button>
        )}
      </div>
    </section>
  );
}
