import type { SVGProps } from 'react';

export function MyTonWalletIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="24" cy="24" r="24" fill="#0098EA"/>
        <circle cx="24" cy="24" r="16" fill="white"/>
        <circle cx="24" cy="24" r="12" fill="#0098EA"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M24 16C19.5817 16 16 19.5817 16 24C16 28.4183 19.5817 32 24 32C28.4183 32 32 28.4183 32 24C32 19.5817 28.4183 16 24 16ZM14 24C14 18.4772 18.4772 14 24 14C29.5228 14 34 18.4772 34 24C34 29.5228 29.5228 34 24 34C18.4772 34 14 29.5228 14 24Z" fill="white"/>
    </svg>
  );
}
