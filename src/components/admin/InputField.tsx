type InputFieldProps = {
  label: string;
  value?: string | null;
  placeholder?: string;
  type?: string;
  onChange: (value: string) => void;
};

export function InputField({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: InputFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {label}
      </label>

      <input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border p-2"
      />
    </div>
  );
}