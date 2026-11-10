import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  SiReact, SiNextdotjs, SiTypescript, SiNodedotjs,
  SiPython, SiJavascript, SiMysql, SiGithub,
} from 'react-icons/si'
import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { useTypewriter } from '../hooks/useTypewriter'
import { useTypewriterLoop } from '../hooks/useTypewriterLoop'
import { useLanguage } from '../context/LanguageContext'
import Cursor from './Cursor'
import styles from './Portfolio.module.css'

const PROJECTS = [
  {
    slug: 'gestabuild',
    year: 'Jun 2026 - Jul 2026',
    name: 'GestaBuild - Gesture-Based Architectural Builder',
    name_en: 'GestaBuild - Gesture-Based Architectural Builder',
    type: 'UI/UX Design · Web App',
    image: '/projects/gestabuild.png',
    video: '/projects/videos/gestabuild.mp4',
    url: 'https://gestabuild.netlify.app/',
    color: '#1B2A56',
    shortDesc: 'Dashboard manajemen proyek konstruksi dengan tema biru tua yang rapi dan profesional.',
    longDesc: 'GestaBuild adalah rancangan UI/UX dashboard web untuk membantu tim konstruksi mengelola proyek pembangunan secara terpusat. Desain menggunakan tema biru tua (dark blue) yang memberi kesan profesional dan fokus, dilengkapi ringkasan progres proyek, manajemen tugas, dan timeline pekerjaan agar tim dapat memantau jalannya proyek secara real-time.',
    highlights: [
      'Dashboard ringkasan progres, anggaran, dan status proyek konstruksi',
      'Manajemen tugas & timeline pekerjaan tim di lapangan',
      'Visualisasi data proyek yang jelas dengan tema biru tua modern',
      'Alur navigasi yang rapi untuk memudahkan monitoring multi-proyek',
    ],
    shortDesc_en: 'A construction project management dashboard with a clean, professional dark-blue theme.',
    longDesc_en: 'GestaBuild is a UI/UX design for a web dashboard that helps construction teams manage building projects from one central place. The design uses a dark-blue theme for a professional, focused feel, complete with a progress overview, task management, and a work timeline so the team can monitor the project in real time.',
    highlights_en: [
      'Dashboard summarizing progress, budget, and construction project status',
      'Task management & work timeline for the on-site team',
      'Clear data visualization with a modern dark-blue theme',
      'Clean navigation flow to make multi-project monitoring easier',
    ],
    tech: ['Figma', 'UI/UX Design', 'Web App', 'Design System'],
  },
  {
    slug: 'Mochitopia',
    year: 'May 2026 - Jun 2026',
    name: 'Mochitopia - Platform Belajar Adaptif',
    name_en: 'Mochitopia - Adaptive Learning Platform',
    type: 'Web App · React · Node.js',
    image: '/projects/Mochitopia.png',
    video: '/projects/videos/mochitopia.mp4',
    url: 'https://mochitopia.netlify.app/',
    color: '#EC4899',
    shortDesc: 'Platform quiz belajar yang lucu, colorful, dan menyenangkan untuk siswa.',
    longDesc: 'Mochitopia adalah platform quiz belajar interaktif untuk siswa, mengemas materi pelajaran seperti Bahasa Indonesia, Matematika, dan Kimia ke dalam kuis singkat yang berwarna-warni dan menyenangkan. Ditemani maskot kucing lucu bernama Mochi, platform ini dirancang agar proses belajar terasa seperti bermain game.',
    highlights: [
      'Kuis interaktif untuk berbagai mata pelajaran (Bahasa Indonesia, Matematika, Kimia, dsb.)',
      'Desain playful dengan maskot "Mochi" dan palet warna pastel yang ceria',
      'Kartu mata pelajaran warna-warni yang mudah dinavigasi',
    ],
    shortDesc_en: 'A cute, colorful, and fun learning quiz platform for students.',
    longDesc_en: 'Mochitopia is an interactive learning quiz platform for students, packaging subjects like Bahasa Indonesia, Math, and Chemistry into short, colorful, and fun quizzes. Accompanied by a cute cat mascot named Mochi, the platform is designed to make learning feel like playing a game.',
    highlights_en: [
      'Interactive quizzes for various subjects (Bahasa Indonesia, Math, Chemistry, etc.)',
      'Playful design with the "Mochi" mascot and a cheerful pastel color palette',
      'Colorful subject cards that are easy to navigate',
    ],
    tech: ['React', 'Node.js', 'HTML', 'CSS'],
  },
  {
    slug: 'rekalimbah',
    year: 'May 2026 - Jul 2026',
    name: 'RekaLimbah - Platform Edukasi Limbah Rumah Tangga',
    name_en: 'RekaLimbah - Waste Education Platform',
    type: 'Web App · React · Node.js',
    image: '/projects/rekalimbah.png',
    video: '/projects/videos/rekalimbah.mp4',
    url: 'https://rekalimbah.netlify.app/',
    color: '#2E8B57',
    shortDesc: 'Platform edukasi upcycling limbah rumah tangga jadi kerajinan bernilai guna.',
    longDesc: 'RekaLimbah adalah platform yang memiliki tujuan untuk mengedukasi pengguna tentang limbah rumah tangga, seperti botol plastik, kardus, hingga kain perca, dan mengubahnya menjadi ide kerajinan (upcycling) yang aman dan bernilai guna. Cukup pilih atau tulis jenis limbah yang dimiliki, RekaLimbah akan menyarankan beberapa ide proyek lengkap dengan langkah pembuatannya.',
    shortDesc_en: 'An educational platform that upcycles household waste into useful crafts.',
    longDesc_en: 'RekaLimbah is a platform aimed at educating users about household waste - such as plastic bottles, cardboard, and fabric scraps - and turning it into safe, useful craft ideas (upcycling). Simply pick or type in the kind of waste you have, and RekaLimbah will suggest project ideas complete with step-by-step instructions.',
    tech: ['React', 'Node.js', 'HTML', 'CSS'],
  },
  {
    slug: 'ombara',
    year: 'Jun 2026 - Jul 2026',
    name: 'Ombara - 100 Destinasi Wisata Indonesia',
    name_en: 'Ombara - 100 Indonesian Tourist Destinations',
    type: 'UI/UX Design · Mobile App',
    image: '/projects/ombara.png',
    video: '/projects/videos/ombara.mp4',
    url: 'https://ombara.netlify.app/',
    color: '#4ADE80',
    shortDesc: 'Aplikasi eksplorasi 100 destinasi wisata Indonesia dengan tema gelap hitam-hijau yang premium.',
    longDesc: 'Ombara adalah rancangan UI/UX aplikasi mobile untuk menjelajahi 100 destinasi wisata terbaik di Indonesia, mulai dari wisata alam, budaya, hingga kuliner. Desain mengusung tema dark mode hitam-hijau untuk memberi kesan elegan dan modern, dengan navigasi yang intuitif sehingga pengguna dapat menemukan, menyimpan, dan merencanakan perjalanan ke destinasi favorit dengan mudah.',
    highlights: [
      'Katalog 100 destinasi wisata Indonesia lengkap dengan kategori (alam, budaya, kuliner, dsb.)',
      'Halaman detail destinasi dengan deskripsi, rating, dan rekomendasi itinerary',
      'Fitur pencarian & filter untuk menemukan destinasi sesuai preferensi',
      'Tema dark mode hitam-hijau yang konsisten di seluruh alur aplikasi',
    ],
    shortDesc_en: 'An app for exploring 100 Indonesian tourist destinations with a premium black-green dark theme.',
    longDesc_en: 'Ombara is a UI/UX design for a mobile app to explore the 100 best tourist destinations in Indonesia, from nature and culture to culinary spots. The design uses a black-green dark mode theme for an elegant, modern feel, with intuitive navigation so users can easily find, save, and plan trips to their favorite destinations.',
    highlights_en: [
      'A catalog of 100 Indonesian destinations complete with categories (nature, culture, culinary, etc.)',
      'Destination detail pages with descriptions, ratings, and itinerary recommendations',
      'Search & filter features to find destinations that match your preferences',
      'A consistent black-green dark mode theme throughout the whole app flow',
    ],
    tech: ['Figma', 'UI/UX Design', 'Mobile App', 'Design System'],
  },
  {
    slug: 'pupd',
    year: 'Sept 2025 - May 2026',
    name: 'PUPD - President University Phishing Detection',
    name_en: 'PUPD - President University Phishing Detection',
    type: 'Web App · Python · ML',
    image: '/projects/pupd.png',
    video: '/projects/videos/pupd.mp4',
    url: 'https://pupdfsl.streamlit.app/',
    color: '#D14850',
    shortDesc: 'Platform deteksi phishing pada email berbasis machine learning.',
    longDesc: 'President University Phishing Detector (PUPD) adalah platform berbasis web yang dikembangkan untuk membantu pengguna mendeteksi potensi upaya phishing pada pesan email. Dengan memasukkan alamat email dan isi pesan yang ingin dianalisis, pengguna bisa dengan cepat mendapatkan hasil deteksi phishing melalui website maupun notifikasi email.',
    shortDesc_en: 'A machine-learning-based platform for detecting phishing emails.',
    longDesc_en: 'President University Phishing Detector (PUPD) is a web-based platform developed to help users detect potential phishing attempts in email messages. By entering the email address and message content to be analyzed, users can quickly get the phishing detection result through the website or an email notification.',
    tech: ['Python', 'Uvicorn API', 'Streamlit', 'Machine Learning'],
  },
  {
    slug: 'archieter',
    year: '2026',
    name: 'Archieter',
    name_en: 'Archieter',
    type: 'UI/UX Design · Segera Hadir',
    type_en: 'UI/UX Design · Coming Soon',
    image: '/projects/archieter.png',
    color: '#9CA3AF',
    comingSoon: true,
    shortDesc: 'Project baru yang sedang dalam tahap desain, segera hadir.',
    longDesc: 'Archieter masih dalam tahap perancangan UI/UX. Detail lengkap tentang project ini akan segera diupdate - stay tuned!',
    shortDesc_en: 'A new project currently in the design stage, coming soon.',
    longDesc_en: 'Archieter is still in the UI/UX design stage. Full details about this project will be updated soon - stay tuned!',
  },
]

