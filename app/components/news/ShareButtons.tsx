"use client";

import { useEffect, useState } from "react";
import { Check, Link as LinkIcon, Mail } from "lucide-react";

type Labels = {
  whatsappLabel: string;
  copyLabel: string;
  copiedLabel: string;
  emailLabel: string;
};

type Props = {
  title: string;
  labels: Labels;
  fallbackPath: string;
};

export default function ShareButtons({ title, labels, fallbackPath }: Props) {
  const [shareUrl, setShareUrl] = useState(fallbackPath);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const shareText = `${title} — ${shareUrl}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const emailHref = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText)}`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const el = document.createElement("textarea");
        el.value = shareUrl;
        el.setAttribute("readonly", "");
        el.style.position = "absolute";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const iconClass =
    "cursor-pointer transition-opacity duration-300 hover:opacity-70";

  return (
    <div className="mt-4 flex justify-end items-center gap-5 text-gold">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={labels.whatsappLabel}
        title={labels.whatsappLabel}
        className={iconClass}
      >
        <WhatsAppIcon className="size-5" aria-hidden />
      </a>

      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? labels.copiedLabel : labels.copyLabel}
        title={copied ? labels.copiedLabel : labels.copyLabel}
        className={iconClass}
      >
        {copied ? (
          <Check className="size-5" aria-hidden />
        ) : (
          <LinkIcon className="size-5" aria-hidden />
        )}
      </button>

      <a
        href={emailHref}
        aria-label={labels.emailLabel}
        title={labels.emailLabel}
        className={iconClass}
      >
        <Mail className="size-5" aria-hidden />
      </a>
    </div>
  );
}

function WhatsAppIcon({
  className,
  ...rest
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
      {...rest}
    >
      <path d="M27.29 4.7A15.85 15.85 0 0 0 16.02 0C7.25 0 .12 7.13.12 15.9c0 2.8.73 5.53 2.12 7.94L0 32l8.36-2.19a15.9 15.9 0 0 0 7.66 1.95h.01c8.77 0 15.9-7.13 15.9-15.9 0-4.25-1.65-8.24-4.64-11.16Zm-11.27 24.5h-.01a13.2 13.2 0 0 1-6.73-1.84l-.48-.29-4.96 1.3 1.32-4.83-.31-.5A13.19 13.19 0 0 1 2.8 15.9c0-7.29 5.93-13.22 13.22-13.22 3.53 0 6.85 1.38 9.35 3.88a13.13 13.13 0 0 1 3.87 9.35c0 7.29-5.93 13.22-13.22 13.22Zm7.26-9.9c-.4-.2-2.36-1.17-2.72-1.3-.37-.13-.63-.2-.9.2-.26.4-1.03 1.3-1.26 1.56-.24.27-.46.3-.86.1a10.86 10.86 0 0 1-3.2-1.98 12 12 0 0 1-2.21-2.76c-.23-.4-.02-.61.17-.81.18-.18.4-.46.6-.7.2-.23.26-.4.4-.66.13-.27.07-.5-.03-.7-.1-.2-.9-2.17-1.23-2.97-.32-.78-.66-.67-.9-.68l-.77-.02a1.48 1.48 0 0 0-1.07.5c-.37.4-1.4 1.37-1.4 3.33s1.44 3.87 1.64 4.14c.2.27 2.82 4.3 6.83 6.03 2.55 1.1 3.55 1.19 4.82 1 .78-.12 2.36-.97 2.7-1.9.33-.94.33-1.74.23-1.9-.1-.17-.36-.27-.76-.47Z" />
    </svg>
  );
}
