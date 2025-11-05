import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

export async function generateCredential(
  templateUrl: string,
  type: 'certificate' | 'membership_card',
  data: {
    name: string
    studentId: string
    issueDate: string
  }
): Promise<Buffer> {
  const response = await fetch(templateUrl)
  const templateBuffer = Buffer.from(await response.arrayBuffer())

  const metadata = await sharp(templateBuffer).metadata()
  const width = metadata.width || 1000
  const height = metadata.height || 700

  // Load Times New Roman font as base64
  const fontPath = path.join(process.cwd(), 'assets', 'fonts', 'times.ttf')
  const fontBuffer = fs.readFileSync(fontPath)
  const fontBase64 = fontBuffer.toString('base64')

  // Different layouts for certificate vs membership card
  let svgOverlay: string

  if (type === 'certificate') {
    // Certificate - ONLY name, centered, with Times New Roman
    svgOverlay = `
      <svg width="${width}" height="${height}">
        <defs>
          <style type="text/css">
            @font-face {
              font-family: 'Times';
              src: url(data:font/truetype;charset=utf-8;base64,${fontBase64}) format('truetype');
              font-weight: normal;
              font-style: normal;
            }
          </style>
        </defs>
        <text 
          x="50%" 
          y="${Math.floor(height * 0.45)}" 
          font-size="100" 
          font-family="Times, serif"
          font-weight="normal"
          text-anchor="middle" 
          fill="#000000">
          ${escapeXml(data.name)}
        </text>
      </svg>
    `
  } else {
    // Membership card - sans-serif for cleaner look
    svgOverlay = `
      <svg width="${width}" height="${height}">
        <text 
          x="50%" 
          y="${Math.floor(height * 0.40)}" 
          font-size="40" 
          font-family="sans-serif"
          font-weight="bold"
          text-anchor="middle" 
          fill="#000000">
          ${escapeXml(data.name)}
        </text>
        <text 
          x="50%" 
          y="${Math.floor(height * 0.55)}" 
          font-size="25" 
          font-family="sans-serif"
          text-anchor="middle" 
          fill="#666666">
          ID: ${escapeXml(data.studentId)}
        </text>
        <text 
          x="50%" 
          y="${Math.floor(height * 0.70)}" 
          font-size="20" 
          font-family="sans-serif"
          text-anchor="middle" 
          fill="#666666">
          Issued: ${escapeXml(data.issueDate)}
        </text>
      </svg>
    `
  }

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

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case '\'': return '&apos;'
      case '"': return '&quot;'
      default: return c
    }
  })
}