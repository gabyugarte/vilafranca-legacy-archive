type FormActionsProps = {
  saving: boolean;
  onCancel: () => void;
};

export function FormActions({
  saving,
  onCancel,
}: FormActionsProps) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-full border px-4 py-2"
      >
        Cancelar
      </button>

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
      >
        {saving ? "Guardando..." : "Guardar"}
      </button>
    </div>
  );
}