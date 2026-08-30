import { useEffect } from 'react'
import styles from './ProjectDetail.module.css'
import { useLanguage } from '../context/LanguageContext'

export default function ProjectDetail({ project, onBack }) {
  const { lang } = useLanguage()

  // Simple fade-in on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const longDesc = (lang === 'en' ? project.longDesc_en : project.longDesc) || project.longDesc
  const highlights = (lang === 'en' ? project.highlights_en : project.highlights) || project.highlights
  const name = (lang === 'en' ? project.name_en : project.name) || project.name
  const type = (lang === 'en' ? project.type_en : project.type) || project.type

  return (
    <div className={styles.page}>

      {/* Single back button - top left */}
      <button className={styles.backBtn} onClick={onBack}>
        <span className={styles.backArrow}>←</span> {lang === 'id' ? 'Kembali ke Proyek' : 'Back to Projects'}
      </button>

      {/* Main single-column layout: video di atas-tengah, teks di bawah */}
      <div className={styles.layout}>

        {/* TOP - video, centered */}
        <div className={styles.top}>
          <div className={styles.videoWrap}>
            {project.comingSoon ? (
              <div className={styles.comingSoonWrap}>
                <img className={styles.cover} src={project.image} alt={name} />
                <span className={styles.comingSoonBadgeLarge}>{lang === 'id' ? 'Segera Hadir' : 'Coming Soon'}</span>
              </div>
            ) : (
              <video
                className={styles.cover}
                poster={project.image}
                controls
                playsInline
                preload="metadata"
              >
                {/* Taruh file video kamu di public/projects/videos/ dengan nama sesuai path project.video */}
                <source src={project.video} type="video/mp4" />
              </video>
            )}
          </div>
        </div>

        {/* BOTTOM - all text */}
        <div className={styles.bottom}>
          <p className={styles.meta}>{project.year} · {type}</p>
          <h1 className={styles.title}>{name}</h1>
          <p className={styles.desc}>{longDesc}</p>

          {highlights && (
            <div className={styles.highlights}>
              <p className={styles.label}>{lang === 'id' ? 'Sorotan' : 'Highlights'}</p>
              <ul className={styles.list}>
                {highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          )}

          {project.tech && (
            <div className={styles.techSection}>
              <p className={styles.label}>{lang === 'id' ? 'Tumpukan Teknologi' : 'Tech Stack'}</p>
              <div className={styles.techRow}>
                {project.tech.map((t) => (
                  <span key={t} className={styles.techPill}>{t}</span>
                ))}
              </div>
            </div>
          )}

          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className={styles.visitBtn}
            >
              <span>{lang === 'id' ? 'Kunjungi Proyek' : 'Visit Project'}</span>
              <span className={styles.visitArrow}>↗</span>
            </a>
          )}
        </div>

      </div>
    </div>
  )
}
