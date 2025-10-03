import Image from 'next/image'

type Cert = {
  name: string
  title: string
  logo: string
  brandFrom: string
  brandTo: string
  alt?: string
}

const certifications: Cert[] = [
  {
    name: 'CAPM®',
    title: 'Certified Associate in Project Management',
    logo: '/cert-logos/capm.png',
    brandFrom: '#0076A8',
    brandTo:   '#00A1E0',
    alt: 'PMI CAPM badge',
  },
  {
    name: 'PMI-CPMAI',
    title: 'PMI Certified Professional in Managing AI',
    logo: '/cert-logos/pmi-cpmai.png',
    brandFrom: '#F27321',
    brandTo:   '#D9368B',
    alt: 'PMI CPMAI badge',
  },
  {
    name: 'Excel MO-200',
    title: 'Microsoft Office Specialist: Excel Associate',
    logo: '/cert-logos/excel.png',
    brandFrom: '#217346',
    brandTo:   '#0E5A2A',
    alt: 'Microsoft Excel Associate badge',
  },
  {
    name: 'Tableau',
    title: 'Tableau Desktop Foundations',
    logo: '/cert-logos/tableau.png',
    brandFrom: '#E8762D',
    brandTo:   '#1F77B4',
    alt: 'Tableau Desktop badge',
  },
  {
    name: 'More',
    title: 'And More Coming Soon!',
    logo: '/cert-logos/more.png',
    brandFrom: '#093968',
    brandTo:   '#0abd62',
    alt: 'More certifications',
  },
]

export function CertificationsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <div className="h-1 w-12 bg-[#0abd62]" />
            <h3 className="text-sm font-semibold text-[#0abd62] uppercase tracking-wider">
              Professional Excellence
            </h3>
            <div className="h-1 w-12 bg-[#0abd62]" />
          </div>
          <h2 className="text-4xl font-bold text-[#093968]">Club Faculty Certified In</h2>
        </div>

        {/* centered grid */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {certifications.map((cert) => (
            <div key={cert.name} className="w-full max-w-[440px]">
              <div
                className="relative rounded-2xl p-8 h-64 flex flex-col items-center justify-center transition-transform duration-300 hover:scale-[1.02]"
                style={{ backgroundImage: `linear-gradient(135deg, ${cert.brandFrom}, ${cert.brandTo})` }}
              >
                <div className="relative w-40 h-40 md:w-44 md:h-44">
                  <Image
                    src={cert.logo}
                    alt={cert.alt ?? cert.name}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

                <p className="mt-4 text-white text-lg font-semibold">{cert.name}</p>

                <div className="absolute bottom-0 left-0 right-0 bg-[#093968] text-white p-4 rounded-b-2xl">
                  <p className="text-center text-sm font-medium">{cert.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-[#0d0d0b]/70">
            Our presidents and officers hold industry-recognized certifications,
            ensuring you receive guidance from certified professionals.
          </p>
        </div>
      </div>
    </section>
  )
}
