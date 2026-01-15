'use client'

import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User } from 'lucide-react'

type Officer = {
  name: string
  position: string
  email?: string
  showEmail?: boolean
}

const maleOfficers: Officer[] = [
  { name: 'Yousef Awartani', position: 'President', email: 'yawartani@alfaisal.edu', showEmail: true},
  { name: 'Abdallah Abu Al Fors', position: 'Financial Officer' },
  { name: 'Abdulrahman Temsah', position: 'Operations Officer' },
  { name: 'Faisal Elmaghout', position: 'Media Officer' },
  { name: 'Abdullah Almutairi', position: 'Strategic Relations Officer' },
]

const femaleOfficers: Officer[] = [
  { name: 'Rema Bin Nakia', position: 'President', email: 'rnakia@alfaisal.edu', showEmail: true},
  { name: 'Dania Alkhani', position: 'Financial Officer' },
  { name: 'Zina Dabbagh', position: 'Operations Officer' },
  { name: 'Deemah Al Hassan', position: 'Media Officer' },
  { name: 'Modhi Al Saud', position: 'Strategic Relations Officer' },
]

// helper to split presidents vs others (case-insensitive)
const splitByPresident = (list: Officer[]) => {
  const presidents = list.filter(o => /president/i.test(o.position))
  const others = list.filter(o => !/president/i.test(o.position))
  return { presidents, others }
}

function OfficerCard({
  officer,
  color,               
  hoverBorderClass,    
}: {
  officer: Officer
  color: string
  hoverBorderClass: string
}) {
  return (
    <Card className={`p-6 md:p-8 transition border-2 hover:shadow-lg ${hoverBorderClass} w-full max-w-md`}>
      <div className="text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
             style={{ backgroundColor: `${color}1A` }}>
          <User className="w-10 h-10" style={{ color }} />
        </div>

        <h3 className="text-lg font-bold text-brand-azure dark:text-white mb-1">{officer.name}</h3>
        <p className="text-brand-green font-medium mb-3">{officer.position}</p>

        {officer.showEmail && officer.email && (
          <p className="text-sm text-brand-olive/60 dark:text-gray-400 break-all">
            <a href={`mailto:${officer.email}`} className="hover:text-brand-azure dark:hover:text-[#0abd62] transition">
              {officer.email}
            </a>
          </p>
        )}
      </div>
    </Card>
  )
}

export function TeamSection() {
  const male = splitByPresident(maleOfficers)
  const female = splitByPresident(femaleOfficers)

  return (
    <div className="container mx-auto px-6 py-16 text-gray-900 dark:text-gray-100">
      <h2 className="text-3xl font-bold text-brand-azure dark:text-white mb-8 text-center">Club Officers</h2>

      <Tabs defaultValue="female" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger
            value="female"
            className="data-[state=active]:bg-brand-pink data-[state=active]:text-white"
          >
            Female Staff
          </TabsTrigger>
          <TabsTrigger
            value="male"
            className="data-[state=active]:bg-brand-blue data-[state=active]:text-white"
          >
            Male Staff
          </TabsTrigger>
        </TabsList>

        {/* MALE */}
        <TabsContent value="male" className="space-y-10">
          <div className="grid grid-cols-1 place-items-center">
            {male.presidents.map((o) => (
              <OfficerCard
                key={o.name}
                officer={o}
                color="#4169e1"
                hoverBorderClass="hover:border-[#4169e1]"
              />
            ))}
          </div>

          <div className="grid gap-6 justify-items-center grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
            {male.others.map((o) => (
              <OfficerCard
                key={o.name}
                officer={o}
                color="#4169e1"
                hoverBorderClass="hover:border-[#4169e1]"
              />
            ))}
          </div>
        </TabsContent>

        {/* FEMALE */}
        <TabsContent value="female" className="space-y-10">
          <div className="grid grid-cols-1 place-items-center">
            {female.presidents.map((o) => (
              <OfficerCard
                key={o.name}
                officer={o}
                color="#ff007f"
                hoverBorderClass="hover:border-[#ff007f]"
              />
            ))}
          </div>

          <div className="grid gap-6 justify-items-center grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
            {female.others.map((o) => (
              <OfficerCard
                key={o.name}
                officer={o}
                color="#ff007f"
                hoverBorderClass="hover:border-[#ff007f]"
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
