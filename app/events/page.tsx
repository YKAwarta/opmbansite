import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { EventsSection } from '@/components/events/events-section'
import { PagePlaceholder } from '@/components/shared/page-placeholder'

export default function EventsPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {/* Header: stage-lights look (distinct from Team's linear gradient) */}
        <div className="relative overflow-hidden py-16">
          {/* base: deep azure */}
          <div className="absolute inset-0 bg-[#093968]" />
          {/* main green spotlight, mid-right */}
          <div className="absolute inset-0 opacity-90 bg-[radial-gradient(1000px_480px_at_72%_55%,_#0abd62_0%,_transparent_65%)]" />
          {/* supporting green glow from top-left */}
          <div className="absolute inset-0 opacity-55 bg-[radial-gradient(680px_260px_at_12%_-15%,_#0abd62_20%,_transparent_70%)]" />
          {/* very soft orange accent at top-right */}
          <div className="absolute inset-0 pointer-events-none opacity-15 bg-[radial-gradient(820px_240px_at_96%_6%,_#f0ba1b,_transparent_60%)]" />
          {/* subtle edge vignette for depth */}
          <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(1400px_500px_at_0%_100%,_rgba(0,0,0,0.35),_transparent_60%)]" />

          <div className="relative container mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white">Club Events</h1>
            <p className="text-white/90 text-lg mt-4">
              Workshops, seminars, and competitions.
            </p>
          </div>
        </div>

        <PagePlaceholder pageName="Events" />
      </main>
      <Footer />
    </>
  )
}
