'use client'

export default function Logo({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:'block' }}>
      <defs>
        {/* Gold metal gradient */}
        <linearGradient id="goldMetal" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%"  stopColor="#E2C97E"/>
          <stop offset="35%" stopColor="#C9A84C"/>
          <stop offset="65%" stopColor="#8A6D2B"/>
          <stop offset="100%" stopColor="#C9A84C"/>
        </linearGradient>
        {/* Chrome ring gradient */}
        <linearGradient id="chrome" x1="0" y1="0" x2="0" y2="100">
          <stop offset="0%"  stopColor="#F5F5F7"/>
          <stop offset="45%" stopColor="#8E8E96"/>
          <stop offset="55%" stopColor="#3C3C42"/>
          <stop offset="100%" stopColor="#C8C8CC"/>
        </linearGradient>
        {/* Moving shine sweep */}
        <linearGradient id="sweep" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="white" stopOpacity="0"/>
          <stop offset="50%"  stopColor="white" stopOpacity="0.85"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
          <animateTransform attributeName="gradientTransform" type="translate"
            from="-100 0" to="200 0" dur="3.2s" repeatCount="indefinite"/>
        </linearGradient>
        <clipPath id="hexClip">
          <path d="M50 4 L89 26 L89 74 L50 96 L11 74 L11 26 Z"/>
        </clipPath>
      </defs>

      {/* Outer chrome hexagon ring */}
      <path d="M50 2 L91 25 L91 75 L50 98 L9 75 L9 25 Z"
        stroke="url(#chrome)" strokeWidth="3" fill="#0A0A0B"/>

      {/* Inner gold hexagon edge */}
      <path d="M50 8 L86 28 L86 72 L50 92 L14 72 L14 28 Z"
        stroke="url(#goldMetal)" strokeWidth="1.5" fill="none" opacity="0.7"/>

      {/* BB monogram */}
      <text x="50" y="63" textAnchor="middle"
        fontFamily="Cormorant Garamond, serif" fontWeight="700" fontSize="42"
        fill="url(#goldMetal)" letterSpacing="-2">BB</text>

      {/* Speed underline */}
      <path d="M26 72 L74 72" stroke="url(#goldMetal)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M32 78 L68 78" stroke="url(#goldMetal)" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>

      {/* Shine sweep across the whole badge */}
      <g clipPath="url(#hexClip)" opacity="0.35">
        <rect x="0" y="0" width="100" height="100" fill="url(#sweep)"/>
      </g>
    </svg>
  )
}
