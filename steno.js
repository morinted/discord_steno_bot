const Canvas = require('canvas')

const keys =
  [ '#', 's', 't', 'k', 'p', 'w', 'h', 'r'
  , 'a', 'o', '*', '-', 'e', 'u'
  , 'F', 'R', 'P', 'B', 'L', 'G', 'T', 'S', 'D', 'Z'
  ]

class Stroke {
  constructor(rawSteno) {
    this.isValid = false
    rawSteno = rawSteno.toLowerCase()
    keys.reduce((stroke, key) => {
      stroke[key] = false
      return stroke
    }, this)
    const normalized = normalizeStroke(rawSteno)
    if (!normalized) return
    normalized.left.split('').forEach(stenoKey => {
      stenoKey = stenoKey.toLowerCase()
      if (keys.includes(stenoKey)) {
        this[stenoKey] = true
        this.isValid = true
      }
    })
    normalized.mid.split('').forEach(stenoKey => {
      stenoKey = stenoKey.toLowerCase()
      if (keys.includes(stenoKey)) {
        this[stenoKey] = true
        this.isValid = true
      }
    })
    normalized.right.split('').forEach(stenoKey => {
      stenoKey = stenoKey.toUpperCase()
      if (keys.includes(stenoKey)) {
        this[stenoKey] = true
        this.isValid = true
      }
    })
    if (['a', 'o', 'e', 'u', '*'].every(key => !this[key])) {
      this['-'] = true
    }
  }

  toString() {
    return keys.reduce((normalized, key) => {
      if (this[key]) {
        return normalized + key.toUpperCase()
      }
      return normalized
    }, '')
  }

  toCanvas() {
    const rowH = 18
    const colW = 13
    const rowPad = 2
    const colPad = 2
    const canvas = new Canvas(10 * (colW + colPad) + 1, 4 * (rowH + rowPad) - 3)

    const ctx = canvas.getContext('2d')
    const stroke = this

    const xOffset = 1
    const yOffset = -5

    function drawKey(symbol, col, row, round = false, rowSpan = 1, colSpan = 1) {
      ctx.fillStyle = '#D1D2D4'
      ctx.strokeStyle = '#121212'
      if (stroke[symbol]) {
        ctx.fillStyle = '#9DDCFD'
      }
      ctx.textAlign = 'center'
      const x = col * (colW + colPad) + xOffset
      const y = row * (rowH + rowPad) + yOffset
      const arcCompensation = round ? (colW * colSpan) / 2 : 0
      ctx.beginPath()
      ctx.moveTo(x, y) // top left
      const right = colW * colSpan + (colPad * colSpan - 1)
      ctx.lineTo(x + right, y) // top right
      const down = rowH * rowSpan + (rowPad * rowSpan - 1) - arcCompensation
      ctx.lineTo(x + right, y + down) // bottom right
      const radius = right / 2
      if (round) {
        ctx.arc(x + radius, y + down, radius, 0, Math.PI)
      } else {
        ctx.lineTo(x, y + down)
      }
      ctx.lineTo(x, y)

      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = 'black'
      ctx.font = '13px monospace'
      if (symbol !== '#') { // Silly number bar doesn't look right.
        ctx.fillText(symbol.toUpperCase(), x + right/2, y + (down + arcCompensation) / 1.5)
      }
    }

    drawKey('#', 0, 0.4, false, .6, 10)
    drawKey('s', 0, 1, true, 2)
    drawKey('t', 1, 1, false)
    drawKey('k', 1, 2, true)
    drawKey('p', 2, 1, false)
    drawKey('w', 2, 2, true)
    drawKey('h', 3, 1, false)
    drawKey('r', 3, 2, true)
    drawKey('*', 4, 1, true, 2)
    drawKey('F', 5, 1, false)
    drawKey('R', 5, 2, true)
    drawKey('P', 6, 1, false)
    drawKey('B', 6, 2, true)
    drawKey('L', 7, 1, false)
    drawKey('G', 7, 2, true)
    drawKey('T', 8, 1, false)
    drawKey('S', 8, 2, true)
    drawKey('D', 9, 1, false)
    drawKey('Z', 9, 2, true)
    drawKey('a', 2.3, 3.1, true)
    drawKey('o', 3.3, 3.1, true)
    drawKey('e', 4.7, 3.1, true)
    drawKey('u', 5.7, 3.1, true)
    return canvas
  }

  toBuffer() {
    const canvas = this.toCanvas()
    return canvas.toBuffer(undefined, 9, canvas.PNG_FILTER_NONE)
  }
}

