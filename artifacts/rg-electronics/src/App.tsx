import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, ArrowDownRight, ArrowRight, BadgeCheck, Check, CircleAlert, Globe2, Menu, Phone, Search, Users, X } from 'lucide-react';
import { Link, Route, Switch, useLocation, useParams, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

type Product = {
  slug: string;
  name: string;
  category: string;
  eyebrow: string;
  description: string;
  image: string;
  tone: 'light' | 'dark';
  specs: string[];
  detail: string;
};

const products: Product[] = [
  {
    slug: 'sentinel-4k-dome',
    name: 'Sentinel 4K Dome',
    category: 'CCTV & surveillance',
    eyebrow: 'CCTV / 01',
    description: 'A discreet 4K eye for lobbies, corridors, and critical approaches.',
    image: '/images/camera-detail.png',
    tone: 'light',
    specs: ['8 MP / 4K ultra HD', 'Night vision to 30 m', 'IP67 weather protection'],
    detail: 'A dependable, low-profile dome camera specified for the places where clarity and restraint matter. We pair it with the right lens, recorder, network and retention plan for the site.',
  },
  {
    slug: 'clearline-access',
    name: 'Clearline Access',
    category: 'Access control',
    eyebrow: 'ACCESS / 02',
    description: 'Entry, attendance, and audit trails without the visual noise.',
    image: '/images/access-control.png',
    tone: 'dark',
    specs: ['RFID / biometric ready', 'Multi-door expansion', 'Local fail-safe memory'],
    detail: 'From a single staff entrance to a multi-building campus, Clearline is a considered access layer designed around people flow, permissions, and continuity.',
  },
  {
    slug: 'aegis-fire-panel',
    name: 'Aegis Fire Panel',
    category: 'Fire alarm systems',
    eyebrow: 'FIRE / 03',
    description: 'Addressable detection with a clear answer when it matters.',
    image: '/images/hero-control-room.png',
    tone: 'light',
    specs: ['Addressable loop architecture', 'Event history and zoning', 'Battery-backed continuity'],
    detail: 'Aegis brings alarm, detection, evacuation and testing into one legible operating picture. Specified, installed and commissioned to the realities of the building.',
  },
  {
    slug: 'relay-ip-pbx',
    name: 'Relay IP PBX',
    category: 'EPABX & IP PBX',
    eyebrow: 'VOICE / 04',
    description: 'A stable voice layer for teams who still need to reach each other.',
    image: '/images/access-control.png',
    tone: 'dark',
    specs: ['SIP and analogue handsets', 'Call groups and IVR', 'Remote extension support'],
    detail: 'A flexible, serviceable telephony system for offices, hospitals, schools and distributed teams. We handle configuration, cabling and handover as one job.',
  },
  {
    slug: 'frame-video-room',
    name: 'Frame Video Room',
    category: 'Video conferencing',
    eyebrow: 'MEET / 05',
    description: 'Meeting rooms that are ready before the people arrive.',
    image: '/images/hero-control-room.png',
    tone: 'light',
    specs: ['4K room camera', 'Echo-cancelled audio', 'Teams / Zoom ready'],
    detail: 'We create meeting rooms that feel natural to use: clear audio, intelligent framing, simple controls and a handover your team can actually remember.',
  },
];

const categories = ['All systems', 'CCTV & surveillance', 'Fire alarm systems', 'Access control', 'EPABX & IP PBX', 'Video conferencing', 'Perimeter security', 'Fire & life safety', 'Communications', 'Access & automation', 'Traffic control', 'Screening'];

const stats = [
  { value: '12+', label: 'Years experience', icon: Award },
  { value: '100+', label: 'Projects completed', icon: BadgeCheck },
  { value: '50+', label: 'Team members', icon: Users },
  { value: '21+', label: 'Cities covered', icon: Globe2 },
];

const services = [
  { name: 'IP CCTV Surveillance System', category: 'CCTV & surveillance', description: 'Networked visibility for entrances, perimeters, corridors and critical spaces.', image: '/images/camera-detail.png' },
  { name: 'Under Vehicle Surveillance System (UVSS)', category: 'Perimeter security', description: 'A clear underside view for controlled vehicle movement and site screening.', image: '/images/hero-control-room.png' },
  { name: 'Intelligent Fire Alarm System', category: 'Fire & life safety', description: 'Addressable detection, zoning and event clarity when every second matters.', image: '/images/hero-control-room.png' },
  { name: 'Video Conferencing System', category: 'Communications', description: 'Rooms with clear audio, intelligent framing and controls people can use.', image: '/images/hero-control-room.png' },
  { name: 'EPABX & IP PBX System', category: 'Communications', description: 'Reliable voice infrastructure for teams, reception desks and distributed sites.', image: '/images/access-control.png' },
  { name: 'Audio Video System', category: 'Communications', description: 'Integrated sound and display systems for rooms that need to communicate.', image: '/images/hero-control-room.png' },
  { name: 'Domestic Automation & Access Control', category: 'Access & automation', description: 'Thoughtful entry, intercom and automation layers for homes and buildings.', image: '/images/access-control.png' },
  { name: 'Room Barriers', category: 'Traffic control', description: 'Vehicle access points that keep movement orderly without slowing the site down.', image: '/images/hero-control-room.png' },
  { name: 'Tyre Killer / Spike Barriers', category: 'Perimeter security', description: 'Physical control for high-risk approaches, checkpoints and restricted lanes.', image: '/images/access-control.png' },
  { name: 'Hydraulic Bollards', category: 'Traffic control', description: 'Robust rising protection for entries where the perimeter needs authority.', image: '/images/hero-control-room.png' },
  { name: 'Road Blockers', category: 'Perimeter security', description: 'Heavy-duty vehicle denial for sensitive or high-value sites.', image: '/images/access-control.png' },
  { name: 'Handheld Metal Detectors (HHMD)', category: 'Screening', description: 'Fast, dependable secondary screening for people and controlled access.', image: '/images/hero-control-room.png' },
  { name: 'Door Frame Metal Detectors (DFMD)', category: 'Screening', description: 'A discreet first layer for entrances, venues and secure facilities.', image: '/images/access-control.png' },
  { name: 'Baggage Scanners', category: 'Screening', description: 'Consistent inspection for bags, parcels and the flow of people through a site.', image: '/images/hero-control-room.png' },
  { name: 'Swing and Slide Gates', category: 'Access & automation', description: 'Measured, durable gate systems that complete the site’s access logic.', image: '/images/access-control.png' },
];

const serviceProducts: Product[] = services.map((service, index) => ({
  slug: service.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  name: service.name,
  category: service.category,
  eyebrow: `SERVICE / ${String(index + 1).padStart(2, '0')}`,
  description: service.description,
  image: service.image,
  tone: index % 2 === 0 ? 'light' : 'dark',
  specs: ['Site-specific equipment schedule', 'Installation and commissioning', 'Handover and ongoing support'],
  detail: `${service.description} We shape the specification around the site, coordinate the installation, and leave the operating team with a clear handover and a local number to call.`,
}));

const SERVICE_CATALOGUE_STORAGE_KEY = 'rg-electronics-service-catalogue-v1';

function isStoredProduct(value: unknown): value is Product {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<Product>;
  return typeof item.slug === 'string'
    && typeof item.name === 'string'
    && typeof item.category === 'string'
    && typeof item.eyebrow === 'string'
    && typeof item.description === 'string'
    && typeof item.image === 'string'
    && (item.tone === 'light' || item.tone === 'dark')
    && Array.isArray(item.specs)
    && item.specs.every((spec) => typeof spec === 'string')
    && typeof item.detail === 'string';
}

function useCatalogueProducts() {
  const [storedServices, setStoredServices] = useState<Product[]>(serviceProducts);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SERVICE_CATALOGUE_STORAGE_KEY);
      if (!raw) {
        window.localStorage.setItem(SERVICE_CATALOGUE_STORAGE_KEY, JSON.stringify(serviceProducts));
        return;
      }

      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed) || !parsed.every(isStoredProduct)) {
        window.localStorage.setItem(SERVICE_CATALOGUE_STORAGE_KEY, JSON.stringify(serviceProducts));
        return;
      }

      const storedBySlug = new Map(parsed.map((service) => [service.slug, service]));
      const merged = serviceProducts.map((service) => ({
        ...service,
        ...(storedBySlug.get(service.slug) ?? {}),
        category: service.category,
      }));
      setStoredServices(merged);
      window.localStorage.setItem(SERVICE_CATALOGUE_STORAGE_KEY, JSON.stringify(merged));
    } catch {
      setStoredServices(serviceProducts);
    }
  }, []);

  return [...products, ...storedServices];
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}

