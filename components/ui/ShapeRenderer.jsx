'use client'

const COLOR_MAP = {
  red: { fill: '#EF4444', stroke: '#B91C1C', light: '#FEE2E2' },
  blue: { fill: '#3B82F6', stroke: '#1D4ED8', light: '#DBEAFE' },
  sky: { fill: '#0EA5E9', stroke: '#0369A1', light: '#E0F2FE' },
  green: { fill: '#22C55E', stroke: '#15803D', light: '#DCFCE7' },
  yellow: { fill: '#FACC15', stroke: '#CA8A04', light: '#FEF9C3' },
  orange: { fill: '#FB923C', stroke: '#C2410C', light: '#FFEDD5' },
  pink: { fill: '#F472B6', stroke: '#BE185D', light: '#FCE7F3' },
  purple: { fill: '#A855F7', stroke: '#7E22CE', light: '#F3E8FF' },
  cyan: { fill: '#06B6D4', stroke: '#0E7490', light: '#CFFAFE' },
  gold: { fill: '#F59E0B', stroke: '#B45309', light: '#FEF3C7' },
  dark: { fill: '#374151', stroke: '#111827', light: '#E5E7EB' },
  white: { fill: '#F8FAFC', stroke: '#64748B', light: '#FFFFFF' }
}

/**
 * Parses shape token:
 * format: shape:type:color[:pattern]
 * examples:
 *   - shape:triangle:red
 *   - shape:circle:blue:striped
 *   - shape:arrow:up:gold
 *   - shape:arrow:up-right:green
 *   - shape:square:green:outline
 */
export function parseShapeToken(token) {
  if (typeof token !== 'string') return null
  if (!token.startsWith('shape:')) return null

  const parts = token.split(':')
  if (parts.length >= 3) {
    if (parts[1] === 'arrow') {
      return {
        shape: `arrow-${parts[2]}`,
        color: parts[3] || 'blue',
        pattern: parts[4] || 'solid'
      }
    }
    return {
      shape: parts[1],
      color: parts[2],
      pattern: parts[3] || 'solid'
    }
  }
  if (parts.length === 2) {
    return { shape: parts[1], color: 'blue', pattern: 'solid' }
  }
  return null
}

