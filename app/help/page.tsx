import { HelpForm } from "./HelpForm";

export default function Help() {
  return (
    <div className="mx-auto max-w-lg px-5 pt-10">
      <h1 className="text-3xl font-semibold tracking-tight">How can we help?</h1>
      <p className="mb-8 mt-2 text-ink/65">Tell us what went wrong and a human will get back to you.</p>
      <HelpForm />
    </div>
  );
}