function SiteIntro() {
  const reduceMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (reduceMotion) {
      setVisible(false);
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => setVisible(false), 1450);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, [reduceMotion]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="intro-loader fixed inset-0 z-[100] overflow-hidden"
        role="status"
        aria-label="Loading R G Electronics"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.2, ease: 'easeOut' }}
      >
        <div className="intro-loader__grid absolute inset-0" aria-hidden="true" />
        <motion.div
          className="intro-loader__panel intro-loader__panel--left absolute inset-y-0 left-0 w-1/2"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ delay: 0.48, duration: 0.72, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        />
        <motion.div
          className="intro-loader__panel intro-loader__panel--right absolute inset-y-0 right-0 w-1/2"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ delay: 0.48, duration: 0.72, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        />
        <div className="relative z-10 flex min-h-full items-center justify-center px-6">
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.36, duration: 0.35, ease: 'easeIn' }}
          >
            <div className="flex h-14 w-14 items-center justify-center border border-[#6dd4f2]/50 bg-[#172534] text-[#f4f2ec]">
              <span className="font-mono text-sm tracking-[-.08em]">R/G</span>
            </div>
            <p className="mono mt-5 text-[10px] uppercase tracking-[.22em] text-[#d7f4fb]">R G Electronics</p>
            <p className="mt-3 text-xs text-[#a4c6cc]">Systems. Specified.</p>
          </motion.div>
        </div>
        <motion.div
          className="absolute left-1/2 top-1/2 z-20 h-28 w-px origin-top -translate-x-1/2 -translate-y-1/2 bg-[#d7f4fb]"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: [0, 1, 1, 0] }}
          transition={{ delay: 0.08, duration: 1.02, times: [0, 0.2, 0.68, 1], ease: 'easeInOut' }}
          aria-hidden="true"
        />
        <div className="absolute bottom-7 left-6 right-6 z-20 flex items-center justify-between sm:bottom-9 sm:left-10 sm:right-10">
          <motion.span
            className="mono text-[9px] uppercase tracking-[.16em] text-[#b7dbe2]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.14, duration: 0.25 }}
          >
            New Delhi · India
          </motion.span>
          <motion.span
            className="mono text-[9px] uppercase tracking-[.16em] text-[#b7dbe2]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.24, duration: 0.25 }}
          >
            Loading systems
          </motion.span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="R G Electronics home">
      <span className="flex h-9 w-9 items-center justify-center bg-[#172534] text-[#f4f2ec]">
        <span className="font-mono text-[12px] font-medium tracking-[-.08em]">R/G</span>
      </span>
      <span className="leading-none">
        <span className="block text-[13px] font-extrabold tracking-[-.04em] text-[#172534]">R G ELECTRONICS</span>
        <span className="mt-1 block font-mono text-[8px] uppercase tracking-[.18em] text-[#63727b]">Systems. Specified.</span>
      </span>
    </Link>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const reduceMotion = usePrefersReducedMotion();
  const nav = [
    { href: '/products', label: 'Systems' },
    { href: '/about', label: 'Our approach' },
    { href: '/contact', label: 'Contact' },
  ];
  useEffect(() => setMenuOpen(false), [location]);
  return (
    <motion.header initial={reduceMotion ? false : { y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: reduceMotion ? 0 : .55, ease: [.22, 1, .36, 1] }} className="relative z-50 border-b border-[#dcd9d0] bg-[#f4f2ec]">
      <div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {nav.map((item) => <Link key={item.href} href={item.href} className={`text-[12px] font-semibold transition-colors hover:text-[#007cae] ${location === item.href ? 'text-[#007cae]' : 'text-[#394751]'}`}>{item.label}</Link>)}
        </nav>
        <div className="flex items-center gap-3">
          <a href="tel:+911145670760" className="hidden items-center gap-2 text-[12px] font-semibold text-[#394751] hover:text-[#007cae] lg:flex"><Phone size={14} strokeWidth={1.8} /> +91 11 4567 0760</a>
          <Link href="/contact" className="hidden bg-[#007cae] px-4 py-2.5 text-[12px] font-bold text-white transition-transform hover:-translate-y-0.5 sm:inline-flex">Plan a site visit <ArrowRight size={14} className="ml-2" /></Link>
          <button className="inline-flex h-10 w-10 items-center justify-center border border-[#cfcac0] text-[#172534] md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-controls="mobile-navigation" aria-expanded={menuOpen}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {menuOpen && <motion.div id="mobile-navigation" initial={reduceMotion ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={reduceMotion ? undefined : { opacity: 0, height: 0 }} transition={{ duration: reduceMotion ? 0 : .25, ease: [.22, 1, .36, 1] }} className="absolute left-0 right-0 top-[74px] overflow-hidden border-b border-[#dcd9d0] bg-[#f4f2ec] px-5 py-5 md:hidden">
          <nav className="flex flex-col" aria-label="Mobile navigation">
            {nav.map((item, index) => <motion.div key={item.href} initial={reduceMotion ? false : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reduceMotion ? 0 : index * .04 }}><Link href={item.href} className="block border-b border-[#dcd9d0] py-4 text-sm font-semibold text-[#172534]">{item.label}</Link></motion.div>)}
            <a href="tel:+911145670760" className="flex items-center gap-2 py-4 text-sm font-semibold text-[#007cae]"><Phone size={15} /> Call New Delhi office</a>
          </nav>
        </motion.div>}
      </AnimatePresence>
    </motion.header>
  );
}

