interface LogoProps {
  className?: string;
}

export default function Logo({ className = "h-12 w-12" }: LogoProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path
        d="M24 3 45 24 24 45 3 24 24 3Z"
        stroke="#5AA0F5"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path d="M24 14 34 24 24 34 14 24 24 14Z" fill="#5AA0F5" />
    </svg>
  );
}