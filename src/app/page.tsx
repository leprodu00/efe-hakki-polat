"use client";

import Image from "next/image";
import Lenis from "lenis";
import {
  motion,
  MotionConfig,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import type { Variants } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./page.module.css";

type Locale = "tr" | "fr";

type JourneyItem = { club: string; text: string; place: string };
type ImpactItem = { number: string; title: string; text: string };
type SiteCopy = {
  nav: { profile: string; journey: string; gallery: string; contact: string };
  hero: { position: string; statement: ReactNode; discover: string; edition: string };
  profile: { index: string; kicker: string; title: ReactNode; first: string; second: string; age: string; position: string; nationality: string; qualities: string; valueAge: string; valuePosition: string; valueNationality: string; valueQualities: string; place: string };
  impact: { index: string; title: string; items: ImpactItem[] };
  playstyle: { index: string; title: ReactNode; copy: string; marker: string; marquee: string };
  manifesto: { index: string; title: ReactNode; note: ReactNode; ticker: string };
  journey: { index: string; title: ReactNode; items: JourneyItem[] };
  gallery: { index: string; title: ReactNode; tags: string[]; alts: string[] };
  contact: { index: string; lead: ReactNode };
};

const copy: Record<Locale, SiteCopy> = {
  tr: {
    nav: { profile: "Profil", journey: "Kariyer", gallery: "Galeri", contact: "İletişim" },
    hero: { position: "Fransız-Türk · Santrfor", statement: <>Gol içgüdüyle.<br />Çalışma imzayla.</>, discover: "Yolculuğu keşfet", edition: "2026 Edisyonu · Fransa / Türkiye" },
    profile: {
      index: "01 / OYUNCU", kicker: "Henüz 18 yaşında", title: <>Basamakları tırmanmayı sürdüren<br />bir <em>golcü.</em></>,
      first: "En umut vadeden kariyerler her zaman düz bir çizgide ilerlemez. Efe Hakkı Polat, en üst seviyeye ulaşma hedefinden ödün vermeden yoluna devam ediyor.",
      second: "Santrfor olarak ceza sahasındaki içgüdüsü, bitiriciliği ve gözlerden uzak inşa ettiği kararlılığıyla fark yaratıyor.",
      age: "Yaş", position: "Mevki", nationality: "Uyruk", qualities: "Özellikler", valueAge: "18", valuePosition: "Santrfor", valueNationality: "Fransız-Türk", valueQualities: "Güç · İçgüdü · Çalışma", place: "Fransa / Türkiye",
    },
    impact: {
      index: "02 / DNA", title: "Oyununun üç <em>temel</em> noktası.",
      items: [
        { number: "01", title: "Bitiricilik", text: "Ceza sahasında doğru anda doğru yerde olma içgüdüsü." },
        { number: "02", title: "Hareket", text: "Güçlü koşular, alan yaratma ve kaleye sürekli yönelim." },
        { number: "03", title: "Zihniyet", text: "Her idmanı ve her denemeyi bir sonraki seviyeye adım olarak görmek." },
      ],
    },
    playstyle: { index: "03 / OYUN TARZI", title: <>Ceza sahasında<br /><em>yaşamak.</em></>, copy: "Koşularında güçlü, sürekli golü düşünen ve rekabetçi bir karakterle oynayan Efe, sahada her an etki yaratmak istiyor.", marker: "BİTİRİCİ", marquee: "İÇGÜDÜ · ETKİ · İÇGÜDÜ · ETKİ · İÇGÜDÜ · ETKİ ·" },
    manifesto: { index: "04 / ZİHNİYET", title: <>Her deneme. <span>Her antrenman.</span> Her maç.</>, note: <>Yeni bir seviyeye ulaşmak için<br />yeni bir fırsat.</>, ticker: "KESTİRME YOK · KESTİRME YOK · KESTİRME YOK ·" },
    journey: {
      index: "05 / KARİYER", title: <>Hareket hâlinde<br />bir <em>yol.</em></>,
      items: [
        { club: "ES Thyez", text: "İlk yıllar, öğrenme süreci ve gol odaklı oyunun temelleri.", place: "Fransa" },
        { club: "Cluses Scionzier FC", text: "U18 Bölgesel 2, ardından takımın Bölgesel 1'e yükseldiği belirleyici sezon.", place: "Fransa" },
        { club: "Chênois FC", text: "İlk uluslararası sınav. Denemede ikna etti ve kulübün rezerv takımına katıldı.", place: "İsviçre" },
        { club: "Gençlerbirliği", text: "Tarihi Türk kulübünde olumlu geçen deneme, idari süreçler nedeniyle sonuçlanamadı.", place: "Türkiye" },
        { club: "Erzurumspor", text: "Bugün değerlendirme kampında, ikna etme ve gelişme isteğiyle çalışıyor.", place: "Türkiye · Bugün" },
      ],
    },
    gallery: { index: "06 / SAHADA", title: <>Hikâye burada<br /><em>devam ediyor.</em></>, tags: ["Maç günü", "Disiplin", "Erzurumspor", "Odak"], alts: ["Efe Hakkı Polat Cluses Scionzier FC ile maça hazırlanıyor", "Efe Hakkı Polat antrenmanda", "Efe Hakkı Polat Erzurumspor tesislerinde", "Efe Hakkı Polat topla aksiyonda"] },
    contact: { index: "07 / İLETİŞİM", lead: <>Yetenekten daha fazlasını<br />gerektiren <em>fırsatlar</em> için.</> },
  },
  fr: {
    nav: { profile: "Profil", journey: "Parcours", gallery: "Galerie", contact: "Contact" },
    hero: { position: "Franco-Turc · Attaquant de pointe", statement: <>Le but comme instinct.<br />Le travail comme signature.</>, discover: "Découvrir le parcours", edition: "Édition 2026 · France / Türkiye" },
    profile: {
      index: "01 / LE JOUEUR", kicker: "À seulement 18 ans", title: <>Un buteur qui ne cesse de<br /><em>gravir</em> les échelons.</>,
      first: "Les parcours les plus prometteurs ne sont pas toujours les plus linéaires. Efe Hakkı Polat avance avec une ambition intacte : atteindre le plus haut niveau.",
      second: "Attaquant de pointe, il fait parler son sens du but, son instinct dans la surface et une détermination forgée loin des projecteurs.",
      age: "Âge", position: "Poste", nationality: "Nationalité", qualities: "Qualités", valueAge: "18 ans", valuePosition: "Avant-centre", valueNationality: "Franco-Turc", valueQualities: "Puissance · Instinct · Travail", place: "France / Türkiye",
    },
    impact: {
      index: "02 / ADN", title: "Trois lignes de <em>force.</em>",
      items: [
        { number: "01", title: "Finition", text: "L'instinct d'être au bon endroit, au bon moment dans la surface." },
        { number: "02", title: "Mouvement", text: "Des courses puissantes, de l'espace créé et le but constamment visé." },
        { number: "03", title: "Mentalité", text: "Faire de chaque entraînement et de chaque essai un pas vers le niveau suivant." },
      ],
    },
    playstyle: { index: "03 / STYLE DE JEU", title: <>Vivre<br />dans la <em>surface.</em></>, copy: "Puissant dans ses déplacements, constamment tourné vers le but et animé par une vraie mentalité de compétiteur, Efe veut peser à chaque instant.", marker: "FINISSEUR", marquee: "INSTINCT · IMPACT · INSTINCT · IMPACT · INSTINCT · IMPACT ·" },
    manifesto: { index: "04 / MENTALITÉ", title: <>Chaque essai. <span>Chaque entraînement.</span> Chaque match.</>, note: <>Une occasion de franchir<br />un nouveau cap.</>, ticker: "AUCUN RACCOURCI · AUCUN RACCOURCI · AUCUN RACCOURCI ·" },
    journey: {
      index: "05 / LE PARCOURS", title: <>Un chemin<br />en <em>mouvement.</em></>,
      items: [
        { club: "ES Thyez", text: "Les premières années, l'apprentissage et les fondations d'un jeu tourné vers le but.", place: "France" },
        { club: "Cluses Scionzier FC", text: "U18 Régional 2, puis une saison décisive et l'accession de l'équipe en Régional 1.", place: "France" },
        { club: "Chênois FC", text: "Premier défi à l'international. Convaincant à l'essai, il rejoint l'équipe réserve.", place: "Suisse" },
        { club: "Gençlerbirliği", text: "Un essai concluant dans un club historique turc, freiné par des questions administratives.", place: "Türkiye" },
        { club: "Erzurumspor", text: "Actuellement au camp d'évaluation, avec la même envie de convaincre et progresser.", place: "Türkiye · Aujourd'hui" },
      ],
    },
    gallery: { index: "06 / SUR LE TERRAIN", title: <>La suite<br />s&apos;<em>écrit ici.</em></>, tags: ["Match day", "Discipline", "Erzurumspor", "Focus"], alts: ["Efe Hakkı Polat prêt à jouer avec Cluses Scionzier FC", "Efe Hakkı Polat à l'entraînement", "Efe Hakkı Polat au centre d'entraînement d'Erzurumspor", "Efe Hakkı Polat en action avec le ballon"] },
    contact: { index: "07 / CONTACT", lead: <>Pour les opportunités qui<br />demandent plus qu&apos;un <em>talent.</em></> },
  },
};

const galleryImages = [
  { src: "/images/efe-match-1.jpg", className: "matchOne" },
  { src: "/images/efe-training.jpg", className: "training" },
  { src: "/images/efe-erzurum.jpg", className: "erzurum" },
  { src: "/images/efe-match-2.jpg", className: "matchTwo" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 42, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
};

function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return <motion.div className={className} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.17 }} transition={{ delay }}>{children}</motion.div>;
}

