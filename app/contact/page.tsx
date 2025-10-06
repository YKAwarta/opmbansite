import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { ContactSection } from '@/components/contact/contact-section'
import { FAQSection } from '@/components/contact/faq-section'
import { DiscordSection } from '@/components/contact/discord-section'

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {/* Header: precise club-color diagonal + soft texture */}
        <div className="relative overflow-hidden py-16">
          {/* strict brand blend (azure → vivid green → azure) */}
          <div className="absolute inset-0 bg-[linear-gradient(135deg,_#093968_0%,_#0abd62_55%,_#093968_100%)]" />
          {/* subtle diagonal stripes for texture (kept very light) */}
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(135deg,_rgba(255,255,255,0.22)_10%,_transparent_10%_20%,_rgba(255,255,255,0.22)_20%_30%,_transparent_30%)] bg-[length:24px_24px]" />
          {/* gentle green glow from top-left for depth */}
          <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(700px_260px_at_18%_-8%,_#0abd62,_transparent_60%)]" />
          <div className="relative container mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white">Contact Us</h1>
            <p className="text-white/90 text-lg mt-4">
              Get in touch with the OPM &amp; BAN Club team.
            </p>
          </div>
        </div>

        <ContactSection />
        <DiscordSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  )
}
