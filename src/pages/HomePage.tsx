import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  ChefHat,
  Clock3,
  Drumstick,
  Leaf,
  MapPin,
  Menu,
  ShieldCheck,
  ShoppingBag,
  Store,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { HomePhoneMockup } from "@/components/marketing/HomePhoneMockup";
import { Button } from "@/components/ui/button";
import {
  TestimonialsColumn,
  type TestimonialItem,
} from "@/components/ui/testimonials-columns-1";
import { cn } from "@/lib/utils";
import LogoMetal from "@/assets/LogoMetal.png";
import appleStoreIcon from "@/assets/apple_store.svg";
import playStoreIcon from "@/assets/play_store.svg";
import familyPackImage from "@/assets/family-pack.png";
import bonelessValueImage from "@/assets/boneless-value.png";
import marinatedImage from "@/assets/marinated.png";

const NAV_LINKS = [
  { label: "Menu", href: "#menu" },
  { label: "Why us", href: "#why-us" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Find us", href: "#find-us" },
] as const;

const CATEGORIES = [
  {
    icon: UtensilsCrossed,
    label: "Meals",
    subtitle: "Ready-to-cook cuts",
    badge: "Most ordered",
  },
  {
    icon: Drumstick,
    label: "Fresh cuts",
    subtitle: "Daily processed stock",
    badge: "Daily fresh",
  },
  {
    icon: ChefHat,
    label: "Family packs",
    subtitle: "Weekend-sized portions",
    badge: "Family value",
  },
  {
    icon: ShoppingBag,
    label: "Combos",
    subtitle: "Best-value bundles",
    badge: "Saver pick",
  },
] as const;

const HERO_SLIDES = [
  {
    title: "Fresh value, every day",
    subtitle:
      "Farm-fresh chicken, hygienic processing, and honest pricing for your family.",
    cta: "Order now",
  },
  {
    title: "From our farm to your kitchen",
    subtitle: "Trusted sourcing and daily cuts with quality you can taste.",
    cta: "Explore menu",
  },
  {
    title: "Cleanly packed, quickly delivered",
    subtitle: "Simple ordering through partner stores and online channels.",
    cta: "Find a store",
  },
] as const;

const TRUST_METRICS = [
  {
    value: "40+",
    label: "Partner stores",
    detail: "Across city and nearby towns",
    icon: Store,
  },
  {
    value: "6AM",
    label: "Daily fresh prep starts",
    detail: "Prepared fresh every morning",
    icon: Clock3,
  },
  {
    value: "100%",
    label: "Hygiene-first handling",
    detail: "Strict cleaning and safety checks",
    icon: ShieldCheck,
  },
] as const;

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Hygiene assured",
    description:
      "Strict cleaning and cold-chain handling from processing to pack.",
  },
  {
    icon: Leaf,
    title: "Fresh every morning",
    description: "Daily inventory rotation to keep quality high and waste low.",
  },
  {
    icon: Clock3,
    title: "Quick pickup windows",
    description:
      "Reserve by phone and collect from your nearest partner store.",
  },
  {
    icon: BadgeCheck,
    title: "Transparent pricing",
    description: "No hidden charges. Clear rates based on daily market values.",
  },
] as const;

const ORDER_FLOW = [
  {
    title: "Choose your cuts",
    description:
      "Select fresh cuts, combos, or family packs from today’s menu.",
  },
  {
    title: "Confirm with a nearby store",
    description: "We match your order with a trusted partner store near you.",
  },
  {
    title: "Pick up or get it delivered",
    description: "Collect in-store or use available local delivery channels.",
  },
] as const;

const FEATURED_SLOTS = [
  {
    title: "Sunday Family Pack",
    description: "For curry + fry combinations in one easy bundle.",
    imageSrc: familyPackImage,
    imageAlt: "Fresh family pack chicken cuts arranged in a tray",
    badge: "Family favourite",
  },
  {
    title: "Boneless Value Tray",
    description: "Clean boneless portions for wraps, grills, and stir fry.",
    imageSrc: bonelessValueImage,
    imageAlt: "Boneless chicken value tray",
    badge: "Best value",
  },
  {
    title: "Marinated Quick Grill",
    description: "Signature marinated pieces ready for pan or grill.",
    imageSrc: marinatedImage,
    imageAlt: "Marinated chicken pack ready for grilling",
    badge: "Chef pick",
  },
] as const;