const METRIC_LABEL_EN = {
  'Penguasaan Konsep': 'Concept Mastery',
  'Pengalaman Proyek': 'Project Experience',
  'Frekuensi Pemakaian': 'Usage Frequency',
}

const STACK = [
  {
    name: 'React.js', Icon: SiReact, color: '#61DAFB',
    metrics: [
      { label: 'Penguasaan Konsep', value: 85 },
      { label: 'Pengalaman Proyek', value: 95 },
      { label: 'Frekuensi Pemakaian', value: 90 },
    ],
  },
  {
    name: 'Next.js', Icon: SiNextdotjs, color: '#111111',
    metrics: [
      { label: 'Penguasaan Konsep', value: 75 },
      { label: 'Pengalaman Proyek', value: 60 },
      { label: 'Frekuensi Pemakaian', value: 60 },
    ],
  },
  {
    name: 'TypeScript', Icon: SiTypescript, color: '#3178C6',
    metrics: [
      { label: 'Penguasaan Konsep', value: 70 },
      { label: 'Pengalaman Proyek', value: 60 },
      { label: 'Frekuensi Pemakaian', value: 65 },
    ],
  },
  {
    name: 'Node.js', Icon: SiNodedotjs, color: '#5FA04E',
    metrics: [
      { label: 'Penguasaan Konsep', value: 75 },
      { label: 'Pengalaman Proyek', value: 80 },
      { label: 'Frekuensi Pemakaian', value: 70 },
    ],
  },
  {
    name: 'Python', Icon: SiPython, color: '#3776AB',
    metrics: [
      { label: 'Penguasaan Konsep', value: 85 },
      { label: 'Pengalaman Proyek', value: 80 },
      { label: 'Frekuensi Pemakaian', value: 85 },
    ],
  },
  {
    name: 'JavaScript', Icon: SiJavascript, color: '#F0DB4F',
    metrics: [
      { label: 'Penguasaan Konsep', value: 90 },
      { label: 'Pengalaman Proyek', value: 88 },
      { label: 'Frekuensi Pemakaian', value: 92 },
    ],
  },
  {
    name: 'MySQL', Icon: SiMysql, color: '#4479A1',
    metrics: [
      { label: 'Penguasaan Konsep', value: 90 },
      { label: 'Pengalaman Proyek', value: 85 },
      { label: 'Frekuensi Pemakaian', value: 68 },
    ],
  },
  {
    name: 'GitHub', Icon: SiGithub, color: '#181717',
    metrics: [
      { label: 'Penguasaan Konsep', value: 90 },
      { label: 'Pengalaman Proyek', value: 92 },
      { label: 'Frekuensi Pemakaian', value: 95 },
    ],
  },
]

const EDUCATION = [
  {
    initial: 'S',
    logo: '/logos/education/sman7-manado.png',
    photo: null,
    video: '/education/sman7-manado.mp4',
    institution: 'SMAN 7 Manado',
    major: 'Mathematics and Physics',
    scoreLabel: 'Rata-rata Nilai',
    scoreLabel_en: 'Average Score',
    score: '93 / 100',
    period: '2022 - 2025',
    desc: 'Selama menempuh pendidikan di SMAN 7 Manado, saya aktif di berbagai organisasi dan kepanitiaan sekolah, mulai dari MPK, OSIS, hingga panitia acara-acara besar sekolah. Pengalaman ini melatih saya untuk berkomunikasi, bekerja sama dalam tim, dan bertanggung jawab atas tugas yang diberikan, sekaligus menjadi bekal awal sebelum melanjutkan ke jenjang perkuliahan.',
    desc_en: 'During my studies at SMAN 7 Manado, I was actively involved in various school organizations and committees, from the Student Representative Council (MPK) to the Student Council (OSIS) and several major school event committees. This experience trained me to communicate, work well in a team, and take responsibility for the tasks given to me, serving as a solid foundation before continuing on to university.',
    stats: ['3 Tahun SMA', '3 Tahun Organisasi', '5+ Project', '10+ Sertifikat'],
    stats_en: ['3 Years of High School', '3 Years in Organizations', '5+ Projects', '10+ Certificates'],
  },
  {
    initial: 'P',
    logo: '/logos/education/president-university.png',
    photo: null,
    video: '/education/president-university.mp4',
    institution: 'President University',
    major: 'Information Technology',
    scoreLabel: 'IPK',
    scoreLabel_en: 'GPA',
    score: '3.88 / 4.00',
    period: '2025 - present',
    desc: 'Di President University, saya mengambil jurusan Information Technology sambil aktif berorganisasi dan mengerjakan berbagai proyek, mulai dari pengembangan web, riset, hingga kepanitiaan acara kampus. Lingkungan perkuliahan yang internasional mendorong saya untuk terus belajar hal baru, beradaptasi dengan cepat, dan membangun relasi dengan mahasiswa dari berbagai latar belakang.',
    desc_en: 'At President University, I am majoring in Information Technology while staying active in student organizations and working on a variety of projects, from web development and research to campus event committees. The international campus environment pushes me to keep learning new things, adapt quickly, and build relationships with students from many different backgrounds.',
    stats: ['1+ Year', '6+ Project', '1+ Organisasi', '3.87 GPA'],
    stats_en: ['1+ Year', '6+ Projects', '1+ Organization', '3.87 GPA'],
  },
]

const EXPERIENCE_CATEGORIES = [
  { key: 'highschool', label: 'Organizational in High School', label_id: 'Organisasi di SMA' },
  { key: 'college', label: 'Organizational in College', label_id: 'Organisasi di Kuliah' },
  { key: 'professional', label: 'Professional', label_id: 'Profesional' },
]

