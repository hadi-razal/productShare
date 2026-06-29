import { FaPlay } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden px-6 py-10 sm:px-8 sm:py-14 lg:px-20">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/productshare.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm"></div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl flex-col justify-center gap-8 text-white">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 ring-1 ring-white/10">
            Build a storefront that sells on every device
          </span>

          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl md:text-[4.5rem] md:leading-[1.05]">
            Showcase your <span className="text-primary">Products</span>.
            <br className="hidden md:block" />
            Grow your business with ease.
          </h1>

          <p className="max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
            Create a beautiful online product catalog in minutes and share it with
            customers through a simple link — no website, coding, or technical skills required.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black shadow-lg shadow-black/20 transition duration-200 hover:-translate-y-0.5 hover:bg-gray-100 sm:h-14">
              Start Free Today
            </button>

            <button className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition duration-200 hover:-translate-y-0.5 hover:bg-primary/90 sm:h-14">
              <span>Watch Demo</span>
              <span className="relative flex h-5 w-5 items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
                <FaPlay className="relative h-3 w-3" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