export default function ShapeRenderer({
  item,
  size = 64,
  className = ''
}) {
  if (!item) return null

  const parsed = parseShapeToken(item)

  // If not a shape token, render standard string/emoji
  if (!parsed) {
    return <span className={className}>{item}</span>
  }

  const { shape, color, pattern = 'solid' } = parsed
  const colorDef = COLOR_MAP[color] || COLOR_MAP.blue

  const patternId = `pat-${color}-${pattern}`
  let fillValue = colorDef.fill

  if (pattern === 'outline' || pattern === 'hollow') {
    fillValue = 'transparent'
  } else if (pattern === 'striped' || pattern === 'stripe') {
    fillValue = `url(#${patternId})`
  } else if (pattern === 'dots' || pattern === 'dot') {
    fillValue = `url(#${patternId})`
  }

  const renderShapePath = () => {
    switch (shape) {
      case 'circle':
        return (
          <circle
            cx="50"
            cy="50"
            r="38"
            fill={fillValue}
            stroke={colorDef.stroke}
            strokeWidth="6"
          />
        )
      case 'oval':
        return (
          <ellipse
            cx="50"
            cy="50"
            rx="42"
            ry="28"
            fill={fillValue}
            stroke={colorDef.stroke}
            strokeWidth="6"
          />
        )
      case 'square':
        return (
          <rect
            x="14"
            y="14"
            width="72"
            height="72"
            rx="8"
            fill={fillValue}
            stroke={colorDef.stroke}
            strokeWidth="6"
          />
        )
      case 'rectangle':
        return (
          <rect
            x="10"
            y="24"
            width="80"
            height="52"
            rx="8"
            fill={fillValue}
            stroke={colorDef.stroke}
            strokeWidth="6"
          />
        )
      case 'trapezoid':
        return (
          <polygon
            points="24,20 76,20 90,80 10,80"
            fill={fillValue}
            stroke={colorDef.stroke}
            strokeWidth="6"
            strokeLinejoin="round"
          />
        )
      case 'parallelogram':
        return (
          <polygon
            points="28,20 90,20 72,80 10,80"
            fill={fillValue}
            stroke={colorDef.stroke}
            strokeWidth="6"
            strokeLinejoin="round"
          />
        )
      case 'triangle':
        return (
          <polygon
            points="50,14 88,84 12,84"
            fill={fillValue}
            stroke={colorDef.stroke}
            strokeWidth="6"
            strokeLinejoin="round"
          />
        )
      case 'pentagon':
        return (
          <polygon
            points="50,10 88,38 74,84 26,84 12,38"
            fill={fillValue}
            stroke={colorDef.stroke}
            strokeWidth="6"
            strokeLinejoin="round"
          />
        )
      case 'hexagon':
        return (
          <polygon
            points="50,12 85,31 85,69 50,88 15,69 15,31"
            fill={fillValue}
            stroke={colorDef.stroke}
            strokeWidth="6"
            strokeLinejoin="round"
          />
        )
      case 'star':
        return (
          <polygon
            points="50,10 61,35 88,38 68,56 73,83 50,70 27,83 32,56 12,38 39,35"
            fill={fillValue}
            stroke={colorDef.stroke}
            strokeWidth="5"
            strokeLinejoin="round"
          />
        )
      case 'heart':
        return (
          <path
            d="M50,84 C22,60 12,42 12,27 C12,14 23,8 35,8 C43,8 47,12 50,17 C53,12 57,8 65,8 C77,8 88,14 88,27 C88,42 78,60 50,84 Z"
            fill={fillValue}
            stroke={colorDef.stroke}
            strokeWidth="6"
            strokeLinejoin="round"
          />
        )
      case 'diamond':
        return (
          <polygon
            points="50,10 88,50 50,90 12,50"
            fill={fillValue}
            stroke={colorDef.stroke}
            strokeWidth="6"
            strokeLinejoin="round"
          />
        )
      case 'cross':
      case 'plus':
        return (
          <polygon
            points="36,12 64,12 64,36 88,36 88,64 64,64 64,88 36,88 36,64 12,64 12,36 36,36"
            fill={fillValue}
            stroke={colorDef.stroke}
            strokeWidth="6"
            strokeLinejoin="round"
          />
        )
      case 'ring':
      case 'donut':
        return (
          <path
            d="M50,12 A38,38 0 1,0 50,88 A38,38 0 1,0 50,12 M50,30 A20,20 0 1,1 50,70 A20,20 0 1,1 50,30"
            fill={fillValue}
            stroke={colorDef.stroke}
            strokeWidth="6"
            fillRule="evenodd"
          />
        )
      case 'lightning':
        return (
          <polygon
            points="54,10 22,52 46,52 42,90 78,48 54,48"
            fill={fillValue}
            stroke={colorDef.stroke}
            strokeWidth="5"
            strokeLinejoin="round"
          />
        )
      case 'arrow-up':
        return (
          <polygon
            points="50,12 85,46 62,46 62,86 38,86 38,46 15,46"
            fill={fillValue}
            stroke={colorDef.stroke}
            strokeWidth="6"
            strokeLinejoin="round"
          />
        )
      case 'arrow-down':
        return (
          <polygon
            points="50,88 85,54 62,54 62,14 38,14 38,54 15,54"
            fill={fillValue}
            stroke={colorDef.stroke}
            strokeWidth="6"
            strokeLinejoin="round"
          />
        )
      case 'arrow-left':
        return (
          <polygon
            points="12,50 46,15 46,38 86,38 86,62 46,62 46,85"
            fill={fillValue}
            stroke={colorDef.stroke}
            strokeWidth="6"
            strokeLinejoin="round"
          />
        )
      case 'arrow-right':
        return (
          <polygon
            points="88,50 54,15 54,38 14,38 14,62 54,62 54,85"
            fill={fillValue}
            stroke={colorDef.stroke}
            strokeWidth="6"
            strokeLinejoin="round"
          />
        )
      case 'arrow-up-right':
        return (
          <g transform="rotate(45 50 50)">
            <polygon
              points="50,12 85,46 62,46 62,86 38,86 38,46 15,46"
              fill={fillValue}
              stroke={colorDef.stroke}
              strokeWidth="6"
              strokeLinejoin="round"
            />
          </g>
        )
      case 'arrow-down-right':
        return (
          <g transform="rotate(135 50 50)">
            <polygon
              points="50,12 85,46 62,46 62,86 38,86 38,46 15,46"
              fill={fillValue}
              stroke={colorDef.stroke}
              strokeWidth="6"
              strokeLinejoin="round"
            />
          </g>
        )
      case 'moon':
      case 'crescent-moon':
        return (
          <path
            d="M68,14 C44,24 38,62 62,82 C34,80 18,60 18,44 C18,26 36,15 68,14 Z"
            fill={fillValue}
            stroke={colorDef.stroke}
            strokeWidth="6"
            strokeLinejoin="round"
          />
        )
      case 'sun':
        return (
          <g>
            <circle
              cx="50"
              cy="50"
              r="22"
              fill={fillValue}
              stroke={colorDef.stroke}
              strokeWidth="5"
            />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
              <line
                key={idx}
                x1="50"
                y1="16"
                x2="50"
                y2="8"
                stroke={colorDef.stroke}
                strokeWidth="5"
                strokeLinecap="round"
                transform={`rotate(${angle} 50 50)`}
              />
            ))}
          </g>
        )
      default:
        return (
          <circle
            cx="50"
            cy="50"
            r="38"
            fill={fillValue}
            stroke={colorDef.stroke}
            strokeWidth="6"
          />
        )
    }
  }

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full filter drop-shadow-[0_4px_0_rgba(0,0,0,0.15)]"
      >
        <defs>
          {/* Diagonal Striped Pattern */}
          <pattern
            id={patternId}
            patternUnits="userSpaceOnUse"
            width="12"
            height="12"
            patternTransform="rotate(45)"
          >
            <rect width="12" height="12" fill={colorDef.light} />
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="12"
              stroke={colorDef.fill}
              strokeWidth="5"
            />
          </pattern>
        </defs>
        {renderShapePath()}
      </svg>
    </div>
  )
}
