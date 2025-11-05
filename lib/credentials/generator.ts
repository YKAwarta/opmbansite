import sharp from 'sharp'
import { createCanvas, registerFont } from 'canvas'
import path from 'path'

// Register the Times New Roman font
const fontPath = path.join(process.cwd(), 'assets', 'fonts', 'times.ttf')
registerFont(fontPath, { family: 'Times New Roman' })

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

  // Create a transparent canvas for text overlay
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // Make canvas transparent
  ctx.clearRect(0, 0, width, height)

  if (type === 'certificate') {
    // Certificate - ONLY name, centered, with Times New Roman
    ctx.font = 'normal 100px "Times New Roman"'
    ctx.fillStyle = '#000000'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(data.name, width / 2, height * 0.45)
  } else {
    // Membership card - all fields
    // Name
    ctx.font = 'bold 40px Arial'
    ctx.fillStyle = '#000000'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(data.name, width / 2, height * 0.40)

    // Student ID
    ctx.font = '25px Arial'
    ctx.fillStyle = '#666666'
    ctx.fillText(`ID: ${data.studentId}`, width / 2, height * 0.55)

    // Issue Date
    ctx.font = '20px Arial'
    ctx.fillText(`Issued: ${data.issueDate}`, width / 2, height * 0.70)
  }

  // Convert canvas to PNG buffer
  const textOverlayBuffer = canvas.toBuffer('image/png')

  // Composite the text overlay onto the template
  const result = await sharp(templateBuffer)
    .composite([{
      input: textOverlayBuffer,
      top: 0,
      left: 0
    }])
    .png()
    .toBuffer()

  return result
}