const TESTIMONIALS: TestimonialItem[] = [
  {
    text: "Fresh cuts arrive clean and well-packed every time. Weekend cooking is much easier now.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    name: "Priya Menon",
    role: "Home Chef",
  },
  {
    text: "Order confirmation is fast, and pickup is smooth. Their quality has been consistent for months.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    name: "Arjun Nair",
    role: "Working Professional",
  },
  {
    text: "Family packs are excellent value. The cuts are fresh and portioned exactly as requested.",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=120&q=80",
    name: "Neha Joseph",
    role: "Parent",
  },
  {
    text: "Hygiene standards are noticeably better than nearby options. Highly dependable for weekly orders.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
    name: "Rahul Iyer",
    role: "Restaurant Owner",
  },
  {
    text: "The marinated packs save us prep time and still taste great on grill nights.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    name: "Ananya Das",
    role: "Food Blogger",
  },
  {
    text: "Customer support is responsive and helpful when we need bulk quantities for events.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    name: "Karan Bhat",
    role: "Event Coordinator",
  },
  {
    text: "Daily stock updates are accurate, which helps us plan meals without last-minute substitutions.",
    image:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=80",
    name: "Sana Ali",
    role: "Family Buyer",
  },
  {
    text: "Pricing is transparent and quality is reliable. This has become our go-to chicken supplier.",
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=120&q=80",
    name: "Vikram S.",
    role: "Store Partner",
  },
  {
    text: "Simple ordering flow and clean product quality. Exactly what we wanted for regular home use.",
    image:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=120&q=80",
    name: "Meera Kapoor",
    role: "Customer",
  },
];

const FIRST_COLUMN = TESTIMONIALS.slice(0, 3);
const SECOND_COLUMN = TESTIMONIALS.slice(3, 6);
const THIRD_COLUMN = TESTIMONIALS.slice(6, 9);

function StoreDownloadButtons({ fullWidth = false }: { fullWidth?: boolean }) {
  const btnClass = cn(
    "justify-start gap-2 border-border/80 text-[#E7000B] shadow-sm hover:bg-muted/60",
    fullWidth
      ? "h-auto min-h-11 w-full min-w-0 px-3 py-2.5"
      : "h-9 max-w-[140px] shrink-0 px-2.5 py-1",
  );

  return (
    <div
      className={cn(
        "flex gap-2",
        fullWidth ? "w-full flex-col" : "items-center",
      )}
    >
      <Button variant="outline" size="sm" className={btnClass} asChild>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          aria-label="Download on the App Store — coming soon"
        >
          <img
            src={appleStoreIcon}
            alt=""
            className={cn(
              "shrink-0 object-contain",
              fullWidth ? "size-8" : "size-7",
            )}
            aria-hidden
          />
          <span className="min-w-0 text-left leading-tight">
            <span className="block text-[9px] font-medium text-[#E7000B]/85">
              Download on the
            </span>
            <span className="block text-sm font-semibold tracking-tight">
              App Store
            </span>
          </span>
        </a>
      </Button>
      <Button variant="outline" size="sm" className={btnClass} asChild>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          aria-label="Get it on Google Play — coming soon"
        >
          <img
            src={playStoreIcon}
            alt=""
            className={cn(
              "shrink-0 object-contain",
              fullWidth ? "size-8" : "size-7",
            )}
            aria-hidden
          />
          <span className="min-w-0 text-left leading-tight">
            <span className="block text-[9px] font-medium uppercase text-[#E7000B]/85">
              Get it on
            </span>
            <span className="block text-sm font-semibold tracking-tight">
              Google Play
            </span>
          </span>
        </a>
      </Button>
    </div>
  );
}