function GalleryImage({ src, className, tag, alt, index }: { src: string; className: string; tag: string; alt: string; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-11%", "11%"]);
  const clipPath = useTransform(scrollYProgress, [0, 0.28, 1], ["inset(0 52% 0 52%)", "inset(0 0% 0 0%)", "inset(0 0% 0 0%)"]);
  return <motion.figure ref={ref} className={`${styles.galleryCard} ${styles[className]}`} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.18 }} transition={{ delay: index * 0.08, duration: 0.5 }}><motion.div className={styles.galleryImage} style={{ clipPath }}><motion.div className={styles.galleryImageInner} style={{ y }}><Image src={src} alt={alt} fill sizes="(max-width: 760px) 100vw, 50vw" /></motion.div></motion.div><figcaption><span>{String(index + 1).padStart(2, "0")}</span>{tag}</figcaption></motion.figure>;
}

function PlaystyleScene({ content }: { content: SiteCopy["playstyle"] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["18%", "-15%"]);
  const scale = useTransform(scrollYProgress, [0, 0.45, 1], [0.68, 1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.84, 1], [0, 1, 1, 0]);
  const wordX = useTransform(scrollYProgress, [0, 1], ["-12%", "-54%"]);
  const detailOpacity = useTransform(scrollYProgress, [0.36, 0.55], [0, 1]);
  return <section ref={ref} className={styles.playstyle} aria-label={content.index}><div className={styles.playstyleSticky}><motion.div className={styles.playstyleWord} style={{ x: wordX }} aria-hidden="true">{content.marquee}</motion.div><motion.div className={styles.playstylePhoto} style={{ y: photoY, scale, opacity }}><Image src="/images/efe-pose.jpg" alt="Efe Hakkı Polat" fill sizes="100vw" /></motion.div><motion.div className={styles.playstyleCopy} style={{ opacity: detailOpacity }}><p className={styles.sectionIndex}>{content.index}</p><h2>{content.title}</h2><p>{content.copy}</p></motion.div><div className={styles.playstyleMarker}><span>09</span><i /><span>{content.marker}</span></div><div className={styles.playstyleLight} aria-hidden="true" /></div></section>;
}

