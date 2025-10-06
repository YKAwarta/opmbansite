'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
{
    question: 'What requirements do I need to meet to become a member?',
    answer: 'To join the club, you must be a student at Alfaisal University, and must be enrolled in a BAN or OPM program as either your Primary Major, Secondary Major, or Minor.'
  },
  {
    question: 'How do I join the OPM & BAN Club?',
    answer: 'Fill out the application form during our recruitment period. Once approved, you\'ll receive an invitation email to create your account and access your digital credentials.'
  },
  {
    question: 'What certifications does the club support?',
    answer: 'We support various certifications, including CAPM®, PMI-CPMAI™, Microsoft Excel Associate MO-200, & Tableau Desktop Foundations.'
  },
  {
    question: 'Are there separate activities for male and female members?',
    answer: 'Yes, we have separate sections and events for male and female members with dedicated officers and Discord servers, while maintaining collaborative activities and shared resources.'
  },
  {
    question: 'Can I join if I\'m not a business major?',
    answer: 'Those from non-COB majors who are enrolled in either an OPM or BAN minor are eligible to join the club.'
  },
  {
    question: 'How do I access my digital credentials?',
    answer: 'Once you\'re a member, log in to your account on our website to access your e-wallet containing your membership card, badges, and certificates.'
  },
  {
    question: 'What kind of events does the club organize?',
    answer: 'We organize workshops, certification prep sessions, guest speaker events, networking opportunities, and hands-on training sessions throughout the academic year.'
  },
  {
    question: 'How can I verify my credentials for LinkedIn?',
    answer: 'Each credential comes with a unique verification URL that you can add to your LinkedIn profile. Anyone can verify its authenticity by visiting the link.'
  }
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-[#093968] mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <span className="font-medium text-[#093968]">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-[#0abd62] transition-transform ${
                      openIndex === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                
                {openIndex === index && (
                  <div className="px-6 pb-4">
                    <p className="text-[#0d0d0b]/70">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}