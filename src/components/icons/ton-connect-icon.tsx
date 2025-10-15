import type { SVGProps } from 'react';

export function TonConnectIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M50 0L10 20.3125V68.75L50 100L90 68.75V20.3125L50 0Z" fill="#0098EA"/>
        <path d="M50 100L90 68.75V20.3125L50 0V100Z" fill="#0088CC"/>
        <path d="M50 37.5L25 50L50 62.5V37.5Z" fill="white"/>
        <path d="M51.25 37.5L75 50L51.25 62.5V37.5Z" fill="#E6E6E6"/>
    </svg>
  );
}
