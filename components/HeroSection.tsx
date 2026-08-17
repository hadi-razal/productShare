import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[100svh] overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/productshare.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-slate-950/70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(108,100,203,0.35),_transparent_55%)]" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-center px-3 pb-16 pt-28 sm:px-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
          Made in India · Now launching
        </p>
        <h1 className="mt-4 max-w-3xl text-[36px] font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[64px]">
          Showcase your products.
          <br />
          Share on WhatsApp.
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
          Create a catalog for your Indian shop in minutes. No website, no coding.
          We are just getting started.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex items-center justify-center bg-primary px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-white hover:bg-primary/90"
          >
            Start for free
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center justify-center border border-white/40 px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-white hover:border-white hover:bg-white/10"
          >
            See how it works
          </Link>
        </div>
      </div>
    </section>
  );
}
