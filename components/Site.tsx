import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-ink text-paper">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M6 4h9l3 3v13H6z" />
          <path d="M9 11h6M9 15h4" />
        </svg>
      </span>
      Acme Notes
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
      <Logo />
      <nav className="flex items-center gap-1 text-sm">
        <Link href="/pricing" className="rounded-lg px-3 py-2 text-ink/70 hover:text-ink">
          Pricing
        </Link>
        <Link href="/help" className="hidden rounded-lg px-3 py-2 text-ink/70 hover:text-ink sm:block">
          Help
        </Link>
        <Link href="/signup" className="rounded-lg bg-ink px-3.5 py-2 font-medium text-paper hover:bg-ink/85">
          Sign up
        </Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-24 max-w-6xl border-t border-ink/10 px-5 pb-36 pt-8 text-sm text-ink/55">
      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <p>© 2026 Acme Notes. A fictional sandbox product for the Whydunit demo.</p>
        <div className="flex gap-4">
          <Link href="/pricing">Pricing</Link>
          <Link href="/help">Help</Link>
        </div>
      </div>
    </footer>
  );
}
