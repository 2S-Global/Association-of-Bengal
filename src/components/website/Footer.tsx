import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-container-highest border-t border-outline-variant w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-8 md:px-12 py-10 lg:py-12 max-w-container-max mx-auto">
        {/* Brand Section */}
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <div className="text-xl font-bold text-primary tracking-wide">
            ASSOCIATION OF BENGAL FOR LITERATURE AND CULTURE
          </div>
          <p className="text-sm leading-relaxed text-on-surface-variant max-w-sm">
            Promoting literature, art, and local culture through organized
            exhibitions and events since 1954.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-primary uppercase tracking-widest">
            Navigation
          </h4>
          <nav className="flex flex-col space-y-2.5">
            <Link
              href="/archives"
              className="text-on-surface-variant text-sm hover:text-primary transition-colors w-fit"
            >
              Archives
            </Link>
            <Link
              href="/privacy-policy"
              className="text-on-surface-variant text-sm hover:text-primary transition-colors w-fit"
            >
              Privacy Policy
            </Link>
            <Link
              href="/support-us"
              className="text-on-surface-variant text-sm hover:text-primary transition-colors w-fit"
            >
              Support Us
            </Link>
            <Link
              href="/newsletter"
              className="text-on-surface-variant text-sm hover:text-primary transition-colors w-fit"
            >
              Newsletter
            </Link>
          </nav>
        </div>

        {/* Contact / Address */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-primary uppercase tracking-widest">
            Connect
          </h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-on-surface-variant text-sm">
              <span className="material-symbols-outlined text-secondary shrink-0 mt-0.5">
                location_on
              </span>
              <span>
                26/2 Surya Sen Street,
                <br />
                Kolkata, India, West Bengal
              </span>
            </div>
            <div className="flex items-center gap-3 text-on-surface-variant text-sm">
              <span className="material-symbols-outlined text-secondary shrink-0">
                mail
              </span>
              <a
                href="mailto:bengalassociation2026@gmail.com"
                className="hover:text-primary transition-colors"
              >
                bengalassociation2026@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-outline-variant/30 py-6 px-4 sm:px-6 max-w-container-max mx-auto text-center">
        <p className="text-xs text-on-surface-variant opacity-70">
          © {currentYear} Bengal Association for Literature and Culture. All Rights
          Reserved.
        </p>
      </div>
    </footer>
  );
}