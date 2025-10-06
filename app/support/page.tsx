import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { CertificationPrograms } from '@/components/support/certification-programs'
import { StudyResources } from '@/components/support/study-resources'

export default function SupportPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {/* Header: radial spotlight from left + soft orange glow */}
        <div className="relative overflow-hidden py-16">
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_15%_30%,_#0abd62_0%,_#093968_55%,_#082a4d_100%)]" />
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(700px_220px_at_85%_110%,_#f0ba1b,_transparent_60%)]" />
          <div className="relative container mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white">Academic &amp; Professional Support</h1>
            <p className="text-white/90 text-lg mt-4">
              Resources and guidance for your certification journey.
            </p>
          </div>
        </div>

        <CertificationPrograms />
        <StudyResources />
      </main>
      <Footer />
    </>
  )
}
