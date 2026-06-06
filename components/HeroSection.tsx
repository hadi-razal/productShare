import { FaPlay } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden px-[110px] pt-[65px]">
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

      {/* Optional Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="w-2/3 relative z-10 flex flex-col h-full items-start justify-center text-white">
        <h1 className="text-[60px] font-semibold leading-none">
          Showcase Your <span className="">Products</span>.  <br /> Grow Your Business.
        </h1>
        <p>
          Create a beautiful online product catalog in minutes. Share your
          products with <br /> customers through a simple link — no website,
          coding, or technical skills required.
        </p>

        <div className="mt-10 flex gap-4 font-medium">
        <button className="p-5 bg-white text-black rounded-[50px]"> 
        Start Free Today
        </button>
        <button className="p-5 bg-primary text-white rounded-[50px] flex justify-center items-center gap-2">
          Watch Demo
          <span className="relative flex h-4 w-4 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-white/40 animate-play-ring" />
            <FaPlay className="relative h-3 w-3 animate-play-pulse" />
          </span>
        </button>
        </div>
      </div>

      <div>
       
      </div>
    </section>
  );
}
