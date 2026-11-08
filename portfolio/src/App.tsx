const BASE = import.meta.env.BASE_URL;
import { useEffect, useRef, useState, type FormEvent, type CSSProperties } from "react";
import { ArrowUpRight, ArrowDown, ArrowRight, Plus, Minus, X, Check, Loader2 } from "lucide-react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const projects = {
  veleray: {
    category: "Ad creative & strategy", title: "A familiar belief.\n52 ways to tell it.", client: "Veleray · Lung-care supplements",
    intro: "From a Moroccan home remedy to a distinct, research-led creative system for Meta.", label: "Creative development case study",
    challenge: "Two supplements. One Moroccan audience. A market full of the same ‘detox’ message. The task was to find a more familiar, more human starting point.",
    thinking: "Customer language pointed to honey, ginger, and the remedies people already knew from home. That insight became the central idea: grandma’s remedy, already in a spoon.",
    delivery: ["8 creative angles, from nostalgia to everyday settings", "52 static executions and a structured test plan", "French and Darija copy, with English adaptations", "Visual briefs, claim checks, and production guidance"],
    note: "This case study shows creative development and a proposed test plan. Live campaign performance is not reported.",
    files: [{ name: "Read the full case study", url: BASE + "work/veleray-case-study.pdf" }],
  },
  health: {
    category: "Funnel & conversion copy", title: "One story.\nA clearer next step.", client: "Gut-health coaching · Sample funnel",
    intro: "An email, discovery-call page, and sales page connected by one reader journey.", label: "Self-initiated portfolio sample",
    challenge: "Give a health-coaching offer a coherent journey, from a free journal to a discovery call and a deeper explanation of the coaching method.",
    thinking: "Keep the message matched at each step. Introduce the journal, help the reader understand its use, then explain the T.R.A.C.K. offer without changing the central story.",
    delivery: ["A journal-focused welcome email", "A discovery-call landing page", "A long-form T.R.A.C.K. sales page", "Headlines, objections, offer framing, and calls to action"],
    note: "Sample copy, not a live client result. The PDFs include illustrative health claims and explicitly marked testimonial placeholders; they are not verified outcomes or Soufiane’s personal medical history.",
    files: [{ name: "Welcome email", url: BASE + "work/health-welcome-email.pdf" }, { name: "Landing page", url: BASE + "work/health-landing-page.pdf" }, { name: "Sales page", url: BASE + "work/health-sales-page.pdf" }],
  },
};
const services = [
  { title: "Ad creative & strategy", intro: "Give your next test a distinct idea.", body: "Research-led static concepts, video hooks, and editor-ready scripts. Each concept starts with one reader, one idea, and one clear action.", items: ["Static ad concepts & visual briefs", "Video hooks, scripts & storyboards", "Creative test plans & shot lists"] },
  { title: "Email & funnel copy", intro: "Keep the conversation going, all the way to the offer.", body: "A clear thread from the first click to the next decision. Copy shaped around what your reader needs to understand, believe, and do.", items: ["Welcome, nurture & sales emails", "Landing pages & long-form sales pages", "Headlines, bullets & offer messaging"] },
  { title: "Research & conversion audits", intro: "Find the words, objections, and gaps worth acting on.", body: "Voice-of-customer research and focused teardowns that turn scattered feedback into a useful brief and specific next steps.", items: ["Customer language & objection research", "Positioning & message-match reviews", "Ad and page audits with rewrite recommendations"] },
];

