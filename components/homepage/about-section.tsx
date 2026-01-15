import { Card } from '@/components/ui/card'
import { Eye, Target } from 'lucide-react'

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        {/* About */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-4xl font-bold text-[#093968] mb-6">About The Club</h2>
          <p className="text-lg text-[#0d0d0b]/80 leading-relaxed">
            The Operations and Project Management & Business Analytics (OPM & BAN) Club is based in Alfaisal University, and is dedicated to 
            preparing our students for success in all fields, positions, and responsibilities pertaining to project management and business analytics. We provide comprehensive 
            support and resources for popular professional certifications, hands-on learning experiences, networking opportunities, and a community of 
            like-minded individuals aspiring to become the architects of an intelligent and better-prepared future.
          </p>
        </div>

        {/* Vision and Mission Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Vision */}
          <Card className="p-8 border-2 hover:border-brand-green transition-all shadow-sm hover:shadow-md">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-[#0abd62]/10 rounded-lg">
                <Eye className="h-6 w-6 text-[#0abd62]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#093968] mb-4">Our Vision</h3>
                <p className="text-[#0d0d0b]/80 leading-relaxed">
                  To become the leading student hub for cultivating, empowering, and guiding excellence in OPM & BAN students that bridges theory and practice, supporting our students to build a better tomorrow.
                </p>
              </div>
            </div>
          </Card>

          {/* Mission */}
          <Card className="p-8 border-2 hover:border-brand-orange transition-all shadow-sm hover:shadow-md">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-[#f0ba1b]/10 rounded-lg">
                <Target className="h-6 w-6 text-[#f0ba1b]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#093968] mb-4">Our Mission</h3>
                <p className="text-[#0d0d0b]/80 leading-relaxed">
                  To foster collaboration, innovation, and career readiness through hands-on projects, industry certifications, networking events, and workshops that strengthen both operational and analytical capabilities.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}