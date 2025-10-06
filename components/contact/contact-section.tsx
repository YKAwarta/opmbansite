import { Card } from '@/components/ui/card'
import { Mail, MessageSquare, Clock } from 'lucide-react'

export function ContactSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-azure mb-12 text-center">
            Reach Out to Us
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Male President */}
            <Card className="p-8 border-2 border-brand-blue">
              <div className="text-center">
                <h3 className="text-xl font-bold text-brand-blue mb-4">Male President</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-center text-brand-olive/70">
                    <Mail className="w-5 h-5 mr-2" />
                    <a href="mailto:yawartani@alfaisal.edu" className="hover:text-brand-blue">
                      yawartani@alfaisal.edu
                    </a>
                  </div>
                  <p className="text-sm text-brand-olive/60">
                    For inquiries about male section activities and membership
                  </p>
                </div>
              </div>
            </Card>

            {/* Female President */}
            <Card className="p-8 border-2 border-brand-pink">
              <div className="text-center">
                <h3 className="text-xl font-bold text-brand-pink mb-4">Female President</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-center text-brand-olive/70">
                    <Mail className="w-5 h-5 mr-2" />
                    <a href="mailto:rnakia@alfaisal.edu" className="hover:text-brand-pink">
                      rnakia@alfaisal.edu
                    </a>
                  </div>
                  <p className="text-sm text-brand-olive/60">
                    For inquiries about female section activities and membership
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* General Info */}
          <Card className="p-8 bg-gray-50">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <MessageSquare className="w-8 h-8 text-brand-azure mx-auto mb-3" />
                <h4 className="font-semibold text-brand-azure mb-2">General Inquiries</h4>
                <a href="mailto:opmban.club@alfaisal.edu" className="text-sm text-brand-olive/60">
                    opmban.club@alfaisal.edu
                </a>
              </div>
              <div>
                <Clock className="w-8 h-8 text-brand-green mx-auto mb-3" />
                <h4 className="font-semibold text-brand-azure mb-2">Office Hours</h4>
                <p className="text-sm text-brand-olive/60">
                  Sunday - Thursday<br />2:00 PM - 5:00 PM
                </p>
              </div>
              <div>
                <Mail className="w-8 h-8 text-brand-orange mx-auto mb-3" />
                <h4 className="font-semibold text-brand-azure mb-2">Response Time</h4>
                <p className="text-sm text-brand-olive/60">
                  Within 24-48 hours
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}