export default function Home() {
  const [filter, setFilter] = useState("All work");
  const [expanded, setExpanded] = useState<number | null>(0);
  const [activeProject, setActiveProject] = useState<keyof typeof projects | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [formState, setFormState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");
  const [selectedService, setSelectedService] = useState("Ad creative & strategy");
  const caseDialog = useRef<HTMLDialogElement>(null);
  const contactDialog = useRef<HTMLDialogElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = new Lenis({ lerp: 0.05, smoothWheel: !reduced });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add("motion-ready");
    const sheets = Array.from(document.querySelectorAll<HTMLElement>(".sheet"));
    const layout = () => { sheets.forEach((sheet, i) => { sheet.style.zIndex = String((i + 1) * 2); sheet.style.top = `${Math.min(0, window.innerHeight - sheet.offsetHeight)}px`; }); ScrollTrigger.refresh(); };
    const observer = new ResizeObserver(layout); sheets.forEach(s => observer.observe(s));
    const draw = () => {
      const h = window.innerHeight; let current = sheets[0]; let incoming: HTMLElement | null = null;
      sheets.forEach(sheet => { const r = sheet.getBoundingClientRect(); if (r.top <= 45 && r.bottom > 45) current = sheet; if (r.top > 0 && r.top < h) incoming = sheet; });
      navRef.current?.setAttribute("data-ink", current?.dataset.ink || "dark");
      if (veilRef.current) { const next = incoming as HTMLElement | null; veilRef.current.style.opacity = next ? String(Math.min(.34, (1 - next.getBoundingClientRect().top / h) * .34)) : "0"; veilRef.current.style.zIndex = next ? String(Number(next.style.zIndex) - 1) : "1"; }
    };
    lenis.on("scroll", draw);
    const reveal = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add("visible"); reveal.unobserve(e.target); } }), { threshold: .12 });
    document.querySelectorAll(".rv").forEach(el => reveal.observe(el));
    const ctx = gsap.context(() => {
      if (!reduced) {
        gsap.fromTo(".hero-title span", { yPercent: 110, clipPath: "inset(100% 0 -0.2em 0)" }, { yPercent: 0, clipPath: "inset(0% 0 -0.2em 0)", duration: 1.45, stagger: .14, ease: "power3.out", delay: .15 });
        gsap.fromTo(".hero-name", { yPercent: 105 }, { yPercent: 0, duration: 1.8, ease: "power3.out", delay: .3 });
        gsap.fromTo(".reflect-band", { x: i => Math.sin(i * .37) * 75 + Math.cos(i * .19) * 35 }, { x: 0, ease: "none", scrollTrigger: { trigger: ".reflect", start: "top bottom", end: "top 18%", scrub: 1 } });
        gsap.fromTo(".work-slice", { y: i => Math.sin(i * .35) * 12, x: i => (i - 36) * .25 }, { y: 0, x: 0, ease: "none", scrollTrigger: { trigger: ".veleray-frame", start: "top 95%", end: "center 55%", scrub: 1 } });
        gsap.to(".approach", { "--sx": "78%", ease: "none", scrollTrigger: { trigger: ".approach", start: "top bottom", end: "bottom top", scrub: 1 } });
        gsap.fromTo(".cord", { "--k": 0 }, { "--k": 1, stagger: .15, scrollTrigger: { trigger: ".process-grid", start: "top 90%", end: "center 60%", scrub: 1 } });
      }
    });
    let raf = 0; const slices = Array.from(document.querySelectorAll<HTMLElement>(".breathe-slice"));
    const breathe = (t: number) => { if (!reduced && document.visibilityState === "visible") slices.forEach((s, i) => { s.style.translate = `0 ${Math.sin(t * .00065 + i * .14) * .65}px`; }); raf = requestAnimationFrame(breathe); };
    if (!reduced) raf = requestAnimationFrame(breathe);
    window.addEventListener("resize", layout); document.fonts.ready.then(layout); layout(); draw();
    return () => { observer.disconnect(); reveal.disconnect(); ctx.revert(); window.removeEventListener("resize", layout); gsap.ticker.remove(tick); lenis.destroy(); cancelAnimationFrame(raf); document.documentElement.classList.remove("motion-ready"); };
  }, []);
  useEffect(() => { if(activeProject) caseDialog.current?.showModal(); else caseDialog.current?.close(); }, [activeProject]);
  useEffect(() => { if(contactOpen) contactDialog.current?.showModal(); else contactDialog.current?.close(); }, [contactOpen]);
  useEffect(() => {
    if (activeProject || contactOpen || mobileMenu) { lenisRef.current?.stop(); document.body.style.overflow = "hidden"; }
    else { lenisRef.current?.start(); document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [activeProject, contactOpen, mobileMenu]);
  function goTo(id: string) {
    lenisRef.current?.start();
    setMobileMenu(false);
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".sheet"));
    const index = sections.findIndex(section => `#${section.id}` === id);
    if(index < 0) return;
    // Sticky bounds describe the stacked position; navigation needs flow position.
    const position = sections.slice(0, index).reduce((sum, section) => sum + section.offsetHeight, 0);
    lenisRef.current?.scrollTo(position, { duration: 1.7, force: true });
  }
  function openContact(service?: string) { if(service) setSelectedService(service); setFormState("idle"); setContactOpen(true); }
  function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `Project inquiry — ${String(data.get("service") || "Copywriting")}`;
    const body = `Name: ${String(data.get("name") || "")}\nEmail: ${String(data.get("email") || "")}\nService: ${String(data.get("service") || "")}\n\n${String(data.get("message") || "")}`;
    window.location.href = `mailto:Soufiane.copywriting@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setFormState("success");
  }
  const project = activeProject ? projects[activeProject] : null;
  return <>
    <a className="skip-link" href="#work">Skip to work</a>
    <header className="nav" ref={navRef} data-ink="dark" data-menu={mobileMenu}>
      <a href="#home" onClick={e => {e.preventDefault();goTo("#home");}} className="wordmark" aria-label="Soufiane Haoudi home">sh<span>.</span></a>
      <nav aria-label="Main navigation" className="desktop-nav">{[['Work','work'],['Approach','approach'],['Services','services']].map(([name,id]) => <a key={id} href={`#${id}`} onClick={e=>{e.preventDefault();goTo(`#${id}`);}}>{name}</a>)}</nav>
      <button className="nav-contact" onClick={()=>openContact()}>Let’s talk <ArrowUpRight size={15}/></button>
      <button className="menu-toggle" aria-expanded={mobileMenu} aria-label={mobileMenu ? "Close navigation" : "Open navigation"} onClick={()=>setMobileMenu(!mobileMenu)}>{mobileMenu ? <X size={22}/> : <><span/><span/></>}</button>
    </header>
    {mobileMenu && <nav className="mobile-nav" aria-label="Mobile navigation">{[['Work','work'],['Approach','approach'],['Services','services'],['Contact','contact']].map(([name,id])=><a key={id} href={`#${id}`} onClick={e=>{e.preventDefault();goTo(`#${id}`);}}>{name}<ArrowUpRight/></a>)}</nav>}
    <div className="veil" ref={veilRef} aria-hidden="true"/>
    <svg className="filter-defs" aria-hidden="true"><defs><filter id="ripple"><feTurbulence type="fractalNoise" baseFrequency="0.0025 0.035" numOctaves="2" seed="7"><animate attributeName="baseFrequency" dur="16s" values="0.0025 0.035;0.0025 0.042;0.0025 0.035" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" scale="3" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg>
    <main>
      <section id="home" className="sheet hero" data-ink="dark">
        <div className="hero-art" aria-hidden="true"/>
        <div className="hero-top cap">Independent copy & creative strategy <span>English · Français · Darija</span></div>
        <div className="hero-message"><p className="eyebrow cap rv">Clear thinking. Persuasive writing.</p><h1 className="hero-title"><span>Words that</span><span><em>move people.</em></span></h1><p className="hero-description rv">I turn customer insight into ads, emails, and pages<br className="desktop-break"/> that give people a reason to take the next step.</p><a className="text-link hero-link rv" href="#work" onClick={e=>{e.preventDefault();goTo("#work");}}>Explore the work <ArrowDown size={16}/></a></div>
        <div className="hero-role cap">Direct response copywriter<br/>& creative strategist</div>
        <div className="name-mask"><div className="hero-name" aria-hidden="true">SOUFIANE<span> HAOUDI</span></div></div>
        <div className="hero-bottom cap"><span>Soufiane Haoudi</span><span>Thoughtfully written. Built for response.</span><button onClick={()=>goTo("#work")} aria-label="Scroll to selected work"><ArrowDown size={15}/></button></div>
      </section>
      <section id="work" className="sheet work" data-ink="dark">
        <div className="section-top cap"><span>01 / Selected work</span><span>A look behind the words</span></div>
        <div className="work-heading"><h2 className="rv">Good copy has<br/><em>a reason behind it.</em></h2><p className="rv">Two projects. Different challenges.<br/>A closer look at the research, the thinking,<br className="desktop-break"/> and the work that followed.</p></div>
        <div className="work-filters" role="group" aria-label="Filter selected work">{["All work","Ads & strategy","Funnels & copy"].map(item=><button key={item} className={filter===item?"active":""} aria-pressed={filter===item} onClick={()=>setFilter(item)}>{item}{filter===item && <span/>}</button>)}</div>
        <div className={`project-grid ${filter!=="All work"?"is-filtered":""}`}>
          {filter!=="Funnels & copy" && <article className="project-card"><button className="project-image veleray-frame" onClick={()=>setActiveProject("veleray")} aria-label="View Veleray creative case study"><div className="slice-art" role="img" aria-label="Veleray ad concepts from the supplied case study">{Array.from({length:72},(_,i)=><b key={i} className="work-slice breathe-slice" style={{left:`${i/72*100}%`,backgroundPosition:`${i/71*100}% 50%`} as CSSProperties}/>)}</div><span className="image-tag cap">Meta ad creative</span><span className="round-arrow"><ArrowUpRight size={21}/></span></button><div className="project-meta cap"><span>Veleray</span><span>Creative development</span></div><button className="project-title" onClick={()=>setActiveProject("veleray")}>A familiar belief.<br/><em>52 ways to tell it.</em><ArrowUpRight/></button><p>One customer insight, eight creative angles, and a complete system of static ads ready to test.</p><div className="project-specs cap"><span>Research</span><span>Ad concepts</span><span>Creative strategy</span></div></article>}
          {filter!=="Ads & strategy" && <article className="project-card health-card"><button className="project-image health-frame" onClick={()=>setActiveProject("health")} aria-label="View health-coaching sample funnel"><div className="page-preview page-back"><div className="browser-dots"><i/><i/><i/></div><img src={BASE + "assets/health-sales.webp"} alt="T.R.A.C.K. sample sales page" loading="lazy"/></div><div className="page-preview page-front"><div className="browser-dots"><i/><i/><i/></div><img src={BASE + "assets/health-email.webp"} alt="Gut-health welcome email sample" loading="lazy"/></div><span className="image-tag cap">Email → landing page → sales page</span><span className="round-arrow"><ArrowUpRight size={21}/></span></button><div className="project-meta cap"><span>Health-coaching funnel</span><span>Portfolio sample</span></div><button className="project-title" onClick={()=>setActiveProject("health")}>One story.<br/><em>A clearer next step.</em><ArrowUpRight/></button><p>A connected journey from a free journal to a discovery call and the T.R.A.C.K. coaching offer.</p><div className="project-specs cap"><span>Email copy</span><span>Landing page</span><span>Sales page</span></div></article>}
        </div><p className="work-footnote cap">Explore the idea, the execution, and the next test.</p>
      </section>
      <section id="approach" className="sheet approach reflect" data-ink="dark">
        <div className="sweep" aria-hidden="true"/><div className="section-top cap"><span>02 / The approach</span><span>Listen first. Write second.</span></div>
        <div className="approach-top"><h2 className="rv">Before the right words,<br/><em>the right questions.</em></h2><div className="approach-intro rv"><p>I’m Soufiane, a direct response copywriter and creative strategist focused on DTC and wellness.</p><p>I look for the language your customers already use, the belief holding them back, and the one idea worth building around. Then I write.</p></div></div>
        <div className="band-strip" aria-hidden="true">{Array.from({length:72},(_,i)=><b key={i} className="reflect-band" style={{top:`${i/72*100}%`,"--band-index":i} as CSSProperties}><span/></b>)}</div>
        <div className="process-grid">{[{n:"01",title:"Find the truth.",text:"Customer reviews, real conversations, desires, and objections. Useful research before a single headline."},{n:"02",title:"Choose one idea.",text:"One reader. One relevant message. One offer and one action. A clear brief for every piece."},{n:"03",title:"Make it work.",text:"Write, simplify, and check the proof. Deliver copy and creative your team can actually produce and test."}].map(step=><div className="cord" key={step.n}><article className="glass-card"><span className="cap">{step.n} /</span><h3>{step.title}</h3><p>{step.text}</p></article></div>)}</div>
        <div className="language-line cap"><span>Built around your reader</span><span>English / French / Arabic & Darija</span></div>
      </section>
      <section id="services" className="sheet services" data-ink="light">
        <div className="section-top cap"><span>03 / Ways to work together</span><span>From insight to execution</span></div><div className="services-heading"><h2 className="rv">A sharper message.<br/><em>A useful next move.</em></h2><p className="rv">Bring me the product, the offer, or the page<br/>that isn’t saying what it should.</p></div>
        <div className="service-list">{services.map((service,i)=><article className={`service ${expanded===i?"open":""}`} key={service.title}><button className="service-toggle" aria-expanded={expanded===i} aria-controls={`service-${i}`} onClick={()=>setExpanded(expanded===i?null:i)}><span className="service-num cap">0{i+1}</span><span>{service.title}</span>{expanded===i?<Minus size={24}/>:<Plus size={24}/>}</button><div className="service-content" id={`service-${i}`} inert={expanded!==i}><div className="service-content-inner"><div><h3>{service.intro}</h3><p>{service.body}</p><button className="text-link" onClick={()=>openContact(service.title)}>Talk about your project <ArrowUpRight size={16}/></button></div><ul>{service.items.map(item=><li key={item}><ArrowUpRight size={12}/>{item}</li>)}</ul></div></div></article>)}</div>
        <div className="service-bottom cap"><span>Focused projects or ongoing creative support</span><span>One clear brief to start.</span></div>
      </section>
      <section id="contact" className="sheet contact" data-ink="dark">
        <div className="section-top cap"><span>04 / Your next chapter</span><span>Let’s make it clear</span></div><div className="contact-main"><span className="contact-star" aria-hidden="true">✳</span><h2 className="rv">Something worth selling?<br/><em>Let’s find the words.</em></h2><p className="rv">Tell me what you’re building, who it’s for,<br/>and where you need a clearer message.</p><button className="primary-button" onClick={()=>openContact()}>Start a project <ArrowUpRight size={19}/></button><div className="contact-details"><a href="mailto:Soufiane.copywriting@gmail.com">Soufiane.copywriting@gmail.com <ArrowUpRight size={14}/></a><a href="tel:+212615481049">+212 615-481049 <ArrowUpRight size={14}/></a></div><span className="contact-small cap">A few details. A good starting point.</span></div>
        <footer><a href="#home" onClick={e=>{e.preventDefault();goTo("#home");}} className="footer-name">Soufiane Haoudi<span>DR Copywriter & Creative Strategist</span></a><p className="cap">© {new Date().getFullYear()} Soufiane Haoudi</p><button className="back-top cap" onClick={()=>goTo("#home")}>Back to top <ArrowRight size={15}/></button></footer>
      </section>
    </main>
    <dialog ref={caseDialog} className="case-dialog" onCancel={()=>setActiveProject(null)} onClose={()=>setActiveProject(null)} onClick={e=>{if(e.target===e.currentTarget)setActiveProject(null);}} aria-labelledby="case-title" data-lenis-prevent>
      {project && <div className="case-inner"><div className="dialog-header cap"><span>{project.label}</span><button onClick={()=>setActiveProject(null)} aria-label="Close case study"><X size={22}/></button></div><div className="case-hero"><span className="cap">{project.client}</span><h2 id="case-title">{project.title.split('\n')[0]}<br/><em>{project.title.split('\n')[1]}</em></h2><p>{project.intro}</p></div>
      {activeProject==="veleray" ? <><img className="case-cover" src={BASE + "assets/veleray-cover.webp"} alt="Cover of Veleray creative system case study"/><div className="case-stats"><div><strong>52</strong><span className="cap">Static executions</span></div><div><strong>8</strong><span className="cap">Creative angles</span></div><div><strong>3</strong><span className="cap">Language versions</span></div></div></> : <div className="case-funnel"><span>Welcome email</span><ArrowRight size={18}/><span>Call booking page</span><ArrowRight size={18}/><span>Sales page</span></div>}
      <div className="case-copy"><div><span className="cap">01 / The challenge</span><p>{project.challenge}</p></div><div><span className="cap">02 / The thinking</span><p>{project.thinking}</p></div><div><span className="cap">03 / The deliverables</span><ul>{project.delivery.map(item=><li key={item}><Check size={16}/>{item}</li>)}</ul></div></div>
      {activeProject==="veleray" ? <img className="case-cover" src={BASE + "assets/veleray-angles.webp"} alt="Three ad angles: bakers, childhood memory, and winter at home" loading="lazy"/>:<div className="health-gallery">{["email","landing","sales"].map((p,i)=><a key={p} href={project.files[i].url} target="_blank" rel="noreferrer"><span className="cap">{project.files[i].name} ↗</span><img src={`${BASE}assets/health-${p}.webp`} alt={`${project.files[i].name} portfolio sample`} loading="lazy"/></a>)}</div>}
      <p className="case-note">{project.note}</p><div className="case-files">{project.files.map(file=><a href={file.url} key={file.url} target="_blank" rel="noreferrer" className="text-link">{file.name}<span className="cap">PDF</span><ArrowUpRight size={18}/></a>)}</div><div className="case-cta"><p>Have a similar challenge?</p><button className="primary-button" onClick={()=>{setActiveProject(null);openContact(project.category);}}>Let’s talk <ArrowUpRight size={18}/></button></div></div>}
    </dialog>
    <dialog ref={contactDialog} className="contact-dialog" onCancel={()=>setContactOpen(false)} onClose={()=>setContactOpen(false)} onClick={e=>{if(e.target===e.currentTarget)setContactOpen(false);}} aria-labelledby="inquiry-title" data-lenis-prevent>
      <div className="dialog-header cap"><span>A new conversation</span><button onClick={()=>setContactOpen(false)} aria-label="Close project inquiry"><X size={22}/></button></div>
      {formState==="success" ? <div className="form-success" role="status"><div className="success-mark"><Check size={30}/></div><h2 id="inquiry-title">Let’s start<br/><em>a conversation.</em></h2><p>Your email app opens with your project details. Review the draft and send it to Soufiane.copywriting@gmail.com. You can also use the email link below.</p><a className="primary-button" href="mailto:Soufiane.copywriting@gmail.com">Email Soufiane <ArrowUpRight size={18}/></a></div> : <><h2 id="inquiry-title">Tell me about<br/><em>your project.</em></h2><p className="form-intro">A little context goes a long way. Or <a href="mailto:Soufiane.copywriting@gmail.com">email me directly</a>.</p><form onSubmit={submitInquiry}>
        <div className="form-row"><label>Your name<input name="name" autoComplete="name" required maxLength={120} placeholder="How should I call you?"/></label><label>Email address<input type="email" name="email" autoComplete="email" required maxLength={254} placeholder="you@company.com"/></label></div>
        <label>What do you need?<select name="service" value={selectedService} onChange={e=>setSelectedService(e.target.value)}>{[...services.map(s=>s.title),"Funnel & conversion copy","Not sure yet"].map(s=><option key={s}>{s}</option>)}</select></label>
        <label>A little about the project<textarea name="message" required minLength={20} maxLength={5000} rows={4} placeholder="Your product, your audience, and what you’d like to make clearer…"/></label>
        <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label><p className="form-privacy">This opens a draft in your email app. Review it and send when you’re ready.</p>{formState==="error" && <p className="form-error" role="alert">{formError}</p>}<button className="primary-button" type="submit" disabled={formState==="sending"}>{formState==="sending" ? <>Sending <Loader2 className="spin" size={18}/></> : <>Open email draft <ArrowUpRight size={18}/></>}</button>
      </form></>}
    </dialog>
  </>;
}