function Footer() {
  return <footer className="bg-[#172534] text-[#e9ebe6]">
    <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.2fr_.8fr_.8fr_1fr] lg:px-12">
      <div><div className="mb-6 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center bg-[#0066cc] text-white"><span className="font-mono text-[12px] font-medium tracking-[-.08em]">R/G</span></span><span className="text-[13px] font-extrabold tracking-[-.04em]">R G ELECTRONICS</span></div><p className="max-w-xs text-sm leading-7 text-[#acb8bc]">Security and communications infrastructure, specified and supported from New Delhi.</p></div>
      <div><p className="mono mb-5 text-[10px] uppercase text-[#7e929b]">Explore</p><div className="flex flex-col gap-3 text-sm text-[#e9ebe6]"><Link href="/products">Systems catalogue</Link><Link href="/about">Our approach</Link><Link href="/contact">Start a conversation</Link></div></div>
      <div><p className="mono mb-5 text-[10px] uppercase text-[#7e929b]">Capability</p><div className="flex flex-col gap-3 text-sm text-[#e9ebe6]"><span>CCTV & surveillance</span><span>Fire & life safety</span><span>Access & communications</span></div></div>
      <div><p className="mono mb-5 text-[10px] uppercase text-[#7e929b]">New Delhi office</p><address className="not-italic text-sm leading-7 text-[#e9ebe6]">A-18, Okhla Industrial Area<br />Phase II, New Delhi 110020<br /><a className="text-[#2997ff]" href="tel:+911145670760">+91 11 4567 0760</a><br /><a className="text-[#2997ff]" href="mailto:hello@rgelectronics.in">hello@rgelectronics.in</a></address></div>
    </div>
    <div className="border-t border-[#2f414b] px-5 py-5 sm:px-8 lg:px-12"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-2 text-[11px] text-[#7e929b] sm:flex-row"><span>© 2024 R G Electronics. Built for the long run.</span><span>Licensed installation · Testing · Commissioning</span></div></div>
  </footer>;
}

function PageShell({ children }: { children: ReactNode }) {
  return <><a href="#main-content" className="skip-link">Skip to content</a><Header />{children}<Footer /></>;
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const reduceMotion = usePrefersReducedMotion();
  return <motion.div initial={reduceMotion ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .16 }} transition={{ duration: reduceMotion ? 0 : .65, delay: reduceMotion ? 0 : delay, ease: [.22, 1, .36, 1] }} className={className}>{children}</motion.div>;
}

