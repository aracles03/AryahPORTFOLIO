import styles from './SpamPopup.module.css'

const MESSAGES = [
  {
    title: 'System Error 0x404',
    sub: 'Kamu yakin nggak mau tahu lebih lanjut?',
    no: 'Tetap Tidak',
    yes: 'Oke, lihat',
  },
  {
    title: 'Critical Error',
    sub: 'Portfolio ini terlalu bagus untuk dilewatkan',
    no: 'Skip aja',
    yes: 'Yaudah lihat',
  },
  {
    title: 'Warning: Curiosity.exe',
    sub: 'Masa nggak penasaran sama sekali?',
    no: 'Nggak mau',
    yes: 'Fine, tunjukin',
  },
  {
    title: 'Fatal Error 0x999',
    sub: 'Kamu pasti nyesel kalau nggak lihat ini',
    no: 'Mungkin nanti',
    yes: 'Boleh lihat',
  },
  {
    title: 'Error: Last_Chance.exe',
    sub: 'Sungguh-sungguh ini, last chance',
    no: 'Nggak banget',
    yes: 'Yuk lihat',
  },
  {
    title: 'Unexpected Error',
    sub: 'Ada sesuatu yang perlu kamu tahu',
    no: 'Apaan sih',
    yes: 'Apa? Mau lihat',
  },
  {
    title: 'Not a Virus (Promise)',
    sub: 'Ini bukan spam... atau iya?',
    no: 'Spam banget',
    yes: 'Penasaran nih',
  },
  {
    title: 'Final Warning',
    sub: 'Terakhir beneran nih, promise',
    no: 'Ogah',
    yes: 'Oke deh',
    isEscape: true,
  },
]

let globalIdx = 0

export default function SpamPopup({ id, x, y, onClose, onAccept }) {
  const msg = MESSAGES[globalIdx % MESSAGES.length]
  globalIdx++

  return (
    <div
      className={styles.popup}
      style={{ left: x, top: y }}
      role="dialog"
      aria-modal="false"
      aria-label={msg.title}
    >
      <div className={styles.titlebar}>
        <span className={styles.titlebarText}>⚠ {msg.title}</span>
        <button
          className={styles.closeBtn}
          onClick={() => onClose(id)}
          aria-label="Tutup"
        >
          ✕
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.iconCol}>
          <span className={styles.errorIcon}>!</span>
        </div>
        <div className={styles.textCol}>
          <p className={styles.sub}>{msg.sub}</p>
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.btnNo} onClick={() => onClose(id, msg.isEscape === true)}>
          {msg.no}
        </button>
        <button className={styles.btnYes} onClick={onAccept}>
          {msg.yes}
        </button>
      </div>
    </div>
  )
}
