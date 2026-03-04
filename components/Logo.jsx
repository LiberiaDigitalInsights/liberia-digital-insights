import Link from "next/link";
import LazyImage from "./LazyImage";

export default function Logo({ className, noLink = false }) {
  const content = (
    <div className="flex items-center gap-2">
      <div className="h-10 w-10 relative overflow-hidden rounded-sm">
        <LazyImage
          src="/LDI_favicon.png"
          alt="LDI"
          className="h-full w-full object-contain"
          priority
        />
      </div>
      <span className="text-sm font-semibold tracking-tight text-white">
        Liberia Digital Insights
      </span>
    </div>
  );

  if (noLink) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link
      href="/"
      aria-label="Liberia Digital Insights home"
      className={className}
    >
      {content}
    </Link>
  );
}