function ImpactStrip({ content }: { content: SiteCopy["impact"] }) {
  return <section className={styles.impact}><Reveal><p className={styles.sectionIndex}>{content.index}</p></Reveal><Reveal className={styles.impactHeader}><h2 dangerouslySetInnerHTML={{ __html: content.title }} /></Reveal><div className={styles.impactGrid}>{content.items.map((item, index) => <motion.article className={styles.impactCard} key={item.number} initial={{ opacity: 0, y: 45, rotate: index === 1 ? 2 : 0 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} whileHover={{ y: -12, rotate: index === 1 ? -1 : 1, transition: { duration: 0.35 } }} viewport={{ once: true, amount: 0.24 }} transition={{ delay: index * 0.12, duration: 0.8 }}><span>{item.number}</span><h3>{item.title}</h3><p>{item.text}</p><i /></motion.article>)}</div></section>;
}

function Site() {
  const [locale, setLocale] = useState<Locale>("tr");
  const [loaded, setLoaded] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const cursorX = useSpring(useMotionValue(-100), { stiffness: 500, damping: 35 });
  const cursorY = useSpring(useMotionValue(-100), { stiffness: 500, damping: 35 });
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImageY = useTransform(heroProgress, [0, 1], ["0%", "22%"]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.18]);
  const heroCopyY = useTransform(heroProgress, [0, 1], ["0%", "48%"]);
  const heroOpacity = useTransform(heroProgress, [0, 0.72], [1, 0]);
  const content = copy[locale];

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 350);
    if (reducedMotion) return () => window.clearTimeout(timer);
    const lenis = new Lenis({ autoRaf: true, duration: 1.9, easing: (value) => Math.min(1, 1.001 - Math.pow(2, -10 * value)), smoothWheel: true, wheelMultiplier: 0.58, touchMultiplier: 1.04, anchors: { duration: 1.8, lock: true } });
    return () => { window.clearTimeout(timer); lenis.destroy(); };
  }, [reducedMotion]);

  useEffect(() => {
    document.documentElement.lang = locale;
    if (reducedMotion) return;
    const moveCursor = (event: MouseEvent) => { cursorX.set(event.clientX); cursorY.set(event.clientY); };
    window.addEventListener("pointermove", moveCursor);
    return () => window.removeEventListener("pointermove", moveCursor);
  }, [cursorX, cursorY, locale, reducedMotion]);

  return <MotionConfig reducedMotion="user" transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
    <motion.div className={styles.progress} style={{ scaleX: scrollYProgress }} />
    <motion.div className={styles.cursor} style={{ x: cursorX, y: cursorY }} aria-hidden="true"><span /></motion.div>
    <div className={`${styles.loader} ${loaded ? styles.loaderDone : ""}`} aria-hidden="true"><div className={styles.loaderTop}>EFE HAKKI POLAT</div><div className={styles.loaderCount}>09</div><div className={styles.loaderBottom}>FUTURE IN MOTION</div></div>
    <main>
      <section ref={heroRef} className={styles.hero} id="accueil">
        <div className={styles.heroAura} aria-hidden="true"><span /><span /><span /></div><div className={styles.heroNoise} aria-hidden="true" />
        <nav className={styles.nav} aria-label="Navigation principale"><a className={styles.monogram} href="#accueil" aria-label="Accueil">EH<span>9</span></a><div className={styles.navLinks}><a href="#profil">{content.nav.profile}</a><a href="#parcours">{content.nav.journey}</a><a href="#galerie">{content.nav.gallery}</a></div><div className={styles.navEnd}><div className={styles.languageSwitch} aria-label="Choisir la langue"><button className={locale === "tr" ? styles.languageActive : ""} onClick={() => setLocale("tr")} aria-pressed={locale === "tr"}>TR</button><span>/</span><button className={locale === "fr" ? styles.languageActive : ""} onClick={() => setLocale("fr")} aria-pressed={locale === "fr"}>FR</button></div><a className={styles.navCta} href="#contact">{content.nav.contact} <span>↗</span></a></div></nav>
        <motion.div className={styles.heroImage} style={{ y: heroImageY, scale: heroScale }}><Image src="/images/efe-hero.jpg" alt="Efe Hakkı Polat, attaquant" fill priority sizes="100vw" /></motion.div><div className={styles.heroVignette} /><div className={styles.heroGrid} />
        <motion.div className={styles.heroContent} style={{ y: heroCopyY, opacity: heroOpacity }}><motion.p className={styles.eyebrow} initial={{ opacity: 0, y: 12 }} animate={loaded ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.8 }}>{content.hero.position}</motion.p><h1 className={styles.title}><motion.span initial={{ y: "110%" }} animate={loaded ? { y: 0 } : {}} transition={{ delay: 0.9, duration: 1.05, ease: [0.16, 1, 0.3, 1] }}>EFE</motion.span><motion.span className={styles.titleOutline} initial={{ y: "110%" }} animate={loaded ? { y: 0 } : {}} transition={{ delay: 1.02, duration: 1.05, ease: [0.16, 1, 0.3, 1] }}>POLAT</motion.span></h1><motion.div className={styles.heroLower} initial={{ opacity: 0, y: 20 }} animate={loaded ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.35 }}><p>{content.hero.statement}</p><a href="#profil" className={styles.scrollCue}><i /> {content.hero.discover}</a></motion.div></motion.div>
        <div className={styles.heroNumber} aria-hidden="true">9</div><p className={styles.heroSide}>{content.hero.edition}</p><div className={styles.heroPulse} aria-hidden="true"><span /><span /><span /></div><div className={styles.heroBadge}><span>LIVE</span><i /> 09</div>
      </section>

      <section className={styles.intro} id="profil"><Reveal><p className={styles.sectionIndex}>{content.profile.index}</p></Reveal><Reveal className={styles.introStatement}><p className={styles.kicker}>{content.profile.kicker}</p><h2>{content.profile.title}</h2></Reveal><div className={styles.profileGrid}><div className={styles.profileImageWrap}><Image className={styles.profileImage} src="/images/efe-profile.jpg" alt="Portrait d'Efe Hakkı Polat" fill sizes="(max-width: 760px) 100vw, 35vw" /><span className={styles.imageCaption}>Cluses Scionzier FC</span><span className={styles.profileNumber} aria-hidden="true">09</span><span className={styles.profilePlace}>{content.profile.place}</span></div><Reveal className={styles.profileCopy}><p>{content.profile.first}</p><p>{content.profile.second}</p><dl className={styles.facts}><div><dt>{content.profile.age}</dt><dd>{content.profile.valueAge}</dd></div><div><dt>{content.profile.position}</dt><dd>{content.profile.valuePosition}</dd></div><div><dt>{content.profile.nationality}</dt><dd>{content.profile.valueNationality}</dd></div><div><dt>{content.profile.qualities}</dt><dd>{content.profile.valueQualities}</dd></div></dl></Reveal></div></section>
      <ImpactStrip content={content.impact} />
      <PlaystyleScene content={content.playstyle} />
      <section className={styles.manifesto}><div className={styles.manifestoGlow} aria-hidden="true" /><Reveal><p className={styles.sectionIndex}>{content.manifesto.index}</p></Reveal><Reveal><p className={styles.manifestoText}>{content.manifesto.title}</p></Reveal><motion.div className={styles.manifestoPhoto} initial={{ opacity: 0, rotate: 10, y: 100 }} whileInView={{ opacity: 0.8, rotate: 5, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 1.2 }}><Image src="/images/efe-pose.jpg" alt="Efe Hakkı Polat sur le terrain" fill sizes="(max-width: 760px) 100vw, 55vw" /></motion.div><Reveal className={styles.manifestoNote}><p>{content.manifesto.note}</p></Reveal><div className={styles.manifestoTicker} aria-hidden="true">{content.manifesto.ticker}</div></section>
      <section className={styles.journey} id="parcours"><header className={styles.journeyHeader}><Reveal><p className={styles.sectionIndex}>{content.journey.index}</p></Reveal><Reveal><h2>{content.journey.title}</h2></Reveal></header><ol className={styles.timeline}>{content.journey.items.map((item, index) => <motion.li key={item.club} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ delay: index * 0.08 }}><span className={styles.timelineNumber}>{String(index + 1).padStart(2, "0")}</span><div><h3>{item.club}</h3><p>{item.text}</p></div><span className={styles.timelinePlace}>{item.place}</span></motion.li>)}</ol></section>
      <section className={styles.gallerySection} id="galerie"><header className={styles.galleryHeader}><Reveal><p className={styles.sectionIndex}>{content.gallery.index}</p></Reveal><Reveal><h2>{content.gallery.title}</h2></Reveal></header><div className={styles.gallery}>{galleryImages.map((photo, index) => <GalleryImage key={photo.src} {...photo} index={index} tag={content.gallery.tags[index]} alt={content.gallery.alts[index]} />)}</div></section>
      <section className={styles.contact} id="contact"><div className={styles.contactGradient} aria-hidden="true" /><Reveal><p className={styles.sectionIndex}>{content.contact.index}</p></Reveal><Reveal><p className={styles.contactLead}>{content.contact.lead}</p></Reveal><Reveal className={styles.contactDetails}><a className={styles.contactMail} href="mailto:efepolat5866@gmail.com">efepolat5866@gmail.com <span>↗</span></a><a className={styles.contactPhone} href="tel:+33660508679">06 60 50 86 79 <span>↗</span></a></Reveal><div className={styles.contactFooter}><p>EFE HAKKI POLAT<br />ATTAQUANT · BUTEUR</p><p>© 2026</p></div></section>
    </main>
  </MotionConfig>;
}

export default function Home() { return <Site />; }
