// NO 'use server' directive - this is just a server-side utility
import sharp from 'sharp'

interface TextOverlay {
  text: string
  top: number
  left: number
  fontSize: number
  color: string
}

export async function generateCredential(
  templateUrl: string,
  type: 'certificate' | 'membership_card',
  data: {
    name: string
    studentId: string
    issueDate: string
  }
): Promise<Buffer> {
  // Fetch template image
  const response = await fetch(templateUrl)
  const templateBuffer = Buffer.from(await response.arrayBuffer())

  // Get template dimensions
  const metadata = await sharp(templateBuffer).metadata()
  const width = metadata.width || 1000
  const height = metadata.height || 700

  // Define text positions based on credential type
  const textConfig = type === 'certificate' ? {
    name: { top: Math.floor(height * 0.45), fontSize: 60 },
    studentId: { top: Math.floor(height * 0.55), fontSize: 30 },
    date: { top: Math.floor(height * 0.65), fontSize: 25 }
  } : {
    // Membership card positions
    name: { top: Math.floor(height * 0.40), fontSize: 40 },
    studentId: { top: Math.floor(height * 0.55), fontSize: 25 },
    date: { top: Math.floor(height * 0.70), fontSize: 20 }
  }

  // Create SVG overlay with text
  const svgOverlay = `
    <svg width="${width}" height="${height}">
      <style>
        .title { fill: #093968; font-family: Arial, sans-serif; font-weight: bold; }
        .subtitle { fill: #666666; font-family: Arial, sans-serif; }
      </style>
      <text x="50%" y="${textConfig.name.top}" font-size="${textConfig.name.fontSize}" text-anchor="middle" class="title">
        ${data.name}
      </text>
      <text x="50%" y="${textConfig.studentId.top}" font-size="${textConfig.studentId.fontSize}" text-anchor="middle" class="subtitle">
        ID: ${data.studentId}
      </text>
      <text x="50%" y="${textConfig.date.top}" font-size="${textConfig.date.fontSize}" text-anchor="middle" class="subtitle">
        Issued: ${data.issueDate}
      </text>
    </svg>
  `

  // Composite text over template
  const result = await sharp(templateBuffer)
    .composite([{
      input: Buffer.from(svgOverlay),
      top: 0,
      left: 0
    }])
    .png()
    .toBuffer()

  return result
}