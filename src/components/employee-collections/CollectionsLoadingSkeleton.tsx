import styles from './CollectionsLoadingSkeleton.module.css';

export default function CollectionsLoadingSkeleton(): JSX.Element {
  return (
    <div>
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className={`skeleton ${styles.card}`} />
      ))}
    </div>
  );
}
