'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import QRCode from 'qrcode'
import { useEffect } from 'react'

export function DiscordSection() {
  const [maleQROpen, setMaleQROpen] = useState(false)
  const [femaleQROpen, setFemaleQROpen] = useState(false)
  const [maleQR, setMaleQR] = useState('')
  const [femaleQR, setFemaleQR] = useState('')

  useEffect(() => {
    // Generate QR codes
    QRCode.toDataURL('https://discord.gg/your-male-server-invite', {
      width: 300,
      margin: 2,
      color: {
        dark: '#4169e1',
        light: '#FFFFFF'
      }
    }).then(setMaleQR)

    QRCode.toDataURL('https://discord.gg/your-female-server-invite', {
      width: 300,
      margin: 2,
      color: {
        dark: '#ff007f',
        light: '#FFFFFF'
      }
    }).then(setFemaleQR)
  }, [])

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-brand-azure mb-4">Join Our Discord Community!</h2>
          <p className="text-brand-olive/70 mb-12">
            Connect with fellow members, get real-time support, and stay updated on club activities
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Male Discord */}
            <Card className="p-8 border-2 border-brand-blue hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-brand-blue mb-4">Male Section Discord</h3>
              <p className="text-brand-olive/60 mb-6">
                Join discussions, study groups, and educational opportunities
              </p>
              <Button 
                onClick={() => setMaleQROpen(true)}
                className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white"
              >
                Show QR Code
              </Button>
            </Card>

            {/* Female Discord */}
            <Card className="p-8 border-2 border-brand-pink hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-brand-pink mb-4">Female Section Discord</h3>
              <p className="text-brand-olive/60 mb-6">
                Connect with peers, share resources, and collaborate
              </p>
              <Button 
                onClick={() => setFemaleQROpen(true)}
                className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white"
              >
                Show QR Code
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Male QR Dialog */}
      <Dialog open={maleQROpen} onOpenChange={setMaleQROpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-brand-blue">Male Section Discord</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-4">
            {maleQR && <img src={maleQR} alt="Male Discord QR" />}
          </div>
          <p className="text-center text-sm text-brand-blue/60">
            Scan this QR code to join the male section Discord server. Once you are verified, you will gain access to all channels.
          </p>
        </DialogContent>
      </Dialog>

      {/* Female QR Dialog */}
      <Dialog open={femaleQROpen} onOpenChange={setFemaleQROpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-brand-pink">Female Section Discord</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-4">
            {femaleQR && <img src={femaleQR} alt="Female Discord QR" />}
          </div>
          <p className="text-center text-sm text-brand-pink/60">
            Scan this QR code to join the female section Discord server. Once you are verified, you will gain access to all channels.
          </p>
        </DialogContent>
      </Dialog>
    </section>
  )
}