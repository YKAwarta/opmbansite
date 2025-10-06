import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { CertificationPrograms } from '@/components/support/certification-programs'
import { StudyResources } from '@/components/support/study-resources'

export default function SupportPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <div className="bg-gradient-to-r from-[#093968] to-[#0abd62] py-16">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white">Academic & Professional Support</h1>
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