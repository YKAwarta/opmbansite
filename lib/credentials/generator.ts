'use server'

import fs from 'node:fs'
import path from 'node:path'
import {
  createCanvas,
  loadImage,
  GlobalFonts,
  type SKRSContext2D,
} from '@napi-rs/canvas'

const FONT_PATH = path.join(process.cwd(), 'assets', 'fonts', 'times.ttf')
if (!GlobalFonts.has('Inter')) {
  const fontBuf = fs.readFileSync(FONT_PATH)
  GlobalFonts.register(fontBuf, 'Inter')
}

export interface DrawSpec {
  x: number
  y: number
  fontSize: number
  color: string
  align: 'left' | 'center' | 'right'
  maxWidth?: number
}

export interface Layout { [key: string]: DrawSpec }

export const LAYOUTS: Record<'certificate'|'membership_card', Layout> = {
  certificate: {
    name:   { x: 500, y: 300, fontSize: 48, color: '#000', align: 'center', maxWidth: 800 },
    id:     { x: 500, y: 380, fontSize: 20, color: '#444', align: 'center', maxWidth: 800 },
    issued: { x: 500, y: 450, fontSize: 24, color: '#666', align: 'center', maxWidth: 800 },
  },
  membership_card: {
    name:   { x: 400, y: 250, fontSize: 32, color: '#FFF', align: 'center', maxWidth: 500 },
    id:     { x: 400, y: 300, fontSize: 20, color: '#FFF', align: 'center', maxWidth: 500 },
    issued: { x: 400, y: 350, fontSize: 16, color: '#CCC', align: 'center', maxWidth: 500 },
  },
}

function fit(ctx: SKRSContext2D, text: string, maxWidth: number | undefined, base: number) {
  if (!maxWidth || maxWidth <= 0) return base
  let size = base
  ctx.font = `${size}px Inter`
  while (ctx.measureText(text).width > maxWidth && size > 10) {
    size -= 1
    ctx.font = `${size}px Inter`
  }
  return size
}

export async function renderOnTemplate(
  templateUrl: string,
  kind: 'certificate' | 'membership_card',
  data: { name: string; studentId?: string; issueISO: string }
): Promise<Buffer> {
  const res = await fetch(templateUrl)
  if (!res.ok) throw new Error(`Template fetch failed: ${res.status}`)
  const templateBuf = Buffer.from(await res.arrayBuffer())
  const img = await loadImage(templateBuf)

  const canvas = createCanvas(img.width, img.height)
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0)

  const spec = LAYOUTS[kind]

  // Name
  {
    const p = spec.name
    ctx.textAlign = p.align as any
    ctx.textBaseline = 'middle'
    ctx.fillStyle = p.color
    const size = fit(ctx, data.name, p.maxWidth, p.fontSize)
    ctx.font = `${size}px Inter`
    ctx.fillText(data.name, p.x, p.y)
  }

  // Student ID
  if (data.studentId) {
    const p = spec.id
    ctx.textAlign = p.align as any
    ctx.textBaseline = 'middle'
    ctx.fillStyle = p.color
    ctx.font = `${p.fontSize}px Inter`
    ctx.fillText(`ID: ${data.studentId}`, p.x, p.y, p.maxWidth)
  }

  // Issued date (YYYY-MM-DD)
  {
    const p = spec.issued
    ctx.textAlign = p.align as any
    ctx.textBaseline = 'middle'
    ctx.fillStyle = p.color
    ctx.font = `${p.fontSize}px Inter`
    ctx.fillText(`Issued: ${data.issueISO.slice(0, 10)}`, p.x, p.y, p.maxWidth)
  }

  return canvas.toBuffer('image/png')
}
