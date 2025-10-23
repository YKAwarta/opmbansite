import sharp from 'sharp'

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

  // Different layouts for certificate vs membership card
  let svgOverlay: string
  
  if (type === 'certificate') {
    // Certificate - ONLY name, centered
    svgOverlay = `
      <svg width="${width}" height="${height}">
        <style>
          @font-face {
            font-family: 'Times';
            src: url('data:font/truetype;base64,${await getFontBase64()}');
          }
          .name { 
            fill: #000000; 
            font-family: 'Times New Roman', Times, serif; 
            font-weight: normal; 
          }
        </style>
        <text x="50%" y="${Math.floor(height * 0.45)}" 
              font-size="100" 
              text-anchor="middle" 
              class="name">
          ${data.name}
        </text>
      </svg>
    `
  } else {
    // Membership card - keep all fields
    svgOverlay = `
      <svg width="${width}" height="${height}">
        <style>
          .title { fill: #000000; font-family: Arial, sans-serif; font-weight: bold; }
          .subtitle { fill: #666666; font-family: Arial, sans-serif; }
        </style>
        <text x="50%" y="${Math.floor(height * 0.40)}" font-size="40" text-anchor="middle" class="title">
          ${data.name}
        </text>
        <text x="50%" y="${Math.floor(height * 0.55)}" font-size="25" text-anchor="middle" class="subtitle">
          ID: ${data.studentId}
        </text>
        <text x="50%" y="${Math.floor(height * 0.70)}" font-size="20" text-anchor="middle" class="subtitle">
          Issued: ${data.issueDate}
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

// Helper function to load font (optional - for custom fonts)
async function getFontBase64(): Promise<string> {
  // For now, use system Times New Roman
  return ''
}