// Edit this with your real experience entries.
// - `logo`: the organization/club/event logo shown as the small round icon on the timeline.
//   Every entry has its own `logo` path already set below — Highschool entries share
//   sman7-manado.png, while each College entry points to its own distinct file
//   (e.g. /experience/logos/icon-2026.png). Drop the matching file into
//   /public/experience/logos/ (see the instructions .txt in that folder for the
//   full list). Until a file exists, it automatically falls back to showing the
//   company's first letter — nothing breaks.
// - `photos`: up to 3 event photos shown as a little polaroid stack on each card.
//   Drop matching files into /public/experience/ using the filenames already set below.
//   Missing/not-yet-added photos are skipped automatically (no broken image icons).
const EXPERIENCE = {
  highschool: [
    {
      role: 'Senior Secretary of MPK 23/24',
      role_en: 'Senior Secretary of MPK 23/24',
      company: 'SMAN 7 Manado',
      logo: '/experience/logos/sman7-manado.png',
      period: '2023 - 2024',
      tag: 'Student Council',
      photos: [
        '/experience/SeniorSecretaryofMPK-Photo1',
        '/experience/SeniorSecretaryofMPK-Photo2',
        '/experience/SeniorSecretaryofMPK-Photo3',
      ],
      desc: 'Menjabat sebagai Senior Secretary MPK (Majelis Perwakilan Kelas) periode 2023/2024, menangani dokumentasi dan administrasi organisasi.',
      desc_en: 'Served as Senior Secretary of MPK (Student Representative Council) for the 2023/2024 period, handling organizational documentation and administration.',
    },
    {
      role: 'Secretary of PEMGAS & LDKO 2024',
      role_en: 'Secretary of PEMGAS & LDKO 2024',
      company: 'SMAN 7 Manado',
      logo: '/experience/logos/sman7-manado.png',
      period: '2024',
      tag: 'School Event',
      photos: [
        '/experience/SecretaryofPEMGASLDKO-Photo1',
        '/experience/SecretaryofPEMGASLDKO-Photo2',
        '/experience/SecretaryofPEMGASLDKO-Photo3',
      ],
      desc: 'Menangani dokumentasi dan administrasi kegiatan PEMGAS & LDKO 2024.',
      desc_en: 'Handled documentation and administration for the PEMGAS & LDKO 2024 event.',
    },
    {
      role: 'Secretary of Masa Pengenalan Lingkungan Sekolah (MPLS) 2024',
      role_en: 'Secretary of Masa Pengenalan Lingkungan Sekolah (MPLS) 2024',
      company: 'SMAN 7 Manado',
      logo: '/experience/logos/sman7-manado.png',
      period: '2024',
      tag: 'School Event',
      photos: [
        '/experience/SecretaryofMPLS-Photo1',
        '/experience/SecretaryofMPLS-Photo2',
        '/experience/SecretaryofMPLS-Photo3',
      ],
      desc: 'Menangani dokumentasi dan administrasi kegiatan Masa Pengenalan Lingkungan Sekolah (MPLS) 2024.',
      desc_en: 'Handled documentation and administration for the 2024 School Orientation Period (MPLS).',
    },
    {
      role: 'Secretary of Hari Pendidikan Nasional 2024',
      role_en: 'Secretary of Hari Pendidikan Nasional 2024',
      company: 'SMAN 7 Manado',
      logo: '/experience/logos/sman7-manado.png',
      period: '2024',
      tag: 'School Event',
      photos: [
        '/experience/SecretaryofHariPendidikanNasional-Photo1',
        '/experience/SecretaryofHariPendidikanNasional-Photo2',
        '/experience/SecretaryofHariPendidikanNasional-Photo3',
      ],
      desc: 'Menangani dokumentasi dan administrasi peringatan Hari Pendidikan Nasional 2024.',
      desc_en: "Handled documentation and administration for the 2024 National Education Day commemoration.",
    },
    {
      role: "Secretary of Valentine's Day 2024",
      role_en: "Secretary of Valentine's Day 2024",
      company: 'SMAN 7 Manado',
      logo: '/experience/logos/sman7-manado.png',
      period: '2024',
      tag: 'School Event',
      photos: [
        '/experience/SecretaryofValentinesDay-Photo1',
        '/experience/SecretaryofValentinesDay-Photo2',
        '/experience/SecretaryofValentinesDay-Photo3',
      ],
      desc: "Menangani dokumentasi dan administrasi kegiatan Valentine's Day 2024.",
      desc_en: "Handled documentation and administration for the Valentine's Day 2024 event.",
    },
    {
      role: 'Sekbid 7 OSIS',
      role_en: 'Sekbid 7 OSIS',
      company: 'SMAN 7 Manado',
      logo: '/experience/logos/sman7-manado.png',
      period: '2023 - 2024',
      tag: 'School Event',
      photos: [
        '/experience/Sekbid7OSIS-Photo1',
        '/experience/Sekbid7OSIS-Photo2',
        '/experience/Sekbid7OSIS-Photo3',
      ],
      desc: 'Anggota OSIS Seksi Bidang 7 (Sekbid 7), berkontribusi dalam program kerja dan kegiatan kesiswaan di sekolah.',
      desc_en: 'Member of OSIS Section 7 (Sekbid 7), contributing to student council programs and school activities.',
    },
    {
      role: 'Fund Raising SMANTU CUP 2024',
      role_en: 'Fund Raising SMANTU CUP 2024',
      company: 'SMAN 7 Manado',
      logo: '/experience/logos/sman7-manado.png',
      period: '2024',
      tag: 'Fundraising',
      photos: [
        '/experience/FundRaisingSMANTUCUP-Photo1',
        '/experience/FundRaisingSMANTUCUP-Photo2',
        '/experience/FundRaisingSMANTUCUP-Photo3',
      ],
      desc: 'Bertanggung jawab atas penggalangan dana dan pencarian sponsor untuk kegiatan SMANTU CUP 2024.',
      desc_en: 'Responsible for fundraising and sponsorship outreach for the SMANTU CUP 2024 event.',
    },
  ],
  college: [
    {
      role: 'Wakil Ketua President University Literature and Research Club 2026',
      role_en: 'Vice Chairperson of President University Literature and Research Club 2026',
      company: 'President University',
      logo: '/experience/logos/literature-research-club.png',
      period: 'Agust 2026 - Sekarang',
      period_en: 'Agust 2026 - Present',
      tag: 'Club',
      photos: [
        '/experience/ViceChairpersonofLiteratureResearchClub-Photo1',
        '/experience/ViceChairpersonofLiteratureResearchClub-Photo2',
        '/experience/ViceChairpersonofLiteratureResearchClub-Photo3',
      ],
      desc: 'Membantu perencanaan dan pengawasan serta berkoordinasi dengan berbagai divisi agar semua acara club berjalan lancar.',
      desc_en: 'Assist with planning and supervision, and coordinate with various departments to ensure that all club events run smoothly.',
    },
    {
      role: 'Junior Sekretaris PUMA Informatika 2026',
      role_en: 'Junior Secretary of PUMA Informatics',
      company: 'President University',
      logo: '/experience/logos/puma-informatics.png',
      period: 'Oct 2025 - Agust 2026',
      period_en: 'Okt 2026 - Aug 2026',
      tag: 'Organization',
      photos: [
        '/experience/JuniorSecretaryofPUMAInformatics-Photo1',
        '/experience/JuniorSecretaryofPUMAInformatics-Photo2',
        '/experience/JuniorSecretaryofPUMAInformatics-Photo3',
      ],
      desc: 'Membantu tugas kesekretariatan PUMA (Perhimpunan Mahasiswa) Informatics, termasuk dokumentasi dan administrasi kegiatan organisasi.',
      desc_en: 'Assisted with the secretarial duties of PUMA (Student Association) Informatics, including documentation and administration of organization activities.',
    },
    {
      role: 'Wakil Ketua Pelaksana ICON 2026',
      role_en: 'Vice Project Manager of ICON 2026',
      company: 'President University',
      logo: '/experience/logos/icon-2026.png',
      period: 'Jan 2026 - Apr 2026',
      tag: 'Event Committee',
      photos: [
        '/experience/ViceProjectManagerofICON-Photo1',
        '/experience/ViceProjectManagerofICON-Photo2',
        '/experience/ViceProjectManagerofICON-Photo3',
      ],
      desc: 'Membantu perencanaan dan pengawasan pelaksanaan ICON 2026, berkoordinasi dengan berbagai divisi agar acara berjalan lancar.',
      desc_en: 'Helped plan and oversee the execution of ICON 2026, coordinating across divisions to make sure the event ran smoothly.',
    },
    {
      role: 'Sekretaris Workshop Alumni 2026',
      role_en: 'Secretary of Workshop Alumni 2026',
      company: 'President University',
      logo: '/experience/logos/workshop-alumni.png',
      period: 'Nov 2025 - Feb 2026',
      tag: 'Event Committee',
      photos: [
        '/experience/SecretaryofWorkshopAlumni-Photo1',
        '/experience/SecretaryofWorkshopAlumni-Photo2',
        '/experience/SecretaryofWorkshopAlumni-Photo3',
      ],
      desc: 'Menangani dokumen dan administrasi kegiatan Workshop Alumni 2026.',
      desc_en: 'Handled document and administration for the Workshop Alumni 2026 event.',
    },
    {
      role: 'Sekretaris Company Visit I 2026',
      role_en: 'Secretary of Company Visit I 2026',
      company: 'President University',
      logo: '/experience/logos/company-visit-i.png',
      period: 'Nov 2025 - Apr 2026',
      tag: 'Event Committee',
      photos: [
        '/experience/SecretaryofCompanyVisitI-Photo1',
        '/experience/SecretaryofCompanyVisitI-Photo2',
        '/experience/SecretaryofCompanyVisitI-Photo3',
      ],
      desc: 'Menangani dokumen dan administrasi kegiatan Company Visit I 2026.',
      desc_en: 'Handled document and administration for the Company Visit I 2026 event.',
    },
    {
      role: 'Sekretaris Guest Lecturer I 2026',
      role_en: 'Secretary of Guest Lecturer I 2026',
      company: 'President University',
      logo: '/experience/logos/guest-lecturer-i.png',
      period: 'Mar 2026 - Apr2026',
      tag: 'Event Committee',
      photos: [
        '/experience/SecretaryofGuestLecturerI-Photo1',
        '/experience/SecretaryofGuestLecturerI-Photo2',
        '/experience/SecretaryofGuestLecturerI-Photo3',
      ],
      desc: 'Menangani dokumen dan administrasi kegiatan Guest Lecturer I 2026.',
      desc_en: 'Handled document and administration for the Guest Lecturer I 2026 event.',
    },
    {
      role: "Sekretaris Farewell PUMA Informatika 2026",
      role_en: "Secretary of Farewell PUMA Informatics",
      company: 'President University',
      logo: '/experience/logos/puma-informatics-farewell.png',
      period: 'May 2026 - Jul 2026',
      period_en: 'May 2026 - Jul 2026',
      tag: 'Organization',
      photos: [
        '/experience/SecretaryofFarewellPUMAInformatics-Photo1',
        '/experience/SecretaryofFarewellPUMAInformatics-Photo2',
        '/experience/SecretaryofFarewellPUMAInformatics-Photo3',
      ],
      desc: 'Menangani dokument dan administrasi acara Farewell PUMA Informatics.',
      desc_en: 'Handled document and administration for the PUMA Informatics Farewell event.',
    },
    {
      role: 'Divisi Penyelenggara Acara Hackathon 2026',
      role_en: 'Event Organizer Division of Hackathon 2026',
      company: 'President University',
      logo: '/experience/logos/hackathon-2026.png',
      period: 'Jan 2026 - Present',
      period_en: 'Jan 2026 - Saat ini',
      tag: 'Event Committee',
      photos: [
        '/experience/EventOrganizerDivisionofHackathon-Photo1',
        '/experience/EventOrganizerDivisionofHackathon-Photo2',
        '/experience/EventOrganizerDivisionofHackathon-Photo3',
      ],
      desc: 'Membantu mengorganisir jalannya kegiatan Hackathon 2026',
      desc_en: 'Helped organize the Hackathon 2026 event',
    },
    {
      role: 'Divisi Penggalangan Dana Company Visit II 2026',
      role_en: 'Fund Raising Division of Company Visit II 2026',
      company: 'President University',
      logo: '/experience/logos/company-visit-ii.png',
      period: 'Mar 2026 - Jul 2026',
      tag: 'Fundraising',
      photos: [
        '/experience/FundRaisingDivisionofCompanyVisitII-Photo1',
        '/experience/FundRaisingDivisionofCompanyVisitII-Photo2',
        '/experience/FundRaisingDivisionofCompanyVisitII-Photo3',
      ],
      desc: 'Bertanggung jawab atas penggalangan dana dan pencarian sponsor untuk kegiatan Company Visit II 2026.',
      desc_en: 'Responsible for fundraising and sponsorship outreach for the Company Visit II 2026 event.',
    },
  ],
  professional: [],
}

