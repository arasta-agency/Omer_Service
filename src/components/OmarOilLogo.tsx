import React from 'react';
import generatedLogoImage from '../assets/images/omar_oil_logo_1791064684500.jpg';

interface OmarOilLogoProps {
  className?: string;
  variant?: 'red' | 'white' | 'monochrome' | 'image';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

/**
 * Enhanced vector and graphic logo for "Omar Oil"
 * Faithfully matches the company logo with the car silhouette
 * and the two "O" letters forming the front and rear wheels.
 */
export const OmarOilLogo: React.FC<OmarOilLogoProps> = ({
  className = '',
  variant = 'red',
  size = 'md',
  showSubtitle = false,
}) => {
  // If image variant requested
  if (variant === 'image') {
    const sizeClasses = {
      xs: 'h-5 w-auto',
      sm: 'h-6 w-auto',
      md: 'h-9 w-auto',
      lg: 'h-13 w-auto',
      xl: 'h-18 w-auto',
    };

    return (
      <div className={`inline-flex flex-col items-center ${className}`}>
        <img
          src={generatedLogoImage}
          alt="Omar Oil Logo"
          className={`${sizeClasses[size]} object-contain rounded-lg shadow-sm`}
        />
        {showSubtitle && (
          <span className="text-[9px] text-slate-400 font-kurdish mt-0.5 tracking-tight">
            سێرڤس و گۆڕینی ڕۆن
          </span>
        )}
      </div>
    );
  }

  // Dimension scaling
  const heightMap = {
    xs: 18,
    sm: 24,
    md: 34,
    lg: 48,
    xl: 64,
  };
  const h = heightMap[size] || 34;
  const w = Math.round(h * 2.85); // 2.85:1 aspect ratio matching the car logo

  // Color mapping
  const primaryColor =
    variant === 'white'
      ? '#FFFFFF'
      : variant === 'monochrome'
      ? '#0F172A'
      : '#E11D48'; // Vivid automotive crimson red

  const secondaryColor =
    variant === 'white'
      ? '#E2E8F0'
      : variant === 'monochrome'
      ? '#334155'
      : '#E11D48';

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <svg
        width={w}
        height={h}
        viewBox="0 0 460 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-200"
      >
        {/* Main Sleek Sports Car Silhouette Outline */}
        <path
          d="M 65 42
             C 115 28, 160 16, 215 15
             C 255 14, 290 28, 335 48
             C 370 63, 405 85, 422 108
             M 65 42
             C 54 44, 48 50, 52 64
             C 55 76, 50 88, 54 100
             C 58 114, 75 125, 102 127
             C 106 123, 110 114, 114 105
             C 120 92, 134 85, 146 86
             C 152 86, 155 89, 157 91"
          stroke={primaryColor}
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Inner Window / Roof Greenhouse Swoop Curve */}
        <path
          d="M 162 38
             C 175 58, 200 68, 245 68
             L 300 68
             C 318 68, 330 63, 342 54"
          stroke={primaryColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Rear Wheel Arch Over the First 'O' */}
        <path
          d="M 100 125
             C 102 110, 112 96, 126 90
             C 137 85, 151 86, 160 92"
          stroke={primaryColor}
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* 'Omar Oil' Typography with 'O' as Wheels */}
        <g id="omar-oil-text">
          {/* REAR WHEEL - Letter 'O' in Omar */}
          <circle
            cx="140"
            cy="134"
            r="26"
            stroke={primaryColor}
            strokeWidth="9"
            fill="none"
          />

          {/* Letter 'm' */}
          <path
            d="M 174 153 L 174 122
               M 174 130 C 178 123, 185 119, 194 119 C 203 119, 209 124, 211 133
               C 215 123, 222 119, 231 119 C 241 119, 246 126, 246 138 L 246 153"
            stroke={secondaryColor}
            strokeWidth="8.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Letter 'a' */}
          <path
            d="M 285 142
               C 285 130, 275 120, 264 120
               C 252 120, 244 128, 244 138
               C 244 148, 252 154, 263 154
               C 274 154, 283 148, 285 139
               L 285 153"
            stroke={secondaryColor}
            strokeWidth="8.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Letter 'r' */}
          <path
            d="M 299 153 L 299 122
               M 299 130 C 304 123, 311 120, 319 120"
            stroke={secondaryColor}
            strokeWidth="8.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* FRONT WHEEL - Letter 'O' in Oil */}
          <circle
            cx="355"
            cy="134"
            r="26"
            stroke={primaryColor}
            strokeWidth="9"
            fill="none"
          />

          {/* Letter 'i' */}
          <path
            d="M 395 123 L 395 153
               M 395 112 L 395 113.5"
            stroke={secondaryColor}
            strokeWidth="8.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Letter 'l' */}
          <path
            d="M 409 111 L 409 153"
            stroke={secondaryColor}
            strokeWidth="8.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>

      {showSubtitle && (
        <span className="text-[11px] font-bold text-slate-300 font-kurdish tracking-wide border-r border-slate-700 pr-2 mr-1">
          سێرڤس و گۆڕینی ڕۆن
        </span>
      )}
    </div>
  );
};
