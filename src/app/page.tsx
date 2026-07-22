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

const gallery = [
  { src: "/images/efe-match-1.jpg", alt: "Efe Hakkı Polat prêt à jouer avec Cluses Scionzier FC", className: "matchOne", tag: "Match day" },
  { src: "/images/efe-training.jpg", alt: "Efe Hakkı Polat à l'entraînement", className: "training", tag: "Discipline" },
  { src: "/images/efe-erzurum.jpg", alt: "Efe Hakkı Polat au centre d'entraînement d'Erzurumspor", className: "erzurum", tag: "Erzurumspor" },
  { src: "/images/efe-match-2.jpg", alt: "Efe Hakkı Polat en action avec le ballon", className: "matchTwo", tag: "Focus" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 42, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] } },
};

function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return <motion.div className={className} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.22 }}>{children}</motion.div>;
}

function GalleryImage({ photo, index }: { photo: (typeof gallery)[number]; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const clipPath = useTransform(scrollYProgress, [0, 0.28, 1], ["inset(0 52% 0 52%)", "inset(0 0% 0 0%)", "inset(0 0% 0 0%)"]);

  return (
    <motion.figure ref={ref} className={`${styles.galleryCard} ${styles[photo.className]}`} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.18 }} transition={{ delay: index * 0.08, duration: 0.5 }}>
      <motion.div className={styles.galleryImage} style={{ clipPath }}>
        <motion.div className={styles.galleryImageInner} style={{ y }}>
          <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 760px) 100vw, 50vw" />
        </motion.div>
      </motion.div>
      <figcaption><span>{String(index + 1).padStart(2, "0")}</span>{photo.tag}</figcaption>
    </motion.figure>
  );
}

function PlaystyleScene() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["16%", "-14%"]);
  const scale = useTransform(scrollYProgress, [0, 0.45, 1], [0.72, 1, 1.12]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.82, 1], [0, 1, 1, 0]);
  const wordX = useTransform(scrollYProgress, [0, 1], ["-12%", "-52%"]);
  const detailOpacity = useTransform(scrollYProgress, [0.36, 0.55], [0, 1]);

  return (
    <section ref={ref} className={styles.playstyle} aria-label="Style de jeu">
      <div className={styles.playstyleSticky}>
        <motion.div className={styles.playstyleWord} style={{ x: wordX }} aria-hidden="true">INSTINCT&nbsp; · &nbsp;IMPACT&nbsp; · &nbsp;INSTINCT&nbsp; · &nbsp;IMPACT&nbsp; · &nbsp;</motion.div>
        <motion.div className={styles.playstylePhoto} style={{ y: photoY, scale, opacity }}><Image src="/images/efe-pose.jpg" alt="Efe Hakkı Polat concentré sur le terrain" fill sizes="100vw" /></motion.div>
        <motion.div className={styles.playstyleCopy} style={{ opacity: detailOpacity }}><p className={styles.sectionIndex}>02 / STYLE DE JEU</p><h2>Vivre<br />dans la <em>surface.</em></h2><p>Puissant dans ses déplacements, toujours tourné vers le but, Efe avance avec une mentalité de compétiteur.</p></motion.div>
        <div className={styles.playstyleMarker}><span>09</span><i /><span>FINISHER</span></div>
      </div>
    </section>
  );
}

