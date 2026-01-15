import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { TeamSection } from '@/components/team/team-section'

export default function TeamPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <div className="bg-gradient-to-r from-brand-azure to-brand-green py-16">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white">The Team</h1>
            <p className="text-white/90 text-lg mt-4">
              Meet the dedicated presidents and officers leading The OPM & BAN Club.
            </p>
          </div>
        </div>
        <TeamSection />
      </main>
      <Footer />
    </>
  )
}