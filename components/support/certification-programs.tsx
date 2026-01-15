import { Card } from '@/components/ui/card'

const certifications = [
  {
    category: 'Operations & Project Management',
    color: 'border-brand-azure',
    barClass: 'bg-brand-azure',
    bgColor: 'bg-brand-azure/5',
    programs: [
      {
        name: 'CAPM® (Certified Associate in Project Management)',
        provider: 'PMI',
        description: 'Entry-level certification for aspiring project managers',
        prerequisites: 'High school diploma + 23 hours PM education',
        support: 'Workshops, study materials, exam prep'
      },
      {
        name: 'PMI-CPMAI™',
        provider: 'PMI',
        description: 'Certification for AI Project Management professionals',
        prerequisites: 'PM experience + AI knowledge',
        support: 'Workshops, study materials, exam prep'
      }
    ]
  },
  {
    category: 'Business Analytics',
    color: 'border-brand-green',
    barClass: 'bg-brand-green',
    bgColor: 'bg-brand-green/5',
    programs: [
      {
        name: 'Microsoft Excel Associate (MO-200)',
        provider: 'Microsoft',
        description: 'Demonstrate competency in Excel fundamentals',
        prerequisites: 'Basic computer skills',
        support: 'Practice files, mock exams, additional resources'
      },
      {
        name: 'Tableau Desktop Specialist',
        provider: 'Tableau',
        description: 'Foundational skills in Tableau Desktop',
        prerequisites: 'None',
        support: 'Software access, tutorials, projects'
      },
    ]
  },
  {
    category: 'Sustainability',
    color: 'border-brand-orange',
    barClass: 'bg-brand-orange',
    bgColor: 'bg-brand-orange/5',
    programs: [
      {
        name: 'Coming Soon',
        provider: 'TBD',
        description: 'TBD',
        prerequisites: 'TBD',
        support: 'TBD'
      }
    ]
  }
]

export function CertificationPrograms() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-[#093968] dark:text-white mb-12 text-center">
          Certification Programs We Support
        </h2>

        <div className="space-y-12">
          {certifications.map((category) => (
            <div key={category.category}>
              <h3 className="text-2xl font-semibold text-[#093968] dark:text-white mb-6 flex items-center">
                <div className={`w-1 h-8 ${category.barClass} mr-4`}></div>
                {category.category}
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.programs.map((program) => (
                  <Card key={program.name} className={`${category.color} border-2 ${category.bgColor}`}>
                    <div className="p-6">
                      <h4 className="text-lg font-bold text-[#093968] dark:text-white mb-2">
                        {program.name}
                      </h4>
                      <p className="text-sm text-[#0abd62] font-medium mb-3">
                        {program.provider}
                      </p>
                      <p className="text-[#0d0d0b]/70 dark:text-gray-300 text-sm mb-4">
                        {program.description}
                      </p>

                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-[#093968] dark:text-gray-200 mb-1">Prerequisites:</p>
                          <p className="text-xs text-[#0d0d0b]/60 dark:text-gray-400">{program.prerequisites}</p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-[#093968] dark:text-gray-200 mb-1">Club Support:</p>
                          <p className="text-xs text-[#0d0d0b]/60 dark:text-gray-400">{program.support}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}