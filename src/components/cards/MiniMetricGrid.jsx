const variants = {
  profile: {
    item: 'profile-mini-card',
    tonePrefix: 'profile-mini',
    icon: 'profile-mini-icon',
    value: 'profile-mini-value',
    label: 'profile-mini-label',
    helper: 'profile-mini-helper',
  },
  quiz: {
    item: 'quiz-meta-card',
    tonePrefix: 'quiz-meta',
    icon: 'quiz-meta-icon',
    value: 'quiz-meta-value',
    label: 'quiz-meta-label',
    helper: 'quiz-meta-helper',
  },
  feedback: {
    item: 'ai-feedback-metric',
    tonePrefix: 'ai-feedback',
    icon: 'ai-feedback-metric-icon',
  },
  learningPath: {
    item: 'learn-path-metric',
    tonePrefix: 'learn-path-metric',
    icon: 'learn-path-metric-icon',
  },
};

const columns = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
};

const cx = (...classes) => classes.filter(Boolean).join(' ');

export default function MiniMetricGrid({ metrics, variant = 'profile', columnCount = 3, className = 'mt-3', gapClassName = 'gap-2' }) {
  const styles = variants[variant] || variants.profile;

  return (
    <div className={cx(className, 'grid', columns[columnCount] || columns[3], gapClassName)}>
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const tone = metric.tone || 'royal';

        return (
          <div key={metric.label} className={cx(styles.item, `${styles.tonePrefix}-${tone}`, 'rounded-[14px] px-2 py-2')}>
            {Icon && (
              <span className={cx(styles.icon, 'mx-auto grid h-7 w-7 place-items-center rounded-[11px]')}>
                <Icon className="text-[14px]" />
              </span>
            )}
            <strong className={styles.value}>{metric.value}</strong>
            <span className={styles.label}>{metric.label}</span>
            {metric.helper && <small className={styles.helper}>{metric.helper}</small>}
          </div>
        );
      })}
    </div>
  );
}
