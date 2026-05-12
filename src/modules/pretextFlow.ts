import { layoutNextLine, prepareWithSegments } from '@chenglou/pretext'

export type FlowFloat = {
  id: string
  side: 'left' | 'right'
  top: number
  width: number
  height: number
  gutter?: number
}

export type FlowLine = {
  text: string
  x: number
  y: number
  width: number
}

export type FlowTextOptions = {
  text: string
  font: string
  lineHeight: number
  containerWidth: number
  paddingLeft?: number
  paddingRight?: number
  paddingBottom?: number
  minLineWidth?: number
  floats?: FlowFloat[]
}

export type FlowTextResult = {
  lines: FlowLine[]
  totalHeight: number
}

function getActiveMargins(y: number, lineHeight: number, floats: FlowFloat[]) {
  let left = 0
  let right = 0

  for (const item of floats) {
    const overlaps = y < item.top + item.height && y + lineHeight > item.top
    if (!overlaps) continue

    const reserve = item.width + (item.gutter ?? 0)
    if (item.side === 'left') left = Math.max(left, reserve)
    else right = Math.max(right, reserve)
  }

  return { left, right }
}

export function flowTextAroundFloats({
  text,
  font,
  lineHeight,
  containerWidth,
  paddingLeft = 0,
  paddingRight = 0,
  paddingBottom = 0,
  minLineWidth = 120,
  floats = [],
}: FlowTextOptions): FlowTextResult {
  if (!text.trim() || containerWidth <= 0) {
    return { lines: [], totalHeight: 0 }
  }

  const prepared = prepareWithSegments(text, font)
  const lines: FlowLine[] = []
  let cursor = { segmentIndex: 0, graphemeIndex: 0 }
  let y = 0

  for (let i = 0; i < 4000; i++) {
    const margins = getActiveMargins(y, lineHeight, floats)
    const width = Math.max(
      minLineWidth,
      containerWidth - paddingLeft - paddingRight - margins.left - margins.right,
    )
    const x = paddingLeft + margins.left

    const line = layoutNextLine(prepared, cursor, width)
    if (line === null) break

    lines.push({
      text: line.text,
      x,
      y,
      width,
    })

    cursor = line.end
    y += lineHeight
  }

  const maxFloatBottom = floats.reduce((acc, item) => Math.max(acc, item.top + item.height), 0)
  const totalHeight = Math.max(y, maxFloatBottom + lineHeight) + paddingBottom

  return { lines, totalHeight }
}
