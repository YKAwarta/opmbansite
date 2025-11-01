'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75 border-b border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex">
              <div className="w-10 h-10 bg-[#093968] rounded-l-lg flex items-center justify-center">
                <span className="text-white font-bold">OPM</span>
              </div>
              <div className="w-10 h-10 bg-[#0abd62] rounded-r-lg flex items-center justify-center">
                <span className="text-white font-bold">BAN</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-brand-olive/90 hover:text-brand-azure transition">
              Home
            </Link>
            <Link href="/events" className="text-brand-olive/90 hover:text-brand-azure transition">
              Events
            </Link>
            <Link href="/support" className="text-brand-olive/90 hover:text-brand-azure transition">
              Support
            </Link>
            <Link href="/" className="text-brand-olive/90 hover:text-brand-azure transition">
              Team
            </Link>
            <Link href="/contact" className="text-brand-olive/90 hover:text-brand-azure transition">
              Contact
            </Link>
          </div>

          {/* Login Button */}
          <div className="hidden md:block">
            <Link href="/login">
              <Button className="bg-[#093968] hover:bg-[#093968]/90 text-white">
                Member Login
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link href="/" className="block text-[#0d0d0b] hover:text-[#093968]">
              Home
            </Link>
            <Link href="/events" className="block text-[#0d0d0b] hover:text-[#093968]">
              Events
            </Link>
            <Link href="/support" className="block text-[#0d0d0b] hover:text-[#093968]">
              Support
            </Link>
            <Link href="/team" className="block text-[#0d0d0b] hover:text-[#093968]">
              Team
            </Link>
            <Link href="/contact" className="block text-[#0d0d0b] hover:text-[#093968]">
              Contact
            </Link>
            <Link href="/login">
              <Button className="text-brand-olive/90 hover:text-brand-azure transition">
                Member Login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}