const HONORS = [
  {
    title: 'Indonesian Youth Science Olympiad 2023',
    issuer: 'CV. Divya Cahaya Prestasi',
    year: '2023',
    photo: '/honors/iyso-2023-biology.png',
    desc: 'Peraih Medali Emas di Indonesian Youth Science Olympiad 2023 bidang Biologi.',
    desc_en: 'Gold Medalist of the 2023 Indonesian Youth Science Olympiad in Biology.',
  },
]

// Edit this with your real certificates. Drop each certificate image into
// /public/certificates/ (e.g. /public/certificates/my-cert.png) and reference it
// via `photo` below. Leave `photo` as null to show a placeholder card until you add one.
const CERTIFICATES = [
  { title: 'Vice Project Manager OF ICON 2026 Goes to HIMALKOM IPB', issuer: 'PUMA Informatics', year: '2026', photo: '/certificates/viceproject.jpg' },
  { title: 'Secretary of Workshop Alumni 2026', issuer: 'PUMA Informatics', year: '2026', photo: '/certificates/workshopalumni.png' },
  { title: 'Secretary of Company Visit I 2026 Goes to PT. United Tractors Tbk', issuer: 'PUMA Informatics', year: '2026', photo: '/certificates/companyvisitI.png' },
  { title: 'Secretary of Guest Lecturer I 2026 with PT. United Tractors Tbk', issuer: 'PUMA Informatics', year: '2026', photo: '/certificates/guestlectureI.png' },
  { title: 'Member of Fund Raising Company Visit II 2026 Goes to BSSN', issuer: 'PUMA Informatics', year: '2026', photo: '/certificates/companyvisitII.png' },
  { title: 'Member of Fund Raising Guest Lecturer II 2026 with BSSN', issuer: 'PUMA Informatics', year: '2026', photo: '/certificates/guestlectureII.png' },
  { title: 'Participant of AI Mastery for Future Leaders Seminar', issuer: 'Navasena AI & PUMA Informatics', year: '2026', photo: '/certificates/navasena.png' },
  { title: 'Participant of Global Entrepreneurship & Innovation Bootcamp', issuer: 'Thunderbird School of Global Management at Arizona State University', year: '2026', photo: '/certificates/geib.png' },
  { title: 'Spec-Driven Deevelopment dengan Kiro Class Completion Certificate', issuer: 'Dicoding Indonesia', year: '2026', photo: '/certificates/spec.png' },
  { title: 'Memulai Pemrograman dengan Python Class Completion Certificate', issuer: 'Dicoding Indonesia', year: '2026', photo: '/certificates/python.png' },
  { title: 'Belajar Dasar Cloud dan Gen AI di AWS Class Completion Certificate', issuer: 'Dicoding Indonesia', year: '2026', photo: '/certificates/cloud.png' },
  { title: 'Grammar for Speaking Class Completion Certificate', issuer: 'Kampung Inggris', year: '2025', photo: '/certificates/grammar.png' },
  { title: 'Speaking Foundation Class Completion Certificate', issuer: 'Kampung Inggris', year: '2026', photo: '/certificates/speaking.png' },
  { title: 'Participant of English Mathematics and Science Competition 2024', issuer: 'QEC Quantum', year: '2024', photo: '/certificates/math.png' },
  { title: 'Participant of Kompetisi Sains Ruangguru Bidang Ekonomi 2025', issuer: 'Ruangguru', year: '2025', photo: '/certificates/ksr.png' },
]

// Edit this with your real publications / research papers / research reports.
const PUBLICATIONS = [
  {
    title: 'ThinkFirst: An Adaptive Human AI Self-Regulation Framework for Promoting Responsible Generative AI Usage Through an Intelligent Browser Extension',
    venue_id: 'Dipublikasikan di Zenodo',
    venue_en: 'Published on Zenodo',
    year: '',
    type: 'Research Paper',
    type_en: 'Research Paper',
    desc: 'Generative AI improves productivity but may increase user dependency and reduce critical thinking. This study proposes ThinkFirst, an intelligent browser extension that promotes responsible Human–AI collaboration through adaptive behavioral interventions. By integrating AHSRF, the AI Dependency Index (ADI), and the Adaptive Reflection Engine (ARE), the system monitors AI usage, estimates dependency levels, and provides personalized reflection prompts. The proposed framework demonstrates a practical approach to encouraging healthier AI usage while preserving the benefits of Generative AI.',
    desc_en: 'Generative AI improves productivity but may increase user dependency and reduce critical thinking. This study proposes ThinkFirst, an intelligent browser extension that promotes responsible Human–AI collaboration through adaptive behavioral interventions. By integrating AHSRF, the AI Dependency Index (ADI), and the Adaptive Reflection Engine (ARE), the system monitors AI usage, estimates dependency levels, and provides personalized reflection prompts. The proposed framework demonstrates a practical approach to encouraging healthier AI usage while preserving the benefits of Generative AI.',
    link: 'https://doi.org/10.5281/zenodo.21668341',
  },
  {
    title: 'Americano: A Phenomenological Inquiry into the Lived Experience of Unrequited Affection Through the Metaphor of Awaiting a Second Cup of Coffee, with Particular Emphasis on Emotional Attachment and the Anticipation of Reciprocity',
    venue_id: '',
    venue_en: '',
    year: '',
    type: 'Makalah Penelitian(Dalam Proses Pengerjaan)',
    type_en: 'Research Paper (On Progress)',
    desc: 'Publikasi ini masih dalam proses pengerjaan (on progress) - detail lengkap akan segera ditambahkan.',
    desc_en: 'This publication is still in progress (on progress) - full details will be added soon.',
    link: null,
  },
]

const SOCIALS = [
  { name: 'LinkedIn', Icon: FaLinkedin, href: 'https://www.linkedin.com/in/aryah-julio-miracle-kaensige/', color: '#0A66C2' },
  { name: 'GitHub', Icon: FaGithub, href: 'https://github.com/aracles03', color: '#111111' },
  { name: 'Instagram', Icon: FaInstagram, href: 'https://www.instagram.com/aryahkaensige?igsh=YXUxbHBiMmQ4OHE2', color: '#E1306C' },
  { name: 'Email', Icon: MdEmail, href: 'mailto:helloaryah@gmail.com', color: '#EA4335' },
]

// ── Scroll-triggered tech burst effect ──────────────────────────────────────
const IT_WORDS = [
  '<div>', '</div>', 'git push', 'npm i', '{ }', '[]',
  '=> {}', 'async', 'await', 'import', 'export', '01101',
  'HTTP/2', 'REST', 'API', 'useState', 'useEffect', 'SELECT *',
  'index.js', 'git merge', '#fff', 'docker run', 'curl', 'ssh',
  'npm run', 'fetch()', 'Promise', 'typeof', 'null', 'undefined',
  '.then()', 'catch()', '200 OK', '404', 'localhost', 'git stash',
  'Array', 'Object', 'JSON', 'parseInt', 'forEach', 'map()',
]

