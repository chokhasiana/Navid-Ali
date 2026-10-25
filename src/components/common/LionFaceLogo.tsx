import React from 'react';

interface LionFaceLogoProps {
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const LionFaceLogo: React.FC<LionFaceLogoProps> = ({
  className = '',
  size = 24,
  color = '#c59b27',
  strokeWidth = 2,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Royal Crown / Diadem atop mane */}
      <path
        d="M32 20L41 27L50 16L59 27L68 20L65 31H35L32 20Z"
        fill={color}
        fillOpacity="0.25"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <circle cx="50" cy="14" r="2" fill={color} />
      <circle cx="32" cy="18" r="1.5" fill={color} />
      <circle cx="68" cy="18" r="1.5" fill={color} />

      {/* Radiant Majestic Lion Mane (Heraldic geometric luxury locks) */}
      <path
        d="M26 36C20 40 16 48 16 57C16 68 23 77 33 83C30 78 30 72 32 67
           M74 36C80 40 84 48 84 57C84 68 77 77 67 83C70 78 70 72 68 67"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M20 48C13 54 12 66 17 73C21 68 25 65 29 63
           M80 48C87 54 88 66 83 73C79 68 75 65 71 63"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M36 84C42 90 46 92 50 92C54 92 58 90 64 84C59 86 54 87 50 87C46 87 41 86 36 84Z"
        fill={color}
        fillOpacity="0.2"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />

      {/* Royal Ears */}
      <path
        d="M28 32C24 28 25 22 30 22C33 22 36 25 36 29
           M72 32C76 28 75 22 70 22C67 22 64 25 64 29"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Lion Face Contour */}
      <path
        d="M32 34C32 34 38 31 50 31C62 31 68 34 68 34C72 44 72 60 67 72C61 78 56 81 50 81C44 81 39 78 33 72C28 60 28 44 32 34Z"
        fill={color}
        fillOpacity="0.08"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />

      {/* Regal Eyes & Brow Arch */}
      <path
        d="M37 45C40 43 45 44 46 47
           M63 45C60 43 55 44 54 47"
        stroke={color}
        strokeWidth={strokeWidth + 0.5}
        strokeLinecap="round"
      />
      {/* Eyes */}
      <ellipse cx="42" cy="48" rx="3" ry="2" fill={color} />
      <ellipse cx="58" cy="48" rx="3" ry="2" fill={color} />

      {/* Bridge of Nose */}
      <path
        d="M47 48L46 59L43 62M53 48L54 59L57 62"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Noble Nose / Muzzle */}
      <path
        d="M45 62H55L50 67L45 62Z"
        fill={color}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />

      {/* Whiskers & Mouth Arc */}
      <path
        d="M50 67V72
           M50 72C46 72 43 70 41 68
           M50 72C54 72 57 70 59 68
           M50 76C47 76 45 74 45 74
           M50 76C53 76 55 74 55 74"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Whiskers dots */}
      <circle cx="39" cy="67" r="1" fill={color} />
      <circle cx="37" cy="69" r="1" fill={color} />
      <circle cx="61" cy="67" r="1" fill={color} />
      <circle cx="63" cy="69" r="1" fill={color} />
    </svg>
  );
};

// URL-encoded SVG string for repeating background pattern
export const lionFaceSvgDataUri = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none' stroke='%23c59b27' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M32 20L41 27L50 16L59 27L68 20L65 31H35L32 20Z' fill='%23c59b27' fill-opacity='0.25'/%3E%3Ccircle cx='50' cy='14' r='2' fill='%23c59b27'/%3E%3Cpath d='M26 36C20 40 16 48 16 57C16 68 23 77 33 83C30 78 30 72 32 67M74 36C80 40 84 48 84 57C84 68 77 77 67 83C70 78 70 72 68 67'/%3E%3Cpath d='M20 48C13 54 12 66 17 73C21 68 25 65 29 63M80 48C87 54 88 66 83 73C79 68 75 65 71 63'/%3E%3Cpath d='M36 84C42 90 46 92 50 92C54 92 58 90 64 84C59 86 54 87 50 87C46 87 41 86 36 84Z' fill='%23c59b27' fill-opacity='0.2'/%3E%3Cpath d='M28 32C24 28 25 22 30 22C33 22 36 25 36 29M72 32C76 28 75 22 70 22C67 22 64 25 64 29'/%3E%3Cpath d='M32 34C32 34 38 31 50 31C62 31 68 34 68 34C72 44 72 60 67 72C61 78 56 81 50 81C44 81 39 78 33 72C28 60 28 44 32 34Z' fill='%23c59b27' fill-opacity='0.12'/%3E%3Cellipse cx='42' cy='48' rx='3' ry='2' fill='%23c59b27'/%3E%3Cellipse cx='58' cy='48' rx='3' ry='2' fill='%23c59b27'/%3E%3Cpath d='M45 62H55L50 67L45 62Z' fill='%23c59b27'/%3E%3Cpath d='M50 67V72M50 72C46 72 43 70 41 68M50 72C54 72 57 70 59 68'/%3E%3C/svg%3E`;