function StatsStrip() {
  return <section className="bg-[#f4f2ec] px-5 py-10 sm:px-8 lg:px-12">
    <div className="mx-auto grid max-w-[1200px] grid-cols-2 border-y border-[#d7d4ca] lg:grid-cols-4">
      {stats.map((stat) => { const Icon = stat.icon; return <div key={stat.label} className="border-b border-[#d7d4ca] px-5 py-7 last:border-b-0 sm:px-7 lg:border-b-0 lg:border-r lg:last:border-r-0"><Icon size={19} strokeWidth={1.8} className="text-[#007cae]" /><p className="display mt-8 text-3xl font-extrabold tracking-[-.06em] text-[#172534] sm:text-4xl">{stat.value}</p><p className="mt-2 text-xs text-[#65747a]">{stat.label}</p></div>; })}
    </div>
  </section>;
}

function ServicesGrid() {
  const catalogueProducts = useCatalogueProducts();
  const serviceItems = catalogueProducts.filter((product) => product.eyebrow.startsWith('SERVICE /'));
  return <section className="bg-[#f8f7f3] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
    <div className="mx-auto max-w-[1200px]">
      <Reveal><SectionLabel>Main services</SectionLabel><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><h2 className="display max-w-2xl text-4xl font-extrabold leading-[1.03] text-[#172534] sm:text-6xl">The systems that make a site feel looked after.</h2><ArrowLink href="/products">See all systems</ArrowLink></div></Reveal>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {serviceItems.map((service, index) => <Reveal key={service.slug} delay={(index % 3) * .05}><Link href={`/products/${service.slug}`} className="group block overflow-hidden border border-[#d7d4ca] bg-[#f4f2ec] transition-colors hover:border-[#007cae]">
          <div className="relative h-36 overflow-hidden bg-[#172534]"><img src={service.image} alt="" className="h-full w-full object-cover opacity-55 transition-transform duration-700 group-hover:scale-[1.05]" /><div className="absolute inset-0 bg-[#172534]/35" /><div className="absolute inset-x-5 bottom-4 flex items-center justify-between"><span className="mono text-[10px] uppercase tracking-[.14em] text-[#b9c5c5]">{service.eyebrow} / {service.category}</span><ArrowUpRight /></div></div>
          <div className="p-5"><h3 className="display text-xl font-extrabold leading-tight text-[#172534]">{service.name}</h3><p className="mt-3 text-sm leading-6 text-[#65747a]">{service.description}</p><span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#0066cc]">View service <ArrowRight size={14} /></span></div>
        </Link></Reveal>)}
      </div>
    </div>
  </section>;
}

