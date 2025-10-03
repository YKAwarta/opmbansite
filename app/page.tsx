import { HeroSection } from '@/components/homepage/hero-section'
import { AboutSection } from '@/components/homepage/about-section'
import { CertificationsSection } from '@/components/homepage/certifications-section'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <CertificationsSection />
      </main>
      <Footer />
    </>
  )
}