const IT_ICONS = ['⚡', '🔥', '💻', '🛠', '🚀', '🧠', '📦', '🔗', '⚙️', '🖥']

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    if (els.length === 0) return

    const timers = new Map()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target
          const shouldShow = entry.isIntersecting
          if (timers.has(el)) clearTimeout(timers.get(el))
          const t = setTimeout(() => {
            el.classList.toggle(styles.revealed, shouldShow)
            timers.delete(el)
          }, 60)
          timers.set(el, t)
        })
      },
      { threshold: 0, rootMargin: '-8% 0px -8% 0px' }
    )
    els.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
      timers.forEach((t) => clearTimeout(t))
    }
  }, [])
}

// Background ambient floating particles (subtle, always on)
const AMBIENT_WORDS = [
  '<div>', '{ }', 'async', 'await', '[]', '=> {}', 'API',
  'useState', '01101', 'null', 'fetch()', '.then()', 'npm',
]

function AmbientParticles() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    class Ambient {
      constructor(init = false) { this.reset(init) }
      reset(init = false) {
        this.x = Math.random() * canvas.width
        this.y = init ? Math.random() * canvas.height : canvas.height + 10
        this.word = AMBIENT_WORDS[Math.floor(Math.random() * AMBIENT_WORDS.length)]
        this.vy = 0.25 + Math.random() * 0.4
        this.vx = (Math.random() - 0.5) * 0.3
        this.size = 9 + Math.random() * 7
        this.maxOp = 0.045 + Math.random() * 0.055
        this.op = 0
        this.life = 0
        this.maxLife = 260 + Math.random() * 220
      }
      update() {
        this.y -= this.vy; this.x += this.vx; this.life++
        const t = this.life / this.maxLife
        this.op = t < 0.2 ? (t / 0.2) * this.maxOp : t > 0.8 ? ((1 - t) / 0.2) * this.maxOp : this.maxOp
        if (this.life > this.maxLife || this.y < -20) this.reset()
      }
      draw() {
        ctx.save()
        ctx.globalAlpha = this.op
        ctx.fillStyle = '#6366f1'
        ctx.font = `${this.size}px 'Courier New', monospace`
        ctx.fillText(this.word, this.x, this.y)
        ctx.restore()
      }
    }

    const particles = Array.from({ length: 22 }, () => new Ambient(true))
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => { p.update(); p.draw() })
      animId = requestAnimationFrame(loop)
    }
    loop()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} className={styles.itCanvas} aria-hidden="true" />
}

function TimelineDotLogo({ logo, company }) {
  const [failed, setFailed] = useState(false)
  if (logo && !failed) {
    return <img src={logo} alt={company} className={styles.timelineDotImg} onError={() => setFailed(true)} />
  }
  return <span className={styles.timelineDotFallback}>{company.replace('[', '').charAt(0)}</span>
}

function EduMedia({ video, photo, initial, alt, className }) {
  const [videoFailed, setVideoFailed] = useState(false)
  const [photoFailed, setPhotoFailed] = useState(false)

  if (video && !videoFailed) {
    return (
      <video
        className={className}
        poster={photo || undefined}
        muted
        loop
        autoPlay
        playsInline
        preload="metadata"
        onError={() => setVideoFailed(true)}
      >
        {/* Taruh file video kamu di public/education/ dengan nama sesuai path di data EDUCATION */}
        <source src={video} type="video/mp4" />
      </video>
    )
  }
  if (photo && !photoFailed) {
    return <img src={photo} alt={alt} className={className} onError={() => setPhotoFailed(true)} />
  }
  return (
    <div className={styles.eduPhotoFallback}>
      <span className={styles.eduPhotoFallbackInitial}>{initial}</span>
    </div>
  )
}

// Common extensions tried automatically for each experience photo base path,
// so it doesn't matter if you saved your photo as .jpg, .jpeg, .png, .webp, etc.
const IMG_EXT_CANDIDATES = ['jpg', 'jpeg', 'JPG', 'JPEG', 'png', 'PNG', 'webp', 'WEBP']

function ExpPhotoImg({ base, alt, className, onExhausted }) {
  const [extIdx, setExtIdx] = useState(0)

  if (extIdx >= IMG_EXT_CANDIDATES.length) return null

  return (
    <img
      src={`${base}.${IMG_EXT_CANDIDATES[extIdx]}`}
      alt={alt}
      className={className}
      onError={() => {
        if (extIdx + 1 >= IMG_EXT_CANDIDATES.length) {
          onExhausted()
        } else {
          setExtIdx((i) => i + 1)
        }
      }}
    />
  )
}

function ExpPhotoStack({ photos, alt }) {
  const [idx, setIdx] = useState(0)
  const [failed, setFailed] = useState({})
  const allPhotos = (photos || []).slice(0, 3)
  const list = allPhotos
    .map((src, origIndex) => ({ src, origIndex }))
    .filter(({ origIndex }) => !failed[origIndex])

  if (list.length === 0) return null

  const safeIdx = idx % list.length

  return (
    <div
      className={styles.expPolaroidStack}
      onClick={list.length > 1 ? () => setIdx((i) => (i + 1) % list.length) : undefined}
      role={list.length > 1 ? 'button' : undefined}
      style={{ cursor: list.length > 1 ? 'pointer' : 'default' }}
    >
      {list.map(({ src, origIndex }, i) => {
        const offset = (i - safeIdx + list.length) % list.length
        const side = offset % 2 === 0 ? 1 : -1
        return (
          <div
            key={src + origIndex}
            className={styles.expPolaroid}
            style={{
              zIndex: list.length - offset,
              transform: offset === 0
                ? 'translate(-50%, 0) rotate(-2deg) scale(1)'
                : `translate(calc(-50% + ${side * offset * 10}px), ${offset * 8}px) rotate(${side * offset * 7}deg) scale(${1 - offset * 0.06})`,
            }}
          >
            <ExpPhotoImg
              base={src}
              alt={alt}
              className={styles.expPolaroidImg}
              onExhausted={() => setFailed((prev) => ({ ...prev, [origIndex]: true }))}
            />
          </div>
        )
      })}
      {list.length > 1 && <span className={styles.expPolaroidHint}>{safeIdx + 1}/{list.length}</span>}
    </div>
  )
}