function SectionLabel({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <div className={`mono mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[.16em] ${light ? 'text-[#9db0b6]' : 'text-[#65747a]'}`}><span className={`h-px w-7 ${light ? 'bg-[#60747d]' : 'bg-[#007cae]'}`} />{children}</div>;
}

function ArrowLink({ href, children, light = false }: { href: string; children: ReactNode; light?: boolean }) {
  return <Link href={href} className={`group inline-flex items-center gap-2 text-sm font-bold ${light ? 'text-[#2997ff]' : 'text-[#0066cc]'}`}>{children}<ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></Link>;
}

function Home() {
  return <PageShell>
    <main id="main-content">
      <section className="relative min-h-[650px] overflow-hidden bg-[#172534] text-[#f4f2ec]">
        <div className="absolute inset-0"><img src="/images/hero-control-room.png" alt="R G Electronics security control room" className="h-full w-full object-cover opacity-45" /><div className="absolute inset-0 bg-[#172534]/55" /></div>
        <div className="relative mx-auto flex min-h-[650px] max-w-[1440px] flex-col justify-between px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
          <div className="flex items-start justify-between"><SectionLabel light>New Delhi · Since 1998</SectionLabel><span className="mono hidden text-[10px] uppercase tracking-[.14em] text-[#b4c1c3] sm:block">Infrastructure partner / 01</span></div>
          <div className="max-w-4xl pb-4">
            <h1 className="display max-w-4xl text-5xl font-extrabold leading-[.98] tracking-[-.07em] sm:text-7xl lg:text-[104px]">Security that<br /><span className="text-[#2997ff]">keeps its word.</span></h1>
            <div className="mt-8 flex max-w-2xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"><p className="max-w-md text-base leading-7 text-[#ccd4d2]">We design, supply, install, test, and commission the systems that let buildings do their work safely.</p><Link href="/products" className="inline-flex w-fit items-center gap-3 border border-[#2997ff] px-5 py-3 text-sm font-bold text-[#2997ff] transition-colors hover:bg-[#2997ff] hover:text-[#172534]">View our systems <ArrowDownRight size={16} /></Link></div>
          </div>
        </div>
      </section>
      <StatsStrip />

      <section className="bg-[#f4f2ec] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-[.9fr_1.4fr] lg:items-start">
          <div><SectionLabel>What we do</SectionLabel><h2 className="display max-w-sm text-4xl font-extrabold leading-[1.03] text-[#172534] sm:text-5xl">The invisible work behind a well-run place.</h2></div>
          <div><p className="max-w-2xl text-xl leading-8 text-[#40515a]">A camera is only one part of a security system. We look at the building, the people moving through it, the team who will operate it, and the day something needs attention.</p><div className="mt-12 grid gap-px border border-[#d7d4ca] bg-[#d7d4ca] sm:grid-cols-3"><div className="bg-[#f4f2ec] p-6"><span className="mono text-xs text-[#007cae]">01</span><h3 className="mt-10 text-sm font-extrabold text-[#172534]">Specify</h3><p className="mt-3 text-sm leading-6 text-[#66757a]">Right product, right location, right operating logic.</p></div><div className="bg-[#f4f2ec] p-6"><span className="mono text-xs text-[#007cae]">02</span><h3 className="mt-10 text-sm font-extrabold text-[#172534]">Commission</h3><p className="mt-3 text-sm leading-6 text-[#66757a]">Installed, tested and handed over without loose ends.</p></div><div className="bg-[#f4f2ec] p-6"><span className="mono text-xs text-[#007cae]">03</span><h3 className="mt-10 text-sm font-extrabold text-[#172534]">Support</h3><p className="mt-3 text-sm leading-6 text-[#66757a]">A local team who answers when the building calls.</p></div></div></div>
        </div>
      </section>

      <section className="bg-[#e6e3db] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1440px]"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><SectionLabel>Selected systems</SectionLabel><h2 className="display text-4xl font-extrabold leading-none text-[#172534] sm:text-6xl">Built for the<br />specifics.</h2></div><ArrowLink href="/products">Explore the catalogue</ArrowLink></div>
          <div className="mt-14 grid gap-4 lg:grid-cols-12">
            <Link href="/products/sentinel-4k-dome" className="group relative min-h-[560px] overflow-hidden bg-[#f8f7f3] lg:col-span-7"><img src="/images/camera-detail.png" alt="Sentinel 4K Dome CCTV camera" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" /><div className="absolute inset-0 bg-[#172534]/45" /><div className="absolute bottom-0 left-0 right-0 p-7 text-white sm:p-10"><p className="mono text-[10px] uppercase tracking-[.16em] text-[#2997ff]">CCTV / 01</p><h3 className="display mt-3 text-4xl font-extrabold">Sentinel 4K Dome</h3><p className="mt-3 max-w-sm text-sm leading-6 text-[#d5dedc]">A discreet 4K eye for the places that need a clear answer.</p><span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#2997ff]">View system <ArrowRight size={15} /></span></div></Link>
             <div className="grid gap-4 lg:col-span-5"><Link href="/products/clearline-access" className="group relative min-h-[270px] overflow-hidden bg-[#172534] text-white"><img src="/images/access-control.png" alt="Clearline access control reader" className="absolute inset-0 h-full w-full object-cover opacity-55 transition-transform duration-700 group-hover:scale-[1.03]" /><div className="absolute inset-0 bg-[#172534]/45" /><div className="relative flex h-full flex-col justify-between p-7 sm:p-8"><p className="mono text-[10px] uppercase tracking-[.16em] text-[#9db0b6]">Access / 02</p><div><h3 className="display text-3xl font-extrabold">Clearline Access</h3><p className="mt-2 text-sm text-[#c6d0ce]">Entry without the visual noise.</p></div></div></Link><Link href="/products/aegis-fire-panel" className="group flex min-h-[270px] flex-col justify-between bg-[#f8f7f3] p-7 text-[#172534] transition-colors hover:bg-[#e5f0ff] sm:p-8"><div className="flex justify-between"><p className="mono text-[10px] uppercase tracking-[.16em] text-[#0066cc]">Fire / 03</p><ArrowUpRight /></div><div><h3 className="display text-3xl font-extrabold">Aegis Fire Panel</h3><p className="mt-2 max-w-xs text-sm leading-6 text-[#65747a]">A clear answer when it matters.</p></div></Link></div>
          </div>
        </div>
      </section>
      <ServicesGrid />

      <section className="bg-[#172534] px-5 py-20 text-[#f4f2ec] sm:px-8 lg:px-12 lg:py-28"><div className="mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-end"><div><SectionLabel light>Good to know</SectionLabel><h2 className="display max-w-lg text-4xl font-extrabold leading-[1.04] sm:text-6xl">The person on the other end is part of the system.</h2></div><div><p className="text-lg leading-8 text-[#b9c5c5]">R G Electronics has been working with builders, facility teams, schools, hospitals and offices across Delhi NCR for more than two decades. Our work is technical. Our approach is human.</p><ArrowLink href="/about" light>How we work</ArrowLink></div></div></section>
      <ContactBand />
    </main>
  </PageShell>;
}

function ArrowUpRight() { return <ArrowRight size={17} className="-rotate-45" />; }

function About() {
  return <PageShell><main id="main-content">
    <section className="bg-[#f4f2ec] px-5 py-20 sm:px-8 lg:px-12 lg:py-32"><div className="mx-auto max-w-[1200px]"><SectionLabel>Our approach</SectionLabel><h1 className="display max-w-5xl text-5xl font-extrabold leading-[.98] text-[#172534] sm:text-7xl lg:text-[92px]">Quietly rigorous.<br /><span className="text-[#007cae]">Present when needed.</span></h1><p className="mt-10 max-w-2xl text-xl leading-8 text-[#40515a]">R G Electronics is a New Delhi systems partner for buildings with something to protect, coordinate, or keep moving.</p></div></section>
    <section className="grid bg-[#172534] text-[#f4f2ec] lg:grid-cols-2"><div className="min-h-[480px] bg-[#243845]"><img src="/images/hero-control-room.png" alt="Security monitoring room" className="h-full w-full object-cover opacity-75" /></div><div className="flex items-center px-5 py-20 sm:px-12 lg:px-20"><div className="max-w-lg"><SectionLabel light>Since 1998</SectionLabel><h2 className="display text-4xl font-extrabold leading-tight sm:text-5xl">We make complex infrastructure feel considered.</h2><p className="mt-7 text-base leading-8 text-[#bdc9c8]">Our team brings together product knowledge, site sense and the patience to explain what is happening. We do not just leave a box behind. We leave a working system, a clear handover and a number to call.</p></div></div></section>
    <section className="bg-[#e6e3db] px-5 py-20 sm:px-8 lg:px-12 lg:py-28"><div className="mx-auto max-w-[1200px]"><SectionLabel>What that means on site</SectionLabel><div className="mt-12 grid gap-10 md:grid-cols-3"><div><span className="mono text-4xl text-[#007cae]">01</span><h3 className="mt-8 text-xl font-extrabold text-[#172534]">Read the building</h3><p className="mt-4 text-sm leading-7 text-[#5e6c71]">We start with movement, materials, risk and the people who will use the place.</p></div><div><span className="mono text-4xl text-[#007cae]">02</span><h3 className="mt-8 text-xl font-extrabold text-[#172534]">Make it legible</h3><p className="mt-4 text-sm leading-7 text-[#5e6c71]">Every system is documented, tested and explained in language teams can use.</p></div><div><span className="mono text-4xl text-[#007cae]">03</span><h3 className="mt-8 text-xl font-extrabold text-[#172534]">Stay nearby</h3><p className="mt-4 text-sm leading-7 text-[#5e6c71]">Our New Delhi base means practical support is never abstract or far away.</p></div></div></div></section>
    <ContactBand />
  </main></PageShell>;
}

function Products() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All systems');
  const catalogueProducts = useCatalogueProducts();
  const filtered = useMemo(() => catalogueProducts.filter((p) => (category === 'All systems' || p.category === category) && `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(query.toLowerCase())), [catalogueProducts, category, query]);
  return <PageShell><main id="main-content">
     <section className="bg-[#172534] px-5 py-20 text-[#f4f2ec] sm:px-8 lg:px-12 lg:py-28"><div className="mx-auto max-w-[1200px]"><SectionLabel light>Systems catalogue</SectionLabel><h1 className="display max-w-4xl text-5xl font-extrabold leading-[.98] sm:text-7xl">The right layer<br /><span className="text-[#2997ff]">for the right place.</span></h1><p className="mt-8 max-w-xl text-lg leading-8 text-[#b9c5c5]">Browse the systems we specify, supply, install and support. Every product is a starting point for a site conversation.</p></div></section>
    <section className="bg-[#f4f2ec] px-5 py-14 sm:px-8 lg:px-12 lg:py-20"><div className="mx-auto max-w-[1200px]">
       <div className="flex flex-col gap-6 border-b border-[#d7d4ca] pb-8 lg:flex-row lg:items-center lg:justify-between"><div className="relative w-full max-w-md"><label htmlFor="system-search" className="sr-only">Search systems</label><Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#66757a]" aria-hidden="true" /><input id="system-search" name="search" value={query} onChange={(e) => setQuery(e.target.value)} type="search" autoComplete="off" placeholder="Search systems…" className="h-12 w-full border border-[#cfcac0] bg-[#f8f7f3] pl-11 pr-4 text-base text-[#172534] outline-none focus:border-[#007cae]" /></div><div className="flex flex-wrap gap-2">{categories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} className={`min-h-11 border px-3 py-2 text-[11px] font-bold transition-colors ${category === item ? 'border-[#007cae] bg-[#007cae] text-white' : 'border-[#cfcac0] text-[#536168] hover:border-[#007cae] hover:text-[#007cae]'}`}>{item}</button>)}</div></div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((product) => <ProductCard key={product.slug} product={product} />)}</div>
      {filtered.length === 0 && <div className="border border-dashed border-[#cfcac0] py-20 text-center"><CircleAlert className="mx-auto text-[#007cae]" /><h2 className="mt-5 text-xl font-extrabold text-[#172534]">No systems matched that search.</h2><button onClick={() => { setQuery(''); setCategory('All systems'); }} className="mt-4 text-sm font-bold text-[#007cae]">Clear filters</button></div>}
    </div></section>
    <ContactBand />
  </main></PageShell>;
}

function ProductCard({ product }: { product: Product }) {
  return <Link href={`/products/${product.slug}`} className="group block border border-[#d7d4ca] bg-[#f8f7f3] transition-colors hover:border-[#0066cc]"><div className={`relative h-64 overflow-hidden ${product.tone === 'dark' ? 'bg-[#172534]' : 'bg-[#e6e3db]'}`}><img src={product.image} alt={product.name} className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] ${product.tone === 'dark' ? 'opacity-65' : ''}`} /><span className="absolute left-5 top-5 mono text-[10px] uppercase tracking-[.15em] text-[#2997ff]">{product.eyebrow}</span></div><div className="p-6"><p className="text-[11px] font-bold uppercase tracking-[.12em] text-[#65747a]">{product.category}</p><h2 className="display mt-3 text-2xl font-extrabold text-[#172534]">{product.name}</h2><p className="mt-3 min-h-[48px] text-sm leading-6 text-[#65747a]">{product.description}</p><div className="mt-6 flex items-center justify-between border-t border-[#d7d4ca] pt-4 text-sm font-bold text-[#0066cc]"><span>View system</span><ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></div></div></Link>;
}

function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const catalogueProducts = useCatalogueProducts();
  const product = catalogueProducts.find((p) => p.slug === slug);
  if (!product) return <PageShell><div className="px-5 py-32 text-center"><h1 className="display text-5xl font-extrabold text-[#172534]">System not found.</h1><Link href="/products" className="mt-6 inline-block text-[#007cae]">Back to catalogue</Link></div></PageShell>;
  return <PageShell><main id="main-content">
    <section className={`grid min-h-[620px] lg:grid-cols-2 ${product.tone === 'dark' ? 'bg-[#172534] text-[#f4f2ec]' : 'bg-[#e6e3db] text-[#172534]'}`}><div className="flex flex-col justify-center px-5 py-16 sm:px-12 lg:px-20"><SectionLabel light={product.tone === 'dark'}>{product.eyebrow}</SectionLabel><h1 className="display max-w-xl text-5xl font-extrabold leading-[.98] sm:text-7xl">{product.name}</h1><p className={`mt-8 max-w-lg text-lg leading-8 ${product.tone === 'dark' ? 'text-[#bdc9c8]' : 'text-[#536168]'}`}>{product.detail}</p><Link href="/contact" className="mt-9 inline-flex w-fit items-center bg-[#007cae] px-5 py-3 text-sm font-bold text-white">Ask about this system <ArrowRight size={15} className="ml-3" /></Link></div><div className="relative min-h-[420px] overflow-hidden"><img src={product.image} alt={product.name} className="h-full w-full object-cover" /></div></section>
    <section className="bg-[#f4f2ec] px-5 py-20 sm:px-8 lg:px-12 lg:py-28"><div className="mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-[.8fr_1.2fr]"><div><SectionLabel>Specification notes</SectionLabel><h2 className="display max-w-sm text-4xl font-extrabold leading-tight text-[#172534]">A system, not a shopping list.</h2></div><div><div className="grid gap-px border border-[#d7d4ca] bg-[#d7d4ca] sm:grid-cols-3">{product.specs.map((spec, i) => <div key={spec} className="bg-[#f4f2ec] p-6"><span className="mono text-[10px] text-[#007cae]">0{i + 1}</span><p className="mt-12 text-sm font-bold leading-6 text-[#172534]">{spec}</p></div>)}</div><p className="mt-10 max-w-xl text-sm leading-7 text-[#65747a]">Final specification depends on your site survey, operating requirements, network environment and compliance needs. Tell us what you are planning; we will help shape the right brief.</p></div></div></section>
    <ContactBand subject={`Enquiry about ${product.name}`} />
  </main></PageShell>;
}

function ContactBand({ subject }: { subject?: string }) {
  return <section className="bg-[#f5f5f7] px-5 py-16 sm:px-8 lg:px-12 lg:py-20"><div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-9 md:flex-row md:items-end"><div><SectionLabel>Start with the building</SectionLabel><h2 className="display max-w-2xl text-4xl font-extrabold leading-[1.03] text-[#172534] sm:text-5xl">Have a site, a question, or a deadline?</h2></div><Link href={`/contact${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`} className="inline-flex w-fit items-center bg-[#0066cc] px-5 py-3.5 text-sm font-bold text-white">Talk to our team <ArrowRight size={16} className="ml-3" /></Link></div></section>;
}

function Contact() {
  const [location] = useLocation();
  const subject = new URLSearchParams(location.split('?')[1] || '').get('subject') || '';
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', message: subject });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    if (status === 'error') {
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    }
  }, [errors, status]);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Please enter your name.';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Please enter a valid email.';
    if (!form.message.trim()) next.message = 'Tell us a little about the site.';
    setErrors(next);
    if (Object.keys(next).length) { setStatus('error'); return; }
    setStatus('success');
  };
  return <PageShell><main id="main-content">
    <section className="bg-[#172534] px-5 py-20 text-[#f4f2ec] sm:px-8 lg:px-12 lg:py-28"><div className="mx-auto max-w-[1200px]"><SectionLabel light>New Delhi office</SectionLabel><h1 className="display max-w-4xl text-5xl font-extrabold leading-[.98] sm:text-7xl">Let’s make the<br /><span className="text-[#2997ff]">next step clear.</span></h1><div className="mt-10 flex flex-col gap-2 text-sm text-[#bdc9c8] sm:flex-row sm:gap-8"><a href="tel:+911145670760" className="hover:text-[#2997ff]">+91 11 4567 0760</a><a href="mailto:hello@rgelectronics.in" className="hover:text-[#2997ff]">hello@rgelectronics.in</a></div></div></section>
    <section className="bg-[#f4f2ec] px-5 py-16 sm:px-8 lg:px-12 lg:py-24"><div className="mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-[1.05fr_.95fr]"><div><SectionLabel>Tell us what you are solving</SectionLabel><h2 className="display max-w-md text-4xl font-extrabold leading-tight text-[#172534]">A useful first conversation does not need a perfect brief.</h2><p className="mt-6 max-w-md text-sm leading-7 text-[#65747a]">Share the basics and a member of our team will come back to you during office hours. For urgent site matters, call us directly.</p><div className="mt-12 border-t border-[#d7d4ca] pt-6"><p className="mono text-[10px] uppercase tracking-[.14em] text-[#65747a]">Office hours</p><p className="mt-3 text-sm font-bold text-[#172534]">Monday–Saturday · 9:30 am–6:30 pm</p><p className="mt-2 text-sm text-[#65747a]">A-18, Okhla Industrial Area, Phase II<br />New Delhi 110020</p></div></div>
       <form onSubmit={submit} noValidate className="border border-[#d7d4ca] bg-[#f8f7f3] p-6 sm:p-8">{status === 'success' ? <div className="flex min-h-[420px] flex-col items-start justify-center" role="status" aria-live="polite"><div className="flex h-12 w-12 items-center justify-center bg-[#007cae] text-white"><Check size={22} /></div><h2 className="display mt-8 text-3xl font-extrabold text-[#172534]">Message received.</h2><p className="mt-4 max-w-sm text-sm leading-7 text-[#65747a]">Thank you, {form.name || 'there'}. Our New Delhi team will be in touch shortly.</p><button type="button" onClick={() => { setStatus('idle'); setForm({ name: '', company: '', email: '', phone: '', message: '' }); }} className="mt-8 min-h-11 text-sm font-bold text-[#007cae]">Send another enquiry</button></div> : <><div className="grid gap-5 sm:grid-cols-2"><Field id="name" name="name" autoComplete="name" label="Your name" value={form.name} error={errors.name} onChange={(v) => setForm({ ...form, name: v })} required /><Field id="company" name="organization" autoComplete="organization" label="Company / organisation" value={form.company} onChange={(v) => setForm({ ...form, company: v })} /><Field id="email" name="email" autoComplete="email" type="email" label="Work email" value={form.email} error={errors.email} onChange={(v) => setForm({ ...form, email: v })} required /><Field id="phone" name="tel" autoComplete="tel" type="tel" label="Phone number" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} /></div><label htmlFor="message" className="mt-5 block text-xs font-bold text-[#172534]">What can we help with? <span className="text-[#007cae]">*</span><textarea id="message" name="message" autoComplete="off" aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className={`mt-2 w-full resize-none border bg-[#f4f2ec] p-3 text-base text-[#172534] outline-none focus:border-[#007cae] ${errors.message ? 'border-[#b33c32]' : 'border-[#cfcac0]'}`} placeholder="A site, a system, a question…" />{errors.message && <span id="message-error" className="mt-1 block text-[11px] font-normal text-[#b33c32]">{errors.message}</span>}</label>{status === 'error' && <p className="mt-4 flex items-center gap-2 text-xs font-bold text-[#b33c32]" role="alert" aria-live="polite"><CircleAlert size={15} aria-hidden="true" /> Please check the highlighted fields.</p>}<button type="submit" className="mt-6 inline-flex min-h-11 items-center bg-[#007cae] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#00688f]">Send enquiry <ArrowRight size={15} className="ml-3" aria-hidden="true" /></button><p className="mt-5 text-[11px] leading-5 text-[#7b8789]">Your details are used only to respond to this enquiry.</p></>}</form></div></section>
    <section className="bg-[#e6e3db] px-5 py-16 sm:px-8 lg:px-12 lg:py-20"><div className="mx-auto max-w-[1200px]"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><SectionLabel>Find us</SectionLabel><h2 className="display text-4xl font-extrabold text-[#172534]">Okhla Industrial Area, Phase II.</h2></div><a href="https://www.openstreetmap.org/?mlat=28.535&mlon=77.276#map=15/28.535/77.276" target="_blank" rel="noreferrer" className="text-sm font-bold text-[#0066cc]">Open in maps <ArrowUpRight /></a></div><div className="relative mt-10 h-[360px] overflow-hidden border border-[#cfcac0] bg-[#d7d4ca]"><iframe title="R G Electronics service area map" className="h-full w-full grayscale-[.7] contrast-[.9]" src="https://www.openstreetmap.org/export/embed.html?bbox=77.235%2C28.505%2C77.315%2C28.565&amp;layer=mapnik&amp;marker=28.535%2C77.276" /><div className="pointer-events-none absolute bottom-5 left-5 bg-[#172534] px-4 py-3 text-white"><p className="mono text-[9px] uppercase tracking-[.14em] text-[#2997ff]">Service area</p><p className="mt-1 text-xs font-bold">Delhi NCR · On site</p></div></div></div></section>
  </main></PageShell>;
}

