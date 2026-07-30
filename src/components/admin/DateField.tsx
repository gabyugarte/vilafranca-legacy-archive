type DateFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function DateField({
  label,
  value,
  onChange,
}: DateFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {label}
      </label>

      <input
        type="date"
        className="w-full rounded-lg border p-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}