type TextAreaFieldProps = {
  label: string;
  value?: string | null;
  placeholder?: string;
  rows?: number;
  onChange: (value: string) => void;
};

export function TextAreaField({
  label,
  value,
  placeholder,
  rows = 5,
  onChange,
}: TextAreaFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {label}
      </label>

      <textarea
        rows={rows}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border p-2"
      />
    </div>
  );
}