function Field({ id, name, autoComplete, type = 'text', label, value, onChange, error, required }: { id: string; name: string; autoComplete: string; type?: 'text' | 'email' | 'tel'; label: string; value: string; onChange: (value: string) => void; error?: string; required?: boolean }) {
  return <label htmlFor={id} className="block text-xs font-bold text-[#172534]">{label} {required && <span className="text-[#007cae]">*</span>}<input id={id} name={name} type={type} autoComplete={autoComplete} required={required} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} value={value} onChange={(e) => onChange(e.target.value)} className={`mt-2 h-11 w-full border bg-[#f4f2ec] px-3 text-base font-normal text-[#172534] outline-none focus:border-[#007cae] ${error ? 'border-[#b33c32]' : 'border-[#cfcac0]'}`} />{error && <span id={`${id}-error`} className="mt-1 block text-[11px] font-normal text-[#b33c32]">{error}</span>}</label>;
}

function Router() {
  const [location] = useLocation();
  const reduceMotion = usePrefersReducedMotion();
  useEffect(() => {
    const path = location.split('?')[0];
    const title = path === '/' ? 'R G Electronics — Security & communications infrastructure' : path === '/about' ? 'Our approach — R G Electronics' : path === '/products' ? 'Systems catalogue — R G Electronics' : path === '/contact' ? 'Contact New Delhi — R G Electronics' : 'System detail — R G Electronics';
    document.title = title;
    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement('meta');
      description.setAttribute('name', 'description');
      document.head.appendChild(description);
    }
    description.setAttribute('content', 'R G Electronics specifies, installs and supports security and communications infrastructure for buildings across Delhi NCR.');
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, [location]);
  return <ErrorBoundary resetKey={location}><AnimatePresence mode="wait" initial={false}><motion.div key={location} initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -8 }} transition={{ duration: reduceMotion ? 0 : .35, ease: [.22, 1, .36, 1] }}><Switch><Route path="/" component={Home} /><Route path="/about" component={About} /><Route path="/products" component={Products} /><Route path="/products/:slug" component={ProductDetail} /><Route path="/contact" component={Contact} /><Route><PageShell><main id="main-content" className="px-5 py-32 text-center"><h1 className="display text-5xl font-extrabold text-[#172534]">Page not found.</h1><Link href="/" className="mt-6 inline-block text-[#007cae]">Return home</Link></main></PageShell></Route></Switch></motion.div></AnimatePresence></ErrorBoundary>;
}

function App() {
  return <TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><SiteIntro /><Toaster /></TooltipProvider>;
}

export default App;
