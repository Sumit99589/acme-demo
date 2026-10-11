import { CheckoutForm } from "./CheckoutForm";

export default function Checkout() {
  return (
    <div className="mx-auto max-w-md px-5 pt-10">
      <h1 className="text-3xl font-semibold tracking-tight">Upgrade to Pro</h1>
      <div className="mb-8 mt-4 flex items-baseline justify-between rounded-2xl border border-ink/10 bg-white p-5">
        <span>Acme Notes Pro · monthly</span>
        <span className="text-xl font-semibold">$12.00</span>
      </div>
      <CheckoutForm />
    </div>
  );
}
