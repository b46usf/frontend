export default function QuizCard({ question, value, onChange }) {
  return (
    <article className="quiz-card rounded-[20px] p-3.5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-royal">{question.type === 'essay' ? 'Esai Singkat' : 'Pilihan Ganda'}</p>
        <span className="quiz-card-type rounded-full px-2.5 py-1 text-[10px] font-black">{question.type === 'essay' ? 'Teks' : 'PG'}</span>
      </div>
      <h3 className="mt-2 text-[14px] font-black leading-5">{question.prompt}</h3>
      {question.options ? (
        <div className="mt-3 grid gap-2">
          {question.options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`quiz-option rounded-[16px] px-3.5 py-2.5 text-left text-[13px] font-black ${value === option ? 'is-selected' : ''}`}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <textarea
          value={value || ''}
          onChange={(event) => onChange(event.target.value)}
          className="quiz-textarea mt-3 min-h-24 w-full rounded-[16px] p-3 text-[13px] font-semibold outline-none"
          placeholder="Tulis jawaban singkat..."
        />
      )}
    </article>
  );
}