export default function HomePage() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-[#FFFFFF]/95 shadow-sm backdrop-blur-md supports-backdrop-filter:bg-[#FFFFFF]/90">
        <div className="relative mx-auto flex h-16 max-w-7xl items-center px-4 sm:h-20 sm:px-6">
          <Link
            to="/"
            className="relative z-10 flex shrink-0 items-center py-1"
          >
            <img
              src={LogoMetal}
              alt="Matha Chickens"
              className="pointer-events-none h-10 w-[85px] rounded-lg object-contain sm:h-12"
            />
          </Link>

          <nav
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-6 md:flex lg:gap-7"
            aria-label="Primary"
          >
            {NAV_LINKS.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className="text-sm font-semibold uppercase tracking-wide text-foreground/90 hover:text-[#E7000B]"
                asChild
              >
                <a href={item.href}>{item.label}</a>
              </Button>
            ))}
          </nav>

          <div className="relative z-10 ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex">
              <StoreDownloadButtons />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-foreground/80 md:hidden"
              type="button"
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-site-nav"
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileNavOpen((open) => !open)}
            >
              {mobileNavOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>
          </div>
        </div>

        {mobileNavOpen ? (
          <>
            <Button
              type="button"
              variant="ghost"
              className="fixed inset-x-0 bottom-0 top-16 z-40 h-auto min-h-0 rounded-none border-0 bg-black/40 p-0 hover:bg-black/50 sm:top-20 md:hidden"
              aria-label="Dismiss menu"
              onClick={() => setMobileNavOpen(false)}
            />
            <div
              id="mobile-site-nav"
              className="absolute left-0 right-0 top-full z-50 border-b border-border bg-[#FFFFFF] shadow-lg md:hidden"
            >
              <nav
                className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6"
                aria-label="Mobile primary"
              >
                {NAV_LINKS.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    className="h-auto justify-start rounded-lg px-3 py-3 text-sm font-semibold uppercase tracking-wide text-foreground/90 hover:text-[#E7000B]"
                    asChild
                  >
                    <a href={item.href} onClick={() => setMobileNavOpen(false)}>
                      {item.label}
                    </a>
                  </Button>
                ))}
                <div className="mt-4 border-t border-border pt-4">
                  <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Get the app
                  </p>
                  <div className="mt-3 px-0">
                    <StoreDownloadButtons fullWidth />
                  </div>
                </div>
              </nav>
            </div>
          </>
        ) : null}
      </header>

      <main className="font-sans [&_h1]:font-display [&_h2]:font-display [&_h3]:font-display">
        <section
          className="relative overflow-hidden bg-linear-to-br from-[#E7000B] via-[#c9000a] to-[#8c0606] px-4 pb-14 pt-16 text-[#FFFFFF] sm:pb-16 sm:pt-20 md:pb-20 md:pt-24"
          aria-label="Featured campaign"
        >
          <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#FFFFFF]/10 blur-2xl" />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-black/10 blur-3xl" />
          <div className="pointer-events-none absolute right-1/4 top-1/3 h-40 w-40 rounded-full border border-[#FFFFFF]/15" />

          <div className="relative mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:items-center">
            <div className="min-w-0">
              <p className="inline-flex rounded-full border border-[#FFFFFF]/35 bg-[#FFFFFF]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FFFFFF]/95">
                Matha Chickens
              </p>
              <h1 className="mt-5 text-3xl font-black uppercase leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                {HERO_SLIDES[heroIndex].title}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[#FFFFFF]/92 sm:text-lg">
                {HERO_SLIDES[heroIndex].subtitle}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  className="bg-[#FFFFFF] text-[#E7000B] hover:bg-[#FFFFFF]/90"
                  asChild
                >
                  <a href="#menu">
                    {HERO_SLIDES[heroIndex].cta}
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#FFFFFF] bg-transparent text-[#FFFFFF] hover:bg-[#FFFFFF]/10"
                  asChild
                >
                  <a href="#find-us">Find nearby stores</a>
                </Button>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-[#FFFFFF]/90">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FFFFFF]/15 px-3 py-1.5">
                  <ShieldCheck className="size-3.5" />
                  Daily hygiene checks
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FFFFFF]/15 px-3 py-1.5">
                  <Store className="size-3.5" />
                  Trusted local partners
                </span>
              </div>

              <div className="mt-10 flex gap-2">
                {HERO_SLIDES.map((_, i) => (
                  <Button
                    key={i}
                    type="button"
                    variant="ghost"
                    aria-label={`Slide ${i + 1}`}
                    onClick={() => setHeroIndex(i)}
                    className={cn(
                      "h-2 min-h-0 min-w-0 shrink-0 rounded-full p-0 transition-all hover:bg-[#FFFFFF]/70",
                      i === heroIndex
                        ? "w-8 bg-[#FFFFFF] hover:bg-[#FFFFFF]"
                        : "w-2 bg-[#FFFFFF]/40",
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[520px] md:mr-0">
              <div className="absolute -left-5 top-10 z-20 rounded-2xl bg-[#FFFFFF] px-4 py-3 text-[#0f0f0f] shadow-xl ring-1 ring-black/5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#E7000B]">
                  Quality promise
                </p>
                <p className="mt-1 text-sm font-bold">Fresh stock every day</p>
              </div>
              <div className="absolute -bottom-4 right-2 z-20 rounded-2xl bg-black/70 px-4 py-3 text-[#FFFFFF] backdrop-blur-sm ring-1 ring-[#FFFFFF]/15">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#FFFFFF]/75">
                  Launching soon
                </p>
                <p className="mt-1 text-sm font-bold">Matha ordering app</p>
              </div>
              <div className="rounded-[2rem] bg-[#FFFFFF]/10 p-6 ring-1 ring-[#FFFFFF]/20 backdrop-blur-sm">
                <HomePhoneMockup className="drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#fff7f7] px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto grid max-w-7xl gap-3 rounded-3xl border border-[#E7000B]/15 bg-[#fff7f7] p-3 sm:grid-cols-3 sm:gap-4 sm:p-4">
            {TRUST_METRICS.map(({ value, label, detail, icon: Icon }) => (
              <article
                key={label}
                className="group rounded-2xl border border-[#E7000B]/10 bg-[#FFFFFF] px-4 py-4 text-center shadow-sm transition hover:border-[#E7000B]/30 hover:shadow-md"
              >
                <span className="mx-auto flex size-10 items-center justify-center rounded-xl bg-[#E7000B]/10 text-[#E7000B]">
                  <Icon className="size-5" />
                </span>
                <p className="mt-3 text-2xl font-black text-[#E7000B] sm:text-3xl">
                  {value}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-foreground/70">
                  {label}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="menu"
          className="border-b border-border bg-background-secondary py-12 sm:py-14"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Menu
                </p>
                <h2 className="mt-2 text-3xl font-black text-foreground sm:text-4xl">
                  Pick your favourites
                </h2>
              </div>
              <p className="rounded-full border border-[#E7000B]/25 bg-[#FFFFFF] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#E7000B]">
                Fresh cuts updated daily
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CATEGORIES.map(({ icon: Icon, label, subtitle, badge }) => (
                <article
                  key={label}
                  className="group relative overflow-hidden rounded-2xl border border-[#E7000B]/12 bg-[#FFFFFF] p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#E7000B]/35 hover:shadow-lg"
                >
                  <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-[2rem] bg-linear-to-bl from-[#E7000B]/16 to-transparent" />
                  <span className="inline-flex rounded-full bg-[#E7000B]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#E7000B]">
                    {badge}
                  </span>
                  <span className="mt-3 flex size-12 items-center justify-center rounded-xl bg-[#E7000B]/10 text-[#E7000B] transition group-hover:bg-[#E7000B] group-hover:text-[#FFFFFF]">
                    <Icon className="size-6" />
                  </span>
                  <p className="mt-4 text-xl font-black text-foreground">
                    {label}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {subtitle}
                  </p>
                  <Button
                    variant="link"
                    asChild
                    className="mt-4 h-auto p-0 text-xs font-semibold uppercase tracking-wide text-[#E7000B] opacity-90 hover:opacity-100"
                  >
                    <a href="#contact">
                      Check availability
                      <ArrowRight className="ml-1 size-3.5" />
                    </a>
                  </Button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="why-us" className="py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#E7000B]">
              Why choose Matha
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase text-foreground sm:text-3xl">
              Trusted quality from sourcing to store
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {BENEFITS.map(({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-[#E7000B] text-[#FFFFFF]">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#E7000B]">
                  Featured picks
                </p>
                <h2 className="mt-2 text-2xl font-black uppercase text-foreground sm:text-3xl">
                  Best-selling cuts this week
                </h2>
              </div>
              <Button
                asChild
                className="bg-[#E7000B] text-[#FFFFFF] hover:bg-[#E7000B]/90"
              >
                <a href="#contact">Check today&apos;s rates</a>
              </Button>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {FEATURED_SLOTS.map((item) => (
                <article
                  key={item.title}
                  className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#f5f5f5]">
                    <img
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
                    <span className="absolute left-3 top-3 inline-flex rounded-full bg-[#FFFFFF]/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#E7000B]">
                      {item.badge}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section
          id="how-it-works"
          className="border-y border-border bg-linear-to-br from-[#FFF8F8] via-[#FFFFFF] to-[#FFF2F2] py-14 sm:py-16"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#E7000B]">
              How it works
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase text-foreground sm:text-3xl">
              3 simple steps to get fresh chicken
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {ORDER_FLOW.map((step, index) => (
                <article
                  key={step.title}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                  <p className="inline-flex rounded-full bg-[#E7000B] px-3 py-1 text-xs font-bold text-[#FFFFFF]">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-4 text-lg font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-linear-to-br from-[#E7000B] via-[#c9000a] to-[#8c0606] py-14 sm:py-16">
          <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-[#FFFFFF]/20 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-2xl font-black uppercase leading-tight text-[#FFFFFF] sm:text-3xl md:text-4xl">
                  Order from anywhere
                </h2>
                <p className="mt-4 text-base font-medium text-[#FFFFFF]/90 sm:text-lg">
                  Download the Matha Chickens app when it launches. Track
                  offers, reorder favourites, and connect with your nearest
                  store.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="min-h-[52px] w-full max-w-full justify-start gap-3 rounded-xl border border-[#FFFFFF]/15 bg-[#FFFFFF] px-4 py-2.5 text-[#E7000B] shadow-lg hover:bg-[#FFFFFF]/95 sm:w-auto"
                    asChild
                  >
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      aria-label="Download on the App Store — coming soon"
                    >
                      <img
                        src={appleStoreIcon}
                        alt=""
                        className="size-9 shrink-0 object-contain"
                        aria-hidden
                      />
                      <span className="min-w-0 text-left leading-tight">
                        <span className="block text-[10px] font-medium text-[#E7000B]/85">
                          Download on the
                        </span>
                        <span className="block text-lg font-semibold tracking-tight">
                          App Store
                        </span>
                      </span>
                    </a>
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="min-h-[52px] w-full max-w-full justify-start gap-3 rounded-xl border border-[#FFFFFF]/15 bg-[#FFFFFF] px-4 py-2.5 text-[#E7000B] shadow-lg hover:bg-[#FFFFFF]/95 sm:w-auto"
                    asChild
                  >
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      aria-label="Get it on Google Play — coming soon"
                    >
                      <img
                        src={playStoreIcon}
                        alt=""
                        className="size-9 shrink-0 object-contain"
                        aria-hidden
                      />
                      <span className="min-w-0 text-left leading-tight">
                        <span className="block text-[10px] font-medium uppercase text-[#E7000B]/85">
                          Get it on
                        </span>
                        <span className="block text-lg font-semibold tracking-tight">
                          Google Play
                        </span>
                      </span>
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative my-14 bg-background sm:my-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true }}
              className="mx-auto flex max-w-[560px] flex-col items-center justify-center"
            >
              <div className="flex justify-center">
                <div className="rounded-lg border border-[#E7000B]/25 bg-[#fff4f4] px-4 py-1 text-xs font-semibold uppercase tracking-wide text-[#E7000B]">
                  Testimonials
                </div>
              </div>
              <h2 className="mt-5 text-center text-2xl font-black tracking-tight sm:text-3xl md:text-4xl">
                What our customers say
              </h2>
              <p className="mt-4 text-center text-sm text-muted-foreground sm:text-base">
                Real feedback from families, home cooks, and store partners who
                order with Matha Chickens.
              </p>
            </motion.div>

            <div className="mt-10 flex max-h-[740px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
              <TestimonialsColumn testimonials={FIRST_COLUMN} duration={15} />
              <TestimonialsColumn
                testimonials={SECOND_COLUMN}
                className="hidden md:block"
                duration={19}
              />
              <TestimonialsColumn
                testimonials={THIRD_COLUMN}
                className="hidden lg:block"
                duration={17}
              />
            </div>
          </div>
        </section>

        <section
          id="find-us"
          className="bg-linear-to-br from-[#fff5f2] via-[#fff7f5] to-[#fff2ec] py-12 sm:py-14"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="rounded-[2rem] border border-[#f1cfc2] bg-[#FFFFFF] p-3 shadow-[0_20px_45px_-30px_rgba(140,14,18,0.30)] sm:p-4">
              <div className="relative overflow-hidden rounded-[1.4rem] bg-linear-to-r from-[#E7000B] via-[#d10710] to-[#ea5a1f] px-5 py-7 text-[#FFFFFF] sm:px-8 sm:py-9 lg:flex lg:items-center lg:justify-between lg:gap-8">
                <div className="pointer-events-none absolute -left-10 top-8 size-24 rounded-full bg-[#FFFFFF]/18 blur-2xl" />
                <div className="pointer-events-none absolute -right-10 bottom-0 size-28 rounded-full bg-[#FFFFFF]/16 blur-2xl" />

                <div className="relative">
                  <span className="inline-flex rounded-full bg-[#FFFFFF]/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#c6111b]">
                    Store locator
                  </span>
                  <h2 className="mt-4 text-2xl font-black leading-tight sm:text-3xl">
                    Find a Matha partner store near you
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm text-[#fff2ed] sm:text-base">
                    We work with trusted local partners across the region. Reach
                    out and we will direct you to the nearest available outlet.
                  </p>
                </div>

                <div className="relative mt-6 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:flex-col xl:flex-row">
                  <Button
                    asChild
                    className="bg-[#FFFFFF] text-[#d10c18] hover:bg-[#fff4ee]"
                  >
                    <a href="#contact">
                      Get directions
                      <ArrowRight className="size-4" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="border-[#FFFFFF]/80 bg-transparent text-[#FFFFFF] hover:bg-[#FFFFFF]/14"
                  >
                    <a href="tel:+919876543210">
                      <MapPin className="size-4" />
                      Call nearest outlet
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-zinc-950 py-12 text-zinc-300 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:grid-cols-3 sm:px-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#FFFFFF]">
                About
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Button
                    variant="link"
                    asChild
                    className="h-auto p-0 text-sm text-zinc-300 hover:text-[#FFFFFF] hover:no-underline"
                  >
                    <a href="#contact">Contact us</a>
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    asChild
                    className="h-auto p-0 text-sm text-zinc-300 hover:text-[#FFFFFF] hover:no-underline"
                  >
                    <a href="#why-us">Our quality promise</a>
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    asChild
                    className="h-auto p-0 text-sm text-zinc-300 hover:text-[#FFFFFF] hover:no-underline"
                  >
                    <a href="#">Privacy</a>
                  </Button>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#FFFFFF]">
                Site map
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Button
                    variant="link"
                    asChild
                    className="h-auto p-0 text-sm text-zinc-300 hover:text-[#FFFFFF] hover:no-underline"
                  >
                    <a href="#menu">Menu</a>
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    asChild
                    className="h-auto p-0 text-sm text-zinc-300 hover:text-[#FFFFFF] hover:no-underline"
                  >
                    <a href="#how-it-works">How it works</a>
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    asChild
                    className="h-auto p-0 text-sm text-zinc-300 hover:text-[#FFFFFF] hover:no-underline"
                  >
                    <Link to="/portal">Staff portal</Link>
                  </Button>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#FFFFFF]">
                Quality
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Button
                    variant="link"
                    asChild
                    className="h-auto p-0 text-sm text-zinc-300 hover:text-[#FFFFFF] hover:no-underline"
                  >
                    <a href="#why-us">Sourcing &amp; hygiene</a>
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    asChild
                    className="h-auto p-0 text-sm text-zinc-300 hover:text-[#FFFFFF] hover:no-underline"
                  >
                    <a href="#find-us">Partner stores</a>
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    asChild
                    className="h-auto p-0 text-sm text-zinc-300 hover:text-[#FFFFFF] hover:no-underline"
                  >
                    <a href="#">FAQs</a>
                  </Button>
                </li>
              </ul>
            </div>
          </div>
          <div className="mx-auto mt-12 max-w-7xl border-t border-zinc-800 px-4 pt-8 text-center text-xs text-zinc-500 sm:px-6">
            © {new Date().getFullYear()} Matha Chickens. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
}
