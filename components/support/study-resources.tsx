import { Card } from '@/components/ui/card'
import { Download, Users, Calendar } from 'lucide-react'

export function StudyResources() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-[#093968] mb-12 text-center">
          Study Resources & Support
        </h2>

        {/* centered grid */}
        <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl justify-items-center">
          <Card className="w-full max-w-sm p-6 text-center hover:shadow-lg transition">
            <div className="w-12 h-12 bg-[#093968]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Download className="h-6 w-6 text-[#093968]" />
            </div>
            <h3 className="font-semibold text-[#093968] mb-2">Study Materials</h3>
            <p className="text-sm text-[#0d0d0b]/60">
              Access practice exams, study guides, and reference materials
            </p>
          </Card>

          <Card className="w-full max-w-sm p-6 text-center hover:shadow-lg transition">
            <div className="w-12 h-12 bg-[#f0ba1b]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-[#f0ba1b]" />
            </div>
            <h3 className="font-semibold text-[#093968] mb-2">Study Groups</h3>
            <p className="text-sm text-[#0d0d0b]/60">
              Join peers preparing for the same certifications
            </p>
          </Card>

          <Card className="w-full max-w-sm p-6 text-center hover:shadow-lg transition">
            <div className="w-12 h-12 bg-[#093968]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-[#093968]" />
            </div>
            <h3 className="font-semibold text-[#093968] mb-2">Workshop Sessions</h3>
            <p className="text-sm text-[#0d0d0b]/60">
              Workshops and testimonies from certified members throughout the year
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}
