import Image from 'next/image'

type Cert = {
  name: string
  title: string
  logo: string
  alt?: string
}

const certifications: Cert[] = [
  {
    name: 'CAPM®',
    title: 'Certified Associate in Project Management',
    logo: '/cert-logos/capm.png',
    alt: 'PMI CAPM badge',
  },
  {
    name: 'PMI-CPMAI™',
    title: 'PMI Certified Professional in Managing AI',
    logo: '/cert-logos/pmi-cpmai.png',
    alt: 'PMI CPMAI badge',
  },
  {
    name: 'Excel MO-200',
    title: 'Microsoft Office Specialist: Excel Associate',
    logo: '/cert-logos/excel.png',
    alt: 'Microsoft Excel Associate badge',
  },
  {
    name: 'Tableau',
    title: 'Tableau Desktop Foundations',
    logo: '/cert-logos/tableau.png',
    alt: 'Tableau Desktop badge',
  },
  {
    name: 'More',
    title: 'And More Coming Soon!',
    logo: '/cert-logos/more.png',
    alt: 'More certifications',
  },
]

export function CertificationsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <div className="h-1 w-12 bg-brand-olive" />
            <h3 className="text-sm font-semibold text-brand-olive uppercase tracking-wider">
              Professional Excellence
            </h3>
            <div className="h-1 w-12 bg-brand-olive" />
          </div>
          <h2 className="text-4xl font-bold text-brand-azure">Club Faculty Certified In</h2>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center">
          {certifications.map((cert, i) => (
            <div key={cert.name} className="flex w-full max-w-[360px] flex-col items-center text-center">
              {/* Badge */}
              <div className="relative w-[240px] sm:w-[280px] md:w-[320px] lg:w-[340px] aspect-square">
                <Image
                  src={cert.logo}
                  alt={cert.alt ?? cert.name}
                  fill
                  className="object-contain"
                  sizes="(min-width:1024px) 340px, (min-width:768px) 320px, (min-width:640px) 280px, 240px"
                  priority={i < 3}
                />
              </div>

              {/* Title bar (optional, looks like the screenshot). 
                  If you want *no* bar at all, replace this div with:
                  <p className="mt-4 text-brand-olive/80 font-medium">{cert.title}</p>
              */}
              <div className="mt-6 w-full rounded-xl bg-brand-azure px-5 py-4">
                <p className="text-brand-white text-sm font-medium leading-snug">{cert.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-brand-olive/70">
            Our presidents hold industry-recognized certifications, ensuring you receive guidance from certified professionals.
          </p>
        </div>
      </div>
    </section>
  )
}