const numberToKeys =
  new Map(
    [ [ '1', 's' ]
    , [ '2', 't' ]
    , [ '3', 'p' ]
    , [ '4', 'h' ]
    , [ '5', 'a' ]
    , [ '0', 'o' ]
    , [ '6', 'f' ]
    , [ '7', 'p' ]
    , [ '8', 'l' ]
    , [ '9', 't' ]
    ]
  )

const leftShort =
  new Map(
    [ [ 'j', 'skwr' ]
    , [ 'v', 'sr' ]
    , [ 'z', 'stkpw' ]
    , [ 'g', 'tkpw' ]
    , [ 'd', 'tk' ]
    , [ 'n', 'tph' ]
    , [ 'f', 'tp' ]
    , [ 'x', 'kp' ]
    , [ 'c', 'kr' ]
    , [ 'y', 'kwr' ]
    , [ 'q', 'kw' ]
    , [ 'b', 'pw' ]
    , [ 'm', 'ph' ]
    , [ 'l', 'hr' ]
    ]
  )

const midShort =
  new Map(
    [ [ 'oo', 'ao' ]
    , [ 'ii', 'aoeu' ]
    , [ 'uu', 'aou' ]
    , [ 'aa', 'aeu' ]
    , [ 'ee', 'aoe' ]
    , [ 'i', 'eu' ]
    ]
  )

const rightShort =
  new Map(
    [ [ 'ch', 'fp' ]
    , [ 'shn', 'gs' ]
    , [ 'sh', 'rb' ]
    , [ 'j', 'pblg' ]
    , [ 'n', 'pb' ]
    , [ 'x', 'bgs' ]
    , [ 'k', 'bg' ]
    , [ 'm', 'pl' ]
    , [ 'v', '*f' ]
    ]
  )

const numberPattern = /\d/

const handSplitter =
  /(j?v?s?z?g?f?t?x?c?k?d?n?m?b?p?y?q?w?h?r?l?)((?:a?o?e?u?i?\*?-?)+)((?:sh)?(?:ch)?v?f?r?n?m?j?p?k?x?b?l?g?t?s?d?z?)/

const replaceIterator = (replacements, steno) => {
  replacements.forEach((longhand, shorthand) => {
    steno = steno.replace(shorthand, longhand)
  })
  return steno
}

const normalizeStroke = rawStroke => {
  rawStroke = rawStroke ? rawStroke.trim() : null
  if (!rawStroke) return null
  const numberBar = numberPattern.test(rawStroke)
  if (numberBar) {
    rawStroke = replaceIterator(numberToKeys, rawStroke)
  }

  const stenoParts = rawStroke.split(handSplitter)
  if (stenoParts.length !== 5) return false
  let [, leftHand, midHand, rightHand, ] = stenoParts
  leftHand = replaceIterator(leftShort, leftHand)
  midHand = replaceIterator(midShort, midHand)
  rightHand = replaceIterator(rightShort, rightHand)
  return (
    { left: (numberBar ? '#' : '') + leftHand.toUpperCase()
    , mid: midHand.toUpperCase()
    , right: rightHand.toUpperCase()
    }
  )
}

const strokesToString = strokes =>
  strokes.map(stroke => stroke.toString()).join('/')

const strokesToBuffer = strokes => {
  if (!strokes || !strokes.length) return null
  const padding = 2
  if (strokes.length === 1) {
    return strokes[0].toBuffer()
  }
  const canvases = strokes.map(stroke => stroke.toCanvas())
  const height = canvases.length * (canvases[0].height + padding) - padding
  const canvas = new Canvas(canvases[0].width, height)
  const ctx = canvas.getContext('2d')
  canvases.forEach((oldCanvas, index) => {
    ctx.drawImage(oldCanvas, 0, (canvases[0].height + 2) * index)
  })
  const buffer = canvas.toBuffer(undefined, 9, canvas.PNG_FILTER_NONE)
  return buffer
}

const toStrokes = rawSteno => {
  rawSteno = rawSteno.toLowerCase()
  return rawSteno
    .split(/(?: |\/)/)
    .filter(x => x)
    .map(rawSteno => (new Stroke(rawSteno)))
    .filter(stroke => stroke.isValid)
}

const normalize = rawSteno => {
  return strokesToString(toStrokes(rawSteno))
}

const stenoToBuffer = rawSteno => {
  return strokesToBuffer(toStrokes(rawSteno))
}

module.exports =
  { normalize
  , toStrokes
  , strokesToString
  , stenoToBuffer
  , Stroke
  }