function PublicationDesc({ text }) {
  const [expanded, setExpanded] = useState(false)
  const LIMIT = 190
  const isLong = text.length > LIMIT
  const shown = !isLong || expanded ? text : text.slice(0, LIMIT).trimEnd() + '…'

  return (
    <p className={styles.pubDesc}>
      {shown}
      {isLong && (
        <button
          type="button"
          className={styles.pubReadMore}
          onClick={() => setExpanded((v) => !v)}
        >
          {' '}{expanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </p>
  )
}

export default function Portfolio({ onSelectProject, onOpenGame }) {
  const { lang } = useLanguage()
  const [activeExpCategory, setActiveExpCategory] = useState('college')
  const [activeStack, setActiveStack] = useState(null)
  const [expandedExp, setExpandedExp] = useState({})
  const [showAllExp, setShowAllExp] = useState(false)

  const HERO_PHOTOS = ['/aryah.png', '/hero/aryah-2.png']
  const [photoIdx, setPhotoIdx] = useState(0)
  const [photoGlitching, setPhotoGlitching] = useState(false)
  const [lightboxImg, setLightboxImg] = useState(null)
  const certTrackRef = useRef(null)
  const scrollCerts = (dir) => {
    const el = certTrackRef.current
    if (!el) return
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 560), behavior: 'smooth' })
  }

  useEffect(() => {
    if (!lightboxImg) return
    const onKey = (e) => { if (e.key === 'Escape') setLightboxImg(null) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [lightboxImg])

  useEffect(() => {
    const cycle = setInterval(() => {
      setPhotoGlitching(true)
      const swapTimer = setTimeout(() => {
        setPhotoIdx((i) => (i + 1) % HERO_PHOTOS.length)
        const settleTimer = setTimeout(() => setPhotoGlitching(false), 220)
        return () => clearTimeout(settleTimer)
      }, 180)
      return () => clearTimeout(swapTimer)
    }, 3000)
    return () => clearInterval(cycle)
  }, [])

  useEffect(() => {
    if (!activeStack) return
    const closePopover = () => setActiveStack(null)
    document.addEventListener('click', closePopover)
    return () => document.removeEventListener('click', closePopover)
  }, [activeStack])

  useScrollReveal()
  const { displayed: typedName, done: nameDone } = useTypewriter(
    'Aryah Julio Miracle Kaensige',
    { delay: 45, startDelay: 200 }
  )
  const EYE_ROLES = lang === 'id'
    ? ['Pengembang Web', 'Desainer UI/UX', 'Peminat AI & Data']
    : ['Web Developer', 'UI/UX Designer', 'AI & Data Enthusiast']
  const typedEye = useTypewriterLoop(EYE_ROLES, { startDelay: 1200 })

  return (
    <div className={styles.page}>
      <AmbientParticles />

      {/* HERO */}
      <section className={styles.hero} id="hero-photo-section">
        <div className={styles.heroAbstract}>
          <div className={styles.heroTextCol}>
            <h1 className={styles.heroName}>
              {typedName}
              {!nameDone && <Cursor />}
            </h1>
            <p className={styles.heroEye}>{typedEye}<Cursor /></p>

            <h2 className={styles.heroHeadline}>
              {lang === 'id' ? (
                <>Saya Membangun Produk Web - <br className={styles.br} /><em>dari Database hingga <span className={styles.heroHeadlineAccent}>Antarmuka</span></em></>
              ) : (
                <>I Build Web Products - <br className={styles.br} /><em>from Database to <span className={styles.heroHeadlineAccent}>Interface</span></em></>
              )}
            </h2>

            <p className={styles.heroSub}>
              {lang === 'id' ? 'Cikarang, Indonesia · Terbuka untuk remote ·' : 'Cikarang, Indonesia · Open to remote ·'}{' '}
              <span className={styles.avail}>
                <span className={styles.dot} />
                {lang === 'id' ? 'Tersedia sekarang' : 'Available now'}
              </span>
            </p>
            <p className={styles.heroBio}>
              {lang === 'id' ? (
                <>Nama saya Aryah Julio Miracle Kaensige, mahasiswa Teknologi Informasi di President University.
                Saya adalah individu yang sangat termotivasi dengan semangat besar untuk terus belajar dan
                mengembangkan diri, khususnya di bidang Teknologi Informasi. Saya percaya bahwa belajar adalah
                proses yang tidak pernah berhenti, di mana setiap pengetahuan baru membuka peluang yang lebih besar
                baik di lingkungan akademik maupun profesional. Saya memiliki kemampuan komunikasi dan kerja sama tim
                yang kuat, disertai kreativitas, disiplin, dan rasa tanggung jawab yang tinggi. Selain itu, saya
                memiliki kompetensi teknis dalam pemrograman dan riset teknologi, yang mendukung perkembangan saya
                sebagai calon profesional IT.</>
              ) : (
                <>My name is Aryah Julio Miracle Kaensige, an Information Technology student at President University.
                I am a highly motivated individual with a strong passion for continuous learning and personal
                development, particularly in the field of Information Technology. I believe that learning is
                an ongoing process, where every new knowledge creates greater opportunities in both academic
                and professional environments. I possess strong communication and teamwork skills, along with
                creativity, discipline, and a high sense of responsibility. In addition, I have technical
                competencies in programming and technology research, which support my growth as an aspiring
                IT professional.</>
              )}
            </p>

            <div className={styles.quoteRow}>
              <div className={styles.quoteCard}>
                <p className={styles.quoteText}>
                  {lang === 'id'
                    ? '"Aku terbatas, tapi aku memiliki Tuhan yang tak terbatas"'
                    : '"I am limited, but I have a God who is unlimited"'}
                </p>
              </div>
              <div className={styles.heroStats}>
                <button
                  type="button"
                  className={styles.heroStatItem}
                  onClick={() => document.getElementById('experience-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                >
                  <span className={styles.heroStatNum}>1+</span>
                  <span className={styles.heroStatLabel}>{lang === 'id' ? 'Tahun Pengalaman' : 'Year Experience'}</span>
                </button>
                <div className={styles.heroStatDivider} />
                <button
                  type="button"
                  className={styles.heroStatItem}
                  onClick={() => document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                >
                  <span className={styles.heroStatNum}>3+</span>
                  <span className={styles.heroStatLabel}>{lang === 'id' ? 'Proyek' : 'Project'}</span>
                </button>
                <div className={styles.heroStatDivider} />
                <button
                  type="button"
                  className={styles.heroStatItem}
                  onClick={() => document.getElementById('certificates-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                >
                  <span className={styles.heroStatNum}>10+</span>
                  <span className={styles.heroStatLabel}>{lang === 'id' ? 'Sertifikasi' : 'Certification'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className={styles.heroPhotoStage}>
            <div className={`${styles.heroPhotoWrap} ${photoGlitching ? styles.heroPhotoGlitching : ''}`}>
              <img src={HERO_PHOTOS[photoIdx]} alt="Aryah Julio Miracle Kaensige" className={styles.heroPhoto} />
              {photoGlitching && (
                <>
                  <img src={HERO_PHOTOS[photoIdx]} alt="" aria-hidden="true" className={`${styles.heroPhotoGlitchLayer} ${styles.heroPhotoGlitchRed}`} />
                  <img src={HERO_PHOTOS[photoIdx]} alt="" aria-hidden="true" className={`${styles.heroPhotoGlitchLayer} ${styles.heroPhotoGlitchCyan}`} />
                  <span className={styles.heroPhotoScanlines} />
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className={styles.divider} />

      {/* PROJECTS */}
      <section id="projects-section" className={`${styles.section} ${styles.revealSection}`} data-reveal>
        <p className={styles.label}>{lang === 'id' ? 'Proyek' : 'Projects'}</p>
        <div className={styles.workGrid}>
          {PROJECTS.map((p) => (
            <button
              key={p.slug}
              className={`${styles.workCard} ${p.comingSoon ? styles.workCardComingSoon : ''}`}
              onClick={() => onSelectProject(p)}
            >
              <div className={styles.workImgWrap}>
                {p.comingSoon ? (
                  <img className={styles.workImg} src={p.image} alt={lang === 'en' ? (p.name_en || p.name) : p.name} />
                ) : (
                  <video
                    className={styles.workImg}
                    poster={p.image}
                    muted
                    loop
                    autoPlay
                    playsInline
                    preload="metadata"
                  >
                    {/* Taruh file video kamu di public/projects/videos/ dengan nama sesuai path di atas */}
                    <source src={p.video} type="video/mp4" />
                  </video>
                )}
                {p.comingSoon && <span className={styles.comingSoonBadge}>{lang === 'id' ? 'Segera Hadir' : 'Coming Soon'}</span>}
                {p.logo && (
                  <span className={styles.projectLogoBadge}>
                    <img src={p.logo} alt={`${lang === 'en' ? (p.name_en || p.name) : p.name} logo`} className={styles.projectLogoImg} />
                  </span>
                )}
                <span className={styles.viewOverlay}>{lang === 'id' ? 'Lihat detail' : 'View details'}</span>
              </div>
              <div className={styles.workInfo}>
                <span className={styles.workYear}>{p.year}</span>
                <span className={styles.workName}>{lang === 'en' ? (p.name_en || p.name) : p.name}</span>
                <span className={styles.workType}>{lang === 'en' ? (p.type_en || p.type) : p.type}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <div className={styles.divider} />

      {/* PUBLICATIONS & RESEARCH */}
      <section id="publications-section" className={`${styles.section} ${styles.revealSection}`} data-reveal>
        <p className={styles.label}>{lang === 'id' ? 'Publikasi & Riset' : 'Publications & Research'}</p>
        <div className={styles.pubGrid}>
          {PUBLICATIONS.map((p, i) => {
            const desc = (lang === 'en' ? p.desc_en : p.desc) || p.desc
            const type = (lang === 'en' ? p.type_en : p.type) || p.type
            const venue = (lang === 'en' ? p.venue_en : p.venue_id) || p.venue_en || p.venue_id
            const meta = [venue, p.year].filter(Boolean).join(' · ')
            return (
              <div key={i} className={styles.pubCard}>
                <div className={styles.pubTopRow}>
                  <span className={styles.pubIconWrap}>
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                      <path d="M15 2v5h5" />
                      <line x1="8" y1="13" x2="16" y2="13" />
                      <line x1="8" y1="17" x2="13" y2="17" />
                    </svg>
                  </span>
                  <span className={styles.pubBadge}>{type}</span>
                </div>
                <p className={styles.pubTitle}>{p.title}</p>
                <div className={styles.pubBody}>
                  {meta && <p className={styles.pubMeta}>{meta}</p>}
                  <PublicationDesc text={desc} />
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className={styles.pubLink}>
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.pubLinkIcon}>
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      {lang === 'id' ? 'Lihat Publikasi' : 'Show Publication'}
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <div className={styles.divider} />

      {/* EDUCATION */}
      <section id="education-section" className={`${styles.section} ${styles.revealSection}`} data-reveal>
        <p className={styles.label}>{lang === 'id' ? 'Pendidikan' : 'Education'}</p>
        <p className={styles.eduHint}>
          {lang === 'id' ? 'Pendidikan saya sejauh ini.' : 'My education so far.'}
        </p>
        <div className={styles.eduGrid}>
          {EDUCATION.map((edu) => {
            const scoreLabel = (lang === 'id' ? edu.scoreLabel : edu.scoreLabel_en) || edu.scoreLabel
            return (
              <div key={edu.institution} className={styles.eduCardWrap}>
                <div className={styles.eduCard}>
                  <div className={styles.eduPhotoWrap}>
                    <EduMedia
                      video={edu.video}
                      photo={edu.photo}
                      initial={edu.initial}
                      alt={edu.institution}
                      className={styles.eduPhoto}
                    />
                  </div>
                  <div className={styles.eduLogoWrap}>
                    {edu.logo ? (
                      <img src={edu.logo} alt={edu.institution} className={styles.eduLogoImg} />
                    ) : (
                      <span className={styles.eduLogoFallback}>{edu.initial}</span>
                    )}
                  </div>
                  <div className={styles.eduBody}>
                    <div className={styles.eduBodyLeft}>
                      <p className={styles.eduPeriod}>{edu.period}</p>
                      <p className={styles.eduInstitution}>{edu.institution}</p>
                      <p className={styles.eduMajor}>{edu.major}</p>
                      <p className={styles.eduScore}>{scoreLabel}: <span>{edu.score}</span></p>
                    </div>
                    {(edu.desc || edu.desc_en) && (
                      <div className={styles.eduBodyRight}>
                        <p className={styles.eduDesc}>{(lang === 'id' ? edu.desc : edu.desc_en) || edu.desc}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <div className={styles.divider} />

      {/* EXPERIENCE */}
      <section id="experience-section" className={`${styles.section} ${styles.revealSection}`} data-reveal>
        <p className={styles.label}>{lang === 'id' ? 'Pengalaman' : 'Experience'}</p>

        <div className={styles.expTabs}>
          {EXPERIENCE_CATEGORIES.map((c) => (
            <button
              key={c.key}
              className={`${styles.expTabBtn} ${activeExpCategory === c.key ? styles.expTabBtnActive : ''}`}
              onClick={() => { setActiveExpCategory(c.key); setShowAllExp(false) }}
            >
              {lang === 'id' ? c.label_id : c.label}
            </button>
          ))}
        </div>

        <div className={styles.timeline} key={activeExpCategory}>
          {EXPERIENCE[activeExpCategory].length === 0 ? (
            <div className={styles.expEmptyState}>
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="7" width="18" height="13" rx="2" />
                <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="3" y1="12" x2="21" y2="12" />
              </svg>
              <p>
                {lang === 'id'
                  ? 'Saat ini belum ada pengalaman profesional. Akan diperbarui begitu ada magang, kerja paruh waktu, atau proyek profesional baru.'
                  : "There's no professional experience yet at the moment. This will be updated once there's an internship, part-time job, or new professional work."}
              </p>
            </div>
          ) : (
            <>
          <div className={styles.timelineLine} />
          {(showAllExp ? EXPERIENCE[activeExpCategory] : EXPERIENCE[activeExpCategory].slice(0, 2)).map((e, idx) => {
            const isLeft = idx % 2 === 0
            const role = (lang === 'en' ? e.role_en : e.role) || e.role
            const desc = (lang === 'en' ? e.desc_en : e.desc) || e.desc
            const fullDesc = (lang === 'en' ? e.fullDesc_en : e.fullDesc) || e.fullDesc
            return (
              <div
                key={`${activeExpCategory}-${e.company}-${idx}`}
                className={`${styles.timelineRow} ${isLeft ? styles.timelineLeft : styles.timelineRight} ${idx >= 2 ? styles.expNewlyShown : ''}`}
                style={{ transitionDelay: `${idx * 0.06}s`, animationDelay: idx >= 2 ? `${(idx - 2) * 0.08}s` : undefined }}
              >
                <div className={styles.timelineDot}>
                  <TimelineDotLogo logo={e.logo} company={e.company} />
                </div>
                <div className={styles.timelineColumn}>
                  <ExpPhotoStack photos={e.photos} alt={e.company} />
                  <div className={styles.timelineCard}>
                    <div className={styles.timelineCardBody}>
                      <span className={styles.expTag}>{e.tag}</span>
                      <p className={styles.timelinePeriod}>{e.period}</p>
                      <p className={styles.expRole}>{role}</p>
                      <p className={styles.expCompany}>{e.company}</p>
                      <p className={styles.expDesc}>
                        {expandedExp[`${activeExpCategory}-${idx}`] && fullDesc ? fullDesc : desc}
                      </p>
                      {fullDesc && fullDesc !== desc && (
                        <button
                          type="button"
                          className={styles.expReadMoreBtn}
                          onClick={() => setExpandedExp((prev) => ({
                            ...prev,
                            [`${activeExpCategory}-${idx}`]: !prev[`${activeExpCategory}-${idx}`],
                          }))}
                        >
                          {expandedExp[`${activeExpCategory}-${idx}`]
                            ? (lang === 'id' ? 'Sembunyikan' : 'Show less')
                            : (lang === 'id' ? 'Baca selengkapnya' : 'Read more')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
            </>
          )}
        </div>

        {EXPERIENCE[activeExpCategory].length > 2 && (
          <div className={styles.expShowMoreWrap}>
            <button
              type="button"
              className={styles.expShowMoreBtn}
              onClick={() => setShowAllExp((v) => !v)}
            >
              {showAllExp ? 'Hide the experience' : 'Show more experiences'}
            </button>
          </div>
        )}
      </section>

      <div className={styles.divider} />

      {/* HONORS & AWARDS */}
      <section id="honors-section" className={`${styles.section} ${styles.revealSection}`} data-reveal>
        <p className={styles.label}>{lang === 'id' ? 'Penghargaan' : 'Honors & Awards'}</p>
        <div className={styles.honorsGrid}>
          {HONORS.map((h, i) => {
            const desc = (lang === 'en' ? h.desc_en : h.desc) || h.desc
            return (
              <div key={i} className={styles.honorCard}>
                <div
                  className={styles.honorPhotoWrap}
                  onClick={() => h.photo && setLightboxImg({ src: h.photo, alt: h.title })}
                  role={h.photo ? 'button' : undefined}
                >
                  {h.photo ? (
                    <img src={h.photo} alt={h.title} className={styles.honorPhoto} />
                  ) : (
                    <div className={styles.honorPhotoFallback}>
                      <span className={styles.honorIcon}>🏆</span>
                    </div>
                  )}
                </div>
                <div className={styles.honorBody}>
                  <p className={styles.honorTitle}>{h.title}</p>
                  <p className={styles.honorMeta}>{h.issuer} · {h.year}</p>
                  <p className={styles.honorDesc}>{desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <div className={styles.divider} />

      {/* CERTIFICATES */}
      <section id="certificates-section" className={`${styles.section} ${styles.revealSection}`} data-reveal>
        <div className={styles.certHeader}>
          <div>
            <p className={styles.label}>{lang === 'id' ? 'Sertifikat' : 'Certificates'}</p>
            <p className={styles.eduHint}>
              {lang === 'id' ? 'Geser ke kanan untuk lihat sertifikat lainnya.' : 'Scroll right to see more certificates.'}
            </p>
          </div>
          <div className={styles.certNav}>
            <button type="button" className={styles.certNavBtn} onClick={() => scrollCerts(-1)} aria-label="Previous">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button type="button" className={styles.certNavBtn} onClick={() => scrollCerts(1)} aria-label="Next">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.certTrack} ref={certTrackRef}>
          {CERTIFICATES.map((c, i) => (
            <div key={i} className={styles.certCard}>
              <div
                className={styles.certPhotoWrap}
                onClick={() => c.photo && setLightboxImg({ src: c.photo, alt: c.title })}
                role={c.photo ? 'button' : undefined}
              >
                {c.photo ? (
                  <img src={c.photo} alt={c.title} className={styles.certPhoto} />
                ) : (
                  <div className={styles.certPhotoFallback}>
                    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="6" />
                      <path d="M9 13.5 7 22l5-3 5 3-2-8.5" />
                    </svg>
                  </div>
                )}
              </div>
              <div className={styles.certBody}>
                <p className={styles.certTitle}>{c.title}</p>
                <p className={styles.certMeta}>{c.issuer} · {c.year}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.divider} />

      {/* STACK */}
      <section id="stack-section" className={`${styles.section} ${styles.revealSection}`} data-reveal>
        <p className={styles.label}>Stack</p>
        <div className={styles.stackGrid}>
          {STACK.map((s, i) => {
            const isActive = activeStack === s.name
            return (
              <button
                key={s.name}
                type="button"
                className={`${styles.stackItem} ${isActive ? styles.stackItemActive : ''}`}
                style={{ '--c': s.color, '--drift-delay': `${i * -0.7}s`, '--drift-dur': `${6 + (i % 4)}s` }}
                onClick={(e) => { e.stopPropagation(); setActiveStack(isActive ? null : s.name) }}
              >
                <span className={styles.stackIconWrap}>
                  <s.Icon size={30} color={s.color} />
                </span>
                <span className={styles.stackName}>{s.name}</span>

                {isActive && (
                  <div className={styles.stackPopover} onClick={(e) => e.stopPropagation()}>
                    {s.metrics.map((m) => (
                      <div key={m.label} className={styles.stackMetricRow}>
                        <span className={styles.stackMetricLabel}>
                          {lang === 'en' ? (METRIC_LABEL_EN[m.label] || m.label) : m.label}
                        </span>
                        <div className={styles.stackBarTrack}>
                          <div
                            className={styles.stackBarFill}
                            style={{ width: `${m.value}%`, background: s.color }}
                          />
                        </div>
                        <span className={styles.stackBarPercent}>{m.value}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </section>

      <div className={styles.divider} />

      {/* GAME */}
      <section className={`${styles.section} ${styles.revealSection} ${styles.gameSection}`} data-reveal>
        <p className={styles.label}>{lang === 'id' ? 'Permainan Aryah' : 'Aryah\'s Game'}</p>
        <button type="button" className={styles.gameCard} onClick={onOpenGame}>
          <div className={styles.gameCardBg}>
            <span className={styles.gameCardGlow} />
            <span className={styles.gameCardSun} />
            <span className={styles.gameCardCloud1} />
            <span className={styles.gameCardCloud2} />
            <span className={styles.gameCardBird} style={{ top: '18%', left: '55%', animationDelay: '-2s' }} />
            <span className={styles.gameCardBird} style={{ top: '24%', left: '62%', animationDelay: '-4.5s' }} />
            <span className={styles.gameCardHills} />
            <span className={styles.gameCardGround} />
            <span className={styles.gameCardBuilding} style={{ left: '2%', height: '34%' }} />
            <span className={styles.gameCardBuilding} style={{ left: '11%', height: '48%' }} />
            <span className={styles.gameCardBuilding} style={{ left: '19%', height: '26%' }} />
            <span className={styles.gameCardBuilding} style={{ right: '4%', height: '42%' }} />
            <span className={styles.gameCardBuilding} style={{ right: '14%', height: '24%' }} />
            <span className={styles.gameCardBuilding} style={{ right: '22%', height: '32%' }} />
            <span className={styles.gameCardTree} style={{ left: '27%' }} />
            <span className={styles.gameCardTree} style={{ left: '33%', transform: 'scale(0.7)' }} />
            <span className={styles.gameCardTree} style={{ right: '29%', transform: 'scale(0.85)' }} />
            <span className={styles.gameCardBench} />
            <span className={styles.gameCardRoad} />
            <span className={styles.gameCardCrossing} />
            <span className={styles.gameCardCar} style={{ animationDelay: '-1.5s' }} />
            <span className={styles.gameCardCar} style={{ animationDelay: '-4s', bottom: '4.5%', transform: 'scale(0.85)' }} />
            <span className={`${styles.gameCardChar} ${styles.gameCardCharA}`} />
            <span className={`${styles.gameCardChar} ${styles.gameCardCharB}`} />
            <span className={styles.gameCardVignette} />
          </div>
          <div className={styles.gameCardInfo}>
            <span className={styles.gameCardBadge}> {lang === 'id' ? 'Mini Game' : 'Mini Game'}</span>
            <p className={styles.gameCardTitle}>Jalan Bareng Aryah</p>
            <p className={styles.gameCardDesc}>
              {lang === 'id'
                ? 'Jelajahi peta kota kecil dalam 3D, temui titik-titik cerita yang tersebar di berbagai sudut, dan kenalan sama Aryah lewat cara yang lebih seru dan interaktif dibanding sekadar scroll halaman.'
                : 'Explore a small 3D town map, discover story points scattered around every corner, and get to know Aryah in a way that is more fun and interactive than just scrolling through a page.'}
            </p>
            <span className={styles.gameCardCta}>
              {lang === 'id' ? 'Klik untuk main' : 'Click to play'}
            </span>
          </div>
        </button>
      </section>

      <div className={styles.divider} />

      {/* CONTACT */}
      <section id="contact-section" className={`${styles.section} ${styles.revealSection}`} data-reveal>
        <p className={styles.label}>{lang === 'id' ? 'Kontak' : 'Contact'}</p>
        <div className={styles.contactWrap}>
          <div className={styles.contactLeft}>
            <h2 className={styles.contactTitle}>
              {lang === 'id' ? <>Terbuka untuk<br /><em>peluang baru.</em></> : <>Open to<br /><em>opportunities.</em></>}
            </h2>
            <p className={styles.contactDesc}>
              {lang === 'id'
                ? "Saya senantiasa terbuka untuk mendiskusikan peluang kolaborasi, baik itu proyek baru, posisi yang perlu diisi, kemitraan profesional, maupun sekadar berkenalan dan bertukar pikiran. Jangan ragu untuk menghubungi saya melalui salah satu kanal di bawah ini - saya akan berusaha membalas secepat mungkin, dan akan sangat senang bisa terhubung dengan Anda."
                : "I am always glad to discuss potential opportunities for collaboration, whether it involves a new project, a role that needs to be filled, a professional partnership, or simply an introduction and exchange of ideas. Please feel free to reach out through any of the channels below - I will do my best to respond as promptly as possible, and I would truly welcome the opportunity to connect with you."}
            </p>
            {/* Taruh file CV kamu di public/cv.pdf agar tombol ini otomatis berfungsi */}
            <a href="/cv.pdf" download="Aryah Julio Miracle Kaensige - CV.pdf" className={styles.cvBtn}>
              <span>{lang === 'id' ? 'Unduh CV' : 'Download CV'}</span>
              <span className={styles.cvBtnArrow}>↓</span>
            </a>
          </div>
          <div className={styles.contactGrid}>
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target={s.name === 'Email' ? undefined : '_blank'}
                rel="noreferrer"
                className={styles.contactCard}
                style={{ '--c': s.color }}
              >
                <span className={styles.contactCardIcon}>
                  <s.Icon size={22} color={s.color} />
                </span>
                <span className={styles.contactCardName}>{s.name}</span>
                <span className={styles.contactCardArrow}>↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerTop}>
            <div className={styles.footerBrand}>
              <span className={styles.footerName}>Aryah Julio Miracle Kaensige</span>
              <p className={styles.footerTagline}>
                {lang === 'id'
                  ? 'Web Developer yang suka membangun produk digital dari database sampai antarmuka, berbasis di Jakarta, Indonesia.'
                  : 'A Web Developer who loves building digital products from database to interface, based in Jakarta, Indonesia.'}
              </p>
              <div className={styles.footerSocials}>
                {SOCIALS.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target={s.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className={styles.footerSocialLink}
                    aria-label={s.name}
                  >
                    <s.Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            <div className={styles.footerLinksCol}>
              <p className={styles.footerColTitle}>{lang === 'id' ? 'Jelajahi' : 'Explore'}</p>
              <a href="#projects-section" className={styles.footerLink}>{lang === 'id' ? 'Proyek' : 'Projects'}</a>
              <a href="#publications-section" className={styles.footerLink}>{lang === 'id' ? 'Publikasi & Riset' : 'Publications & Research'}</a>
              <a href="#education-section" className={styles.footerLink}>{lang === 'id' ? 'Pendidikan' : 'Education'}</a>
              <a href="#experience-section" className={styles.footerLink}>{lang === 'id' ? 'Pengalaman' : 'Experience'}</a>
            </div>

            <div className={`${styles.footerLinksCol} ${styles.footerLinksMore}`}>
              <p className={styles.footerColTitle}>{lang === 'id' ? 'Lainnya' : 'More'}</p>
              <a href="#honors-section" className={styles.footerLink}>{lang === 'id' ? 'Penghargaan' : 'Honors & Awards'}</a>
              <a href="#certificates-section" className={styles.footerLink}>{lang === 'id' ? 'Sertifikat' : 'Certificates'}</a>
              <a href="#stack-section" className={styles.footerLink}>Stack</a>
              <a href="#contact-section" className={styles.footerLink}>{lang === 'id' ? 'Kontak' : 'Contact'}</a>
              <button type="button" className={styles.footerLink} onClick={onOpenGame} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', font: 'inherit', padding: 0 }}>
                {lang === 'id' ? 'Main Game 3D' : '3D Mini Game'}
              </button>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <span className={styles.footerCopy}>
              © 2026 Aryah Julio Miracle Kaensige. {lang === 'id' ? 'Seluruh hak cipta dilindungi.' : 'All rights reserved.'}
            </span>
            <span className={styles.footerMadeWith}>
              {lang === 'id' ? 'Dibuat dengan React, Three.js, dan banyak kopi.' : 'Built with React, Three.js, and a lot of coffee.'}
            </span>
          </div>
        </div>
      </footer>

      {lightboxImg && createPortal(
        <div className={styles.lightboxOverlay} onClick={() => setLightboxImg(null)}>
          <button className={styles.lightboxClose} onClick={() => setLightboxImg(null)} aria-label="Close">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="5" y1="5" x2="19" y2="19" />
              <line x1="19" y1="5" x2="5" y2="19" />
            </svg>
          </button>
          <img
            src={lightboxImg.src}
            alt={lightboxImg.alt}
            className={styles.lightboxImg}
            onClick={(e) => e.stopPropagation()}
          />
        </div>,
        document.body
      )}

    </div>
  )
}
