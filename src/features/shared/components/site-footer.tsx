import { siteContent } from "@/content/site";

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function IconMail({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export function SiteFooter() {
  const { instagram, email, whatsapp } = siteContent.social;
  const whatsappHref = `${whatsapp}?text=${encodeURIComponent(
    "¡Hola! ¿Me podrías dar más información sobre Fundas Argon?",
  )}`;

  return (
    <footer className="mt-6 border-t border-[var(--color-border)] pt-5 pb-2">
      <div className="flex flex-wrap items-center justify-center gap-6">
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="argon-footer-link"
          aria-label="Instagram Fundas Argon"
        >
          <IconInstagram className="h-4 w-4" />
        </a>
        <a href={email} className="argon-footer-link" aria-label="Enviar email a Fundas Argon">
          <IconMail className="h-4 w-4" />
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="argon-footer-link"
          aria-label="WhatsApp Fundas Argon"
        >
          <IconWhatsApp className="h-4 w-4" />
        </a>
      </div>
    </footer>
  );
}
