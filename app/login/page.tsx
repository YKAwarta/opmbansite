import { LoginForm } from '@/components/auth/login-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#093968] via-[#093968]/80 to-[#0abd62]/20">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="absolute top-6 left-6">
        <Link href="/">
          <Button variant="outline" size="icon" className="bg-white/10 border-white/20 hover:bg-white/20">
            <ArrowLeft className="w-4 h-4 text-white" />
          </Button>
        </Link>
      </div>
      <div className="relative">
        <LoginForm />
      </div>
    </div>
  )
}