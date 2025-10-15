import type { SVGProps } from 'react';

export function TonhubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M24 0L48 24L24 48L0 24L24 0Z" fill="url(#paint0_linear_81_103)"/>
        <path d="M24 9L13 24.5385L24 39L35 24.5385L24 9Z" fill="white"/>
        <defs>
            <linearGradient id="paint0_linear_81_103" x1="24" y1="0" x2="24" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8A48F6"/>
            <stop offset="1" stopColor="#5A55F6"/>
            </linearGradient>
        </defs>
    </svg>
  );
}