function Site() {
  const [loaded, setLoaded] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const cursorX = useSpring(useMotionValue(-100), { stiffness: 500, damping: 35 });
  const cursorY = useSpring(useMotionValue(-100), { stiffness: 500, damping: 35 });
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImageY = useTransform(heroProgress, [0, 1], ["0%", "20%"]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.16]);
  const heroCopyY = useTransform(heroProgress, [0, 1], ["0%", "45%"]);
  const heroOpacity = useTransform(heroProgress, [0, 0.72], [1, 0]);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 350);
    if (reducedMotion) return () => window.clearTimeout(timer);
    const lenis = new Lenis({ duration: 1.25, smoothWheel: true, touchMultiplier: 1.25, anchors: true });
    let frame = 0;
    const raf = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(raf); };
    frame = requestAnimationFrame(raf);
    return () => { window.clearTimeout(timer); cancelAnimationFrame(frame); lenis.destroy(); };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const moveCursor = (event: MouseEvent) => { cursorX.set(event.clientX); cursorY.set(event.clientY); };
    window.addEventListener("pointermove", moveCursor);
    return () => window.removeEventListener("pointermove", moveCursor);
  }, [cursorX, cursorY, reducedMotion]);

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
      <motion.div className={styles.progress} style={{ scaleX: scrollYProgress }} />
      <motion.div className={styles.cursor} style={{ x: cursorX, y: cursorY }} aria-hidden="true"><span /></motion.div>
      <div className={`${styles.loader} ${loaded ? styles.loaderDone : ""}`} aria-hidden="true">
        <div className={styles.loaderTop}>EFE HAKKI POLAT</div><div className={styles.loaderCount}>09</div><div className={styles.loaderBottom}>BUILDING THE MOMENT</div>
      </div>

      <main>
        <section ref={heroRef} className={styles.hero} id="accueil">
          <nav className={styles.nav} aria-label="Navigation principale">
            <a className={styles.monogram} href="#accueil" aria-label="Retour à l'accueil">EH<span>9</span></a>
            <div className={styles.navLinks}><a href="#profil">Profil</a><a href="#parcours">Parcours</a><a href="#galerie">Galerie</a></div>
            <a className={styles.navCta} href="#contact">Contact <span>↗</span></a>
          </nav>
          <motion.div className={styles.heroImage} style={{ y: heroImageY, scale: heroScale }}><Image src="/images/efe-hero.jpg" alt="Efe Hakkı Polat, attaquant buteur" fill priority sizes="100vw" /></motion.div>
          <div className={styles.heroVignette} /><div className={styles.heroGrid} />
          <motion.div className={styles.heroContent} style={{ y: heroCopyY, opacity: heroOpacity }}>
            <motion.p className={styles.eyebrow} initial={{ opacity: 0, y: 12 }} animate={loaded ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.8 }}>Franco-Turc · Attaquant de pointe</motion.p>
            <h1 className={styles.title}><motion.span initial={{ y: "110%" }} animate={loaded ? { y: 0 } : {}} transition={{ delay: 0.9, duration: 1.05, ease: [0.16, 1, 0.3, 1] }}>EFE</motion.span><motion.span className={styles.titleOutline} initial={{ y: "110%" }} animate={loaded ? { y: 0 } : {}} transition={{ delay: 1.02, duration: 1.05, ease: [0.16, 1, 0.3, 1] }}>POLAT</motion.span></h1>
            <motion.div className={styles.heroLower} initial={{ opacity: 0, y: 20 }} animate={loaded ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.35 }}><p>Le but comme instinct.<br />Le travail comme signature.</p><a href="#profil" className={styles.scrollCue}><i /> Découvrir le parcours</a></motion.div>
          </motion.div>
          <div className={styles.heroNumber} aria-hidden="true">9</div><p className={styles.heroSide}>Édition 2026 · France / Türkiye</p>
          <div className={styles.heroPulse} aria-hidden="true"><span /><span /><span /></div>
        </section>

        <section className={styles.intro} id="profil">
          <Reveal><p className={styles.sectionIndex}>01 / LE JOUEUR</p></Reveal>
          <Reveal className={styles.introStatement}><p className={styles.kicker}>À seulement 18 ans</p><h2>Un buteur qui ne cesse de <em>gravir</em> les échelons.</h2></Reveal>
          <div className={styles.profileGrid}>
            <div className={styles.profileImageWrap}><Image className={styles.profileImage} src="/images/efe-profile.jpg" alt="Portrait d'Efe Hakkı Polat" fill sizes="(max-width: 760px) 100vw, 35vw" /><span className={styles.imageCaption}>Cluses Scionzier FC</span><span className={styles.profileNumber} aria-hidden="true">09</span><span className={styles.profilePlace}>France / Türkiye</span></div>
            <Reveal className={styles.profileCopy}><p>Les parcours les plus prometteurs ne sont pas toujours les plus linéaires. Efe Hakkı Polat avance avec une ambition intacte&nbsp;: atteindre le plus haut niveau.</p><p>Attaquant de pointe, il fait parler son sens du but, son instinct dans la surface et une détermination forgée loin des projecteurs.</p><dl className={styles.facts}><div><dt>Âge</dt><dd>18 ans</dd></div><div><dt>Poste</dt><dd>Avant-centre</dd></div><div><dt>Nationalité</dt><dd>Franco-Turc</dd></div><div><dt>Qualités</dt><dd>Puissance · Instinct · Travail</dd></div></dl></Reveal>
          </div>
        </section>

        <PlaystyleScene />

        <section className={styles.manifesto}><Reveal><p className={styles.sectionIndex}>03 / MENTALITÉ</p></Reveal><Reveal><p className={styles.manifestoText}>Chaque essai. <span>Chaque entraînement.</span> Chaque match.</p></Reveal><motion.div className={styles.manifestoPhoto} initial={{ opacity: 0, rotate: 10, y: 100 }} whileInView={{ opacity: 0.8, rotate: 5, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 1.2 }}><Image src="/images/efe-pose.jpg" alt="Efe Hakkı Polat sur le terrain" fill sizes="(max-width: 760px) 100vw, 55vw" /></motion.div><Reveal className={styles.manifestoNote}><p>Une occasion de franchir<br />un nouveau cap.</p></Reveal></section>

        <section className={styles.journey} id="parcours">
          <header className={styles.journeyHeader}><Reveal><p className={styles.sectionIndex}>04 / LE PARCOURS</p></Reveal><Reveal><h2>Un chemin<br />en mouvement.</h2></Reveal></header>
          <ol className={styles.timeline}>
            {[['ES Thyez','Les premières années, l’apprentissage et les fondations d’un jeu tourné vers le but.','France'],['Cluses Scionzier FC','U18 Régional 2, puis une saison décisive et l’accession de l’équipe en Régional 1.','France'],['Chênois FC','Premier défi à l’international. Convaincant à l’essai, il rejoint l’équipe réserve.','Suisse'],['Gençlerbirliği','Un essai concluant dans un club historique turc, freiné par des questions administratives.','Türkiye'],['Erzurumspor','Actuellement au camp d’évaluation, avec la même envie de convaincre et progresser.','Türkiye · Aujourd’hui']].map(([club, text, place], index) => <motion.li key={club} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ delay: index * 0.07 }}><span className={styles.timelineNumber}>{String(index + 1).padStart(2, '0')}</span><div><h3>{club}</h3><p>{text}</p></div><span className={styles.timelinePlace}>{place}</span></motion.li>)}
          </ol>
        </section>

        <section className={styles.gallerySection} id="galerie"><header className={styles.galleryHeader}><Reveal><p className={styles.sectionIndex}>05 / SUR LE TERRAIN</p></Reveal><Reveal><h2>La suite<br />s’écrit ici.</h2></Reveal></header><div className={styles.gallery}>{gallery.map((photo, index) => <GalleryImage key={photo.src} photo={photo} index={index} />)}</div></section>

        <section className={styles.contact} id="contact"><Reveal><p className={styles.sectionIndex}>06 / CONTACT</p></Reveal><Reveal><p className={styles.contactLead}>Pour les opportunités qui<br />demandent plus qu’un <em>talent.</em></p></Reveal><Reveal><a className={styles.contactMail} href="mailto:contact@efehakkipolat.com">contact@efehakkipolat.com <span>↗</span></a></Reveal><div className={styles.contactFooter}><p>EFE HAKKI POLAT<br />ATTAQUANT · BUTEUR</p><p>© 2026</p></div></section>
      </main>
    </MotionConfig>
  );
}

export default function Home() { return <Site />; }
