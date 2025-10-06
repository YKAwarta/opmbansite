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
        <div className="bg-gradient-to-r from-[#093968] to-[#0abd62] py-16">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white">Contact Us</h1>
            <p className="text-white/90 text-lg mt-4">
              Get in touch with the OPM & BAN Club team.
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