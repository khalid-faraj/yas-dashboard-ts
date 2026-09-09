import styles from './DashboardHeader.module.css';

export interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function DashboardHeader({
  title = 'لوحة تحكم المبيعات',
  subtitle = 'تحليل أداء المبيعات خلال الفترة المحددة',
}: DashboardHeaderProps): JSX.Element {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>

      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );
}
