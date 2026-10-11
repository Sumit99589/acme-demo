export function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input
        {...rest}
        className="w-full rounded-xl border border-ink/15 bg-white px-3.5 py-3 outline-none ring-accent/30 focus:border-ink/40 focus:ring-4"
      />
    </label>
  );
}
