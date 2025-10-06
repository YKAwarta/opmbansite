import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { EventsSection } from '@/components/events/events-section'

export default function EventsPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <div className="bg-gradient-to-r from-[#093968] to-[#0abd62] py-16">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white">Club Events</h1>
            <p className="text-white/90 text-lg mt-4">
              Workshops, seminars, and networking opportunities
            </p>
          </div>
        </div>
        <EventsSection />
      </main>
      <Footer />
    </>
  )
}