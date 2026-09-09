import styles from './KpiCard.module.css';

export type KpiCardTone = 'primary' | 'success' | 'danger' | 'neutral';

export interface KpiCardProps {
  label: string;
  value: string;
  icon: string;
  tone?: KpiCardTone;
  hint?: string;
}

export default function KpiCard({
  label,
  value,
  icon,
  tone = 'neutral',
  hint,
}: KpiCardProps): JSX.Element {
  return (
    <div className={styles.card}>
      <div className={`${styles.iconWrap} ${styles[`tone_${tone}`]}`}>
        {icon}
      </div>
      <div className={styles.body}>
        <div className={styles.value}>{value}</div>
        <div className={styles.label}>{label}</div>
        {hint && <div className={styles.hint}>{hint}</div>}
      </div>
    </div>
  );
}
