import Image from 'next/image'

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-[#093968] via-[#093968]/90 to-[#0abd62]/30 text-white">
      <div className="container mx-auto px-6 py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-7 max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              The OPM & BAN Club, Alfaisal University
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Empowering Alfaisal students with professional certifications and project management excellence
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#about"
                className="inline-block bg-[#0abd62] hover:bg-[#0abd62]/90 text-white font-semibold px-8 py-3 rounded-lg transition"
              >
                Learn More
              </a>
              <a
                href="/contact"
                className="inline-block bg-white/10 backdrop-blur-sm border-2 border-white hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-lg transition"
              >
                Join Our Club
              </a>
            </div>
          </div>

          {/* Right: logo card */}
          <div className="lg:col-span-5 hidden sm:flex justify-center lg:justify-end">
              <Image
                src="/club_logo.png"
                alt="OPM & BAN Club Logo"
                width={500}
                height={500}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

      {/* Decorative wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg className="relative block w-full h-16" preserveAspectRatio="none" viewBox="0 0 1200 120">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}
