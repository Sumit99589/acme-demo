import Link from "next/link";

const STEPS = ["Name your workspace", "Invite two teammates", "Write your first decision record"];

export default function Onboarding() {
  return (
    <div className="mx-auto max-w-lg px-5 pt-10">
      <p className="text-sm font-medium text-sage">Account created</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Welcome to Acme Notes</h1>
      <ol className="mt-8 space-y-3">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-white p-4">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-ink/5 text-sm font-semibold">{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>
      <div className="mt-8 rounded-2xl bg-ink p-6 text-paper">
        <h2 className="font-semibold">Try Pro free for your team</h2>
        <p className="mt-1 text-sm text-paper/65">Decision records, full history and unlimited members. $12 per member.</p>
        <Link
          href="/checkout"
          data-testid="go-checkout"
          className="mt-4 inline-block rounded-xl bg-paper px-4 py-2.5 font-medium text-ink"
        >
          Upgrade to Pro
        </Link>
      </div>
    </div>
  );
}
