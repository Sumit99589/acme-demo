import Link from "next/link";

const PLANS = [
  { name: "Free", price: "$0", blurb: "For trying it out", items: ["3 members", "100 notes", "7-day history"] },
  {
    name: "Pro",
    price: "$12",
    blurb: "Per member, per month",
    items: ["Unlimited members and notes", "Decision records", "Full history and search"],
    featured: true,
  },
];

export default function Pricing() {
  return (
    <div className="mx-auto max-w-4xl px-5 pt-12">
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Simple pricing</h1>
      <p className="mt-3 text-ink/65">Start free. Upgrade when your team does.</p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={`rounded-3xl border p-7 ${p.featured ? "border-ink bg-ink text-paper" : "border-ink/10 bg-white"}`}
          >
            <h2 className="text-lg font-semibold">{p.name}</h2>
            <p className="mt-4 text-4xl font-semibold">{p.price}</p>
            <p className={`text-sm ${p.featured ? "text-paper/60" : "text-ink/55"}`}>{p.blurb}</p>
            <ul className="mt-6 space-y-2 text-sm">
              {p.items.map((i) => (
                <li key={i}>✓ {i}</li>
              ))}
            </ul>
            <Link
              href="/signup"
              className={`mt-8 block rounded-xl px-4 py-3 text-center font-medium ${p.featured ? "bg-paper text-ink" : "bg-ink text-paper"}`}
            >
              {p.featured ? "Start Pro" : "Start free"}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
