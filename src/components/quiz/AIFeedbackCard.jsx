import { FiCheckCircle, FiCpu, FiTarget, FiTrendingUp } from 'react-icons/fi';
import MiniMetricGrid from '../cards/MiniMetricGrid.jsx';

export default function AIFeedbackCard({ assessment }) {
  if (!assessment) return null;

  const metrics = [
    { label: 'Skor', value: assessment.score, icon: FiTarget, tone: 'royal' },
    { label: 'Level', value: assessment.level, icon: FiCpu, tone: 'gold' },
    { label: 'Trend', value: assessment.trend, icon: FiTrendingUp, tone: 'success' },
  ];

  return (
    <article className="ai-feedback-card rounded-[20px] p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-royal">AI Feedback</p>
          <h3 className="mt-1 break-words text-[15px] font-black leading-5">Hasil penilaian instan</h3>
        </div>
        <div className="ai-feedback-icon grid h-10 w-10 shrink-0 place-items-center rounded-[15px]">
          <FiCheckCircle className="text-[18px]" />
        </div>
      </div>

      <MiniMetricGrid metrics={metrics} variant="feedback" />

      <div className="ai-feedback-copy mt-3 rounded-[16px] px-3 py-2">
        <p className="text-[10px] font-black uppercase leading-3 tracking-[0.14em]">AI Insight</p>
        <p className="mt-1 text-[12px] font-bold leading-5">{assessment.insight}</p>
      </div>
      <div className="ai-feedback-copy mt-2 rounded-[16px] px-3 py-2">
        <p className="text-[10px] font-black uppercase leading-3 tracking-[0.14em]">Rekomendasi</p>
        <p className="mt-1 text-[12px] font-bold leading-5">{assessment.recommendation}</p>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-[11px] font-black text-slate-500">Confidence score</span>
        <span className="text-[11px] font-black text-royal">{assessment.confidence}%</span>
      </div>
      <div className="ai-feedback-track mt-1.5">
        <span style={{ width: `${assessment.confidence}%` }} />
      </div>

      {assessment.results?.length > 0 && (
        <div className="mt-3 grid gap-2">
          {assessment.results.map((item) => (
            <div key={item.id} className="ai-feedback-breakdown rounded-[14px] px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-black">{item.type === 'essay' ? 'Essay scoring' : 'Pilihan ganda'}</span>
                <span className="text-[11px] font-black text-royal">{item.score}%</span>
              </div>
              <p className="mt-0.5 text-[10px] font-bold leading-4 text-slate-500">
                {item.method} - confidence {item.confidence}%
              </p>
              {item.matchedKeywords?.length > 0 && (
                <p className="mt-0.5 text-[10px] font-bold leading-4 text-slate-500">
                  Keyword: {item.matchedKeywords.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
