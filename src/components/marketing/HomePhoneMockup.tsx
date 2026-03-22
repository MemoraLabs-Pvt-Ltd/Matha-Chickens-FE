import { cn } from "@/lib/utils";
import mathaAppPhoneScreen from "@/assets/matha-app-phone-screen.png";

const SIDE = "#484848";

export function HomePhoneMockup({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative mx-auto w-[min(220px,68vw)] sm:w-[min(244px,32vw)]",
        "transform-gpu transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-2 hover:rotate-[2deg] hover:scale-[1.015]",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0 motion-reduce:hover:scale-100",
        className,
      )}
    >
      <div
        className="absolute top-[26%] z-20 h-4 w-[3px] rounded-l-sm border border-black/10"
        style={{ left: -1, backgroundColor: SIDE }}
        aria-hidden
      />
      <div
        className="absolute top-[32%] z-20 h-8 w-[3px] rounded-l-sm border border-black/10"
        style={{ left: -1, backgroundColor: SIDE }}
        aria-hidden
      />
      <div
        className="absolute top-[40%] z-20 h-8 w-[3px] rounded-l-sm border border-black/10"
        style={{ left: -1, backgroundColor: SIDE }}
        aria-hidden
      />
      <div
        className="absolute top-[34%] z-20 h-8 w-[3px] rounded-r-sm border border-black/10"
        style={{ right: -1, backgroundColor: SIDE }}
        aria-hidden
      />

      <div
        className="relative rounded-[2.35rem] bg-black p-2 shadow-[0_0_28px_14px_rgba(0,0,0,0.12)] ring-1 ring-black/20"
        data-slot="home-phone-mockup"
      >
        <div
          className="pointer-events-none absolute inset-[6px] rounded-[2rem] border border-[#bcbcbc]/40 opacity-50 blur-[0.5px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-[3px] rounded-[2.15rem] border border-[#484848]/60 opacity-50 blur-[0.5px]"
          aria-hidden
        />

        <div className="relative aspect-[471/1018] w-full overflow-hidden rounded-[2rem] bg-[#FFFFFF]">
          <img
            src={mathaAppPhoneScreen}
            alt="Matha Chickens app — home, categories, and popular picks"
            width={471}
            height={1018}
            className="h-full w-full object-cover object-top"
            loading="lazy"
            decoding="async"
          />

          <div
            className="pointer-events-none absolute left-1/2 top-3 z-10 flex h-[22px] w-[4.5rem] -translate-x-1/2 items-center rounded-[48px] bg-black px-1.5 shadow-[inset_0_-1px_0_rgba(255,255,255,0.06)] ring-1 ring-white/10"
            aria-hidden
          >
            <div className="relative flex h-full w-full items-center justify-center">
              <div className="absolute left-1.5 flex gap-0.5">
                <span className="h-[3px] w-[3px] rounded-full border border-[#0a0a15] bg-[#1a1a2e]" />
                <span className="size-[3px] rounded-full border border-[#0a0a15] bg-[#1a1a2e]" />
              </div>
              <div className="flex h-2 gap-px opacity-60">
                {Array.from({ length: 8 }).map((_, i) => (
                  <span key={i} className="w-px rounded-full bg-[#0a0a15]" />
                ))}
              </div>
              <div className="absolute right-1.5 size-[7px] rounded-full border-2 border-[#0a0a15] bg-[#1a1a2e] shadow-[inset_0_0_4px_2px_rgba(0,100,200,0.45)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
