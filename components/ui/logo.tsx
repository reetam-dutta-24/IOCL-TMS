import React from 'react'
import Link from 'next/link'

interface LogoProps {
  width?: number
  height?: number
  className?: string
  clickable?: boolean
}

export const IndianOilLogo: React.FC<LogoProps> = ({ 
  width = 40, 
  height = 40, 
  className = "",
  clickable = true
}) => {
  const logoContent = (
    <div className={`inline-flex items-center ${className} ${clickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}>
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 200 200" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Outer circle with white border */}
        <circle cx="100" cy="100" r="95" fill="#003366" stroke="white" strokeWidth="6"/>
        
        {/* Orange background */}
        <circle cx="100" cy="100" r="85" fill="#ff6600"/>
        
        {/* Blue band for text */}
        <rect x="15" y="75" width="170" height="50" fill="#003366"/>
        
        {/* Hindi text stylized */}
        <text 
          x="100" 
          y="108" 
          textAnchor="middle" 
          fill="white" 
          fontSize="24" 
          fontWeight="bold" 
          fontFamily="Arial, sans-serif"
        >
          इंडियनऑयल
        </text>
        
        {/* English text */}
        <text 
          x="100" 
          y="170" 
          textAnchor="middle" 
          fill="#003366" 
          fontSize="18" 
          fontWeight="bold" 
          fontFamily="Arial, sans-serif"
        >
          IndianOil
        </text>
      </svg>
    </div>
  )

  if (clickable) {
    return (
      <Link href="/" className="no-underline">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}

export default IndianOilLogo