'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { Download, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface CredentialType {
  id: string
  name: string
  type: string
  image_url: string
  verification_code: string
  issued_date: string
}

export function CredentialCard({ credential, baseUrl }: { credential: CredentialType, baseUrl: string }) {
  const handleDownload = async () => {
    try {
      // Open in new tab first
      window.open(credential.image_url, '_blank')
      
      // Then trigger download
      const response = await fetch(credential.image_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${credential.name.replace(/\s+/g, '_')}_${credential.verification_code}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
      toast({
        title: 'Download Failed',
        description: 'Opening credential in new tab instead for manual download.',
      })
      // Fallback: open in new tab if download fails
      window.open(credential.image_url, '_blank')
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {credential.image_url && (
          <div className="md:w-48 h-32 md:h-auto bg-gray-100 dark:bg-gray-800">
            <img 
              src={credential.image_url} 
              alt={credential.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold">{credential.name}</h4>
              <p className="text-sm text-muted-foreground capitalize">
                {credential.type.replace('_', ' ')}
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              {credential.verification_code}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            Issued: {new Date(credential.issued_date).toLocaleDateString()}
          </p>
          
          <div className="flex gap-2">
            <Link href={`/verify/${credential.verification_code}`} target="_blank">
              <Button size="sm" variant="outline">
                <ExternalLink className="w-3 h-3 mr-1" />
                Verify
              </Button>
            </Link>
            <Button size="sm" variant="outline" onClick={handleDownload}>
              <Download className="w-3 h-3 mr-1" />
              Download
            </Button>
          </div>
          
          <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
            <p className="text-muted-foreground">Verification URL:</p>
            <p className="font-mono break-all">
              {baseUrl}/verify/{credential.verification_code}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}