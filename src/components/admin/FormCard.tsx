import { ReactNode } from "react";

type FormCardProps = {
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
};

export function FormCard({
  title,
  onSubmit,
  children,
}: FormCardProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-xl space-y-6 rounded-2xl bg-background p-6 shadow-lg"
    >
      <h2 className="text-2xl font-bold">
        {title}
      </h2>

      {children}
    </form>
  );
}