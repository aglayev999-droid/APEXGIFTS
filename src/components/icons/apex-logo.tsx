import type { SVGProps } from 'react';

export function ApexLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 12l8-8 8 8-8 8-8-8z" />
      <path d="M4 12l8 8" />
      <path d="M12 4v16" />
      <path d="M20 12l-8 8" />
    </svg>
  );
}
