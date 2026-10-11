import { SignupForm } from "./SignupForm";

export default function Signup() {
  return (
    <div className="mx-auto max-w-md px-5 pt-10">
      <h1 className="text-3xl font-semibold tracking-tight">Create your workspace</h1>
      <p className="mb-8 mt-2 text-ink/65">Takes about 30 seconds.</p>
      <SignupForm />
    </div>
  );
}
