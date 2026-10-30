import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function GithubIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M9 19c-4 1.5-4-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
    </svg>
  );
}

export function WechatIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M9.2 4.5c-3.5 0-6.2 2.4-6.2 5.4 0 1.8.9 3.3 2.3 4.3l-.6 2.3 2.4-1.1c.6.2 1.3.3 2.1.3" />
      <path d="M10.9 10.3c-3 0-5.4 2.1-5.4 4.7 0 1.6.8 2.9 2 3.7l-.5 2 2.1-1c.5.2 1.1.3 1.8.3 3 0 5.4-2.1 5.4-4.8s-2.4-4.9-5.4-4.9Z" />
      <path d="M8.6 14.2h.01M12.2 14.2h.01" />
    </svg>
  );
}

export function QqIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M12 3.2c-2.6 0-4.2 1.9-4.2 4.4 0 1.5-.7 2.4-1.5 3.6-.7 1-1.1 1.9-1.1 3 0 1.2.8 1.9 2.2 1.9h9.2c1.4 0 2.2-.7 2.2-1.9 0-1.1-.4-2-1.1-3-.8-1.2-1.5-2.1-1.5-3.6 0-2.5-1.6-4.4-4.2-4.4Z" />
      <path d="M9.6 8.6h.01M14.4 8.6h.01" />
      <path d="m11.1 10.6 .9.8 .9-.8" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M6.5 3.5h2.2l1.3 3.2-1.8 1.2a12 12 0 0 0 5.4 5.4l1.2-1.8 3.2 1.3v2.2a1.7 1.7 0 0 1-1.9 1.7A15.4 15.4 0 0 1 4.8 5.4 1.7 1.7 0 0 1 6.5 3.5Z" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}

export function ExternalIcon(props: IconProps) {
  return (
    <svg {...base(props)} aria-hidden="true">
      <path d="M14 4h6v6M20 4l-9 9M10 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-4" />
    </svg>
  );
}