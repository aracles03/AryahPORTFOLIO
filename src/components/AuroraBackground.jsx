import styles from './AuroraBackground.module.css'

// Soft, slowly drifting abstract color blobs — like flowing air/aurora,
// sitting behind all page content for a bit of ambient atmosphere.
export default function AuroraBackground() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <span className={`${styles.blob} ${styles.blob1}`} />
      <span className={`${styles.blob} ${styles.blob2}`} />
      <span className={`${styles.blob} ${styles.blob3}`} />
      <span className={`${styles.blob} ${styles.blob4}`} />
    </div>
  )
}
