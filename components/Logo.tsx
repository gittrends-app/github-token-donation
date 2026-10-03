import type { SVGProps } from "react";

// "Merge Heart": two git branches rising from one commit to form a heart.
// Drawn inline so it follows the surrounding text color (or an explicit `color`).
export default function Logo({
  size = 32,
  color = "currentColor",
  ...props
}: { size?: number; color?: string } & Omit<SVGProps<SVGSVGElement>, "color">) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke={color}
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M32 49 L15.5 32.5 A9.5 9.5 0 0 1 29 20.5" />
      <path d="M32 49 L48.5 32.5 A9.5 9.5 0 0 0 35 20.5" />
      <circle cx="32" cy="49" r="5" fill={color} stroke="none" />
    </svg>
  );
}
