// components/events/events-section.tsx
import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'

type EventItem = {
  id: number
  title: string
  date: string | null
  time: string
  location: string
  type: string
  description: string
  capacity: string
  status: 'upcoming' | 'past'
}

const events: EventItem[] = [
  {
    id: 1,
    title: 'OPM & BAN “Friends Feud” Competition',
    date: null,
    time: 'TBD',
    location: 'TBD',
    type: 'Competition',
    description: 'Team-based quiz-show with OPM questions and BAN case-solving.',
    capacity: 'TBD',
    status: 'upcoming',
  },
  {
    id: 2,
    title: 'LEGO Project Life Cycle Demonstration',
    date: null,
    time: 'TBD',
    location: 'TBD',
    type: 'Workshop',
    description: 'Hands-on LEGO activity to experience each phase of the project life cycle.',
    capacity: 'TBD',
    status: 'upcoming',
  },
  {
    id: 3,
    title: 'PRINCE2 VR Simulation Workshop',
    date: null,
    time: 'TBD',
    location: 'TBD',
    type: 'Workshop',
    description: 'Immersive VR simulations showcasing modern project management practice.',
    capacity: 'TBD',
    status: 'upcoming',
  },
]

export function EventsSection() {
  const upcomingEvents = events.filter(e => e.status === 'upcoming')
  const pastEvents = events.filter(e => e.status === 'past')

  const formatDate = (date: string | null) =>
    date
      ? new Date(date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'TBD'

  return (
    <div className="container mx-auto px-6 py-16">
      {/* Upcoming Events */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-[#093968] mb-8">Upcoming Events</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map(event => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="inline-block px-3 py-1 bg-[#0abd62]/10 text-[#0abd62] text-sm font-semibold rounded-full mb-4">
                  {event.type}
                </div>
                <h3 className="text-xl font-bold text-[#093968] mb-3">{event.title}</h3>
                <p className="text-[#0d0d0b]/70 mb-4">{event.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-[#0d0d0b]/60">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center text-[#0d0d0b]/60">
                    <Clock className="w-4 h-4 mr-2" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-[#0d0d0b]/60">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-[#0d0d0b]/60">
                    <Users className="w-4 h-4 mr-2" />
                    Capacity: {event.capacity}
                  </div>
                </div>

                {/* Register button removed */}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Past Events */}
      <div>
        <h2 className="text-3xl font-bold text-[#093968] mb-8">Past Events</h2>
        {pastEvents.length === 0 ? (
          <div className="text-center text-[#0d0d0b]/50 text-lg">N/A</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map(event => (
              <Card key={event.id} className="opacity-75">
                <div className="p-6">
                  <div className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm font-semibold rounded-full mb-4">
                    {event.type}
                  </div>
                  <h3 className="text-xl font-bold text-[#093968]/70 mb-3">{event.title}</h3>
                  <p className="text-[#0d0d0b]/60 mb-4">{event.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-[#0d0d0b]/50">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center text-[#0d0d0b]/50">
                      <Users className="w-4 h-4 mr-2" />
                      {event.capacity}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
