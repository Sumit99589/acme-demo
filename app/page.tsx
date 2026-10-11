import Link from "next/link";

const FEATURES = [
  ["Write together", "Live cursors, comments and suggestions on every note, without a meeting."],
  ["Find anything", "Search that understands your team's words, across every workspace."],
  ["Decide once", "Turn a note into a decision record with owners and a review date."],
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-5">
      <section className="grid gap-12 pb-16 pt-14 md:grid-cols-[1.1fr_0.9fr] md:items-center md:pt-24">
        <div>
          <p className="mb-5 inline-flex rounded-full border border-ink/15 px-3 py-1 text-xs font-medium uppercase tracking-wider text-ink/60">
            New · Decision records
          </p>
          <h1 className="text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
            Notes your whole team actually reads.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink/70">
            Acme Notes keeps meeting notes, specs and decisions in one calm place, so nobody has to ask
            &ldquo;where did we land on this?&rdquo; again.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className="rounded-xl bg-ink px-5 py-3 font-medium text-paper hover:bg-ink/85">
              Start free
            </Link>
            <Link href="/pricing" className="rounded-xl border border-ink/15 px-5 py-3 font-medium hover:bg-ink/5">
              See pricing
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-ink/10 bg-white p-5 shadow-[0_30px_80px_-40px_rgba(23,21,15,0.35)]">
          <div className="mb-4 flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
          </div>
          <p className="text-xs font-medium uppercase tracking-wider text-accent">Decision · Q4 roadmap</p>
          <h2 className="mt-2 text-2xl font-semibold">Ship offline mode before the iPad app</h2>
          <ul className="mt-4 space-y-2 text-sm text-ink/70">
            <li>✓ Owner: Priya · Review on Nov 14</li>
            <li>✓ 3 comments resolved, 1 open</li>
            <li>✓ Linked: spec, research notes, launch plan</li>
          </ul>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {FEATURES.map(([t, d]) => (
          <div key={t} className="rounded-2xl border border-ink/10 bg-white/60 p-6">
            <h3 className="font-semibold">{t}</h3>
            <p className="mt-2 text-sm text-ink/